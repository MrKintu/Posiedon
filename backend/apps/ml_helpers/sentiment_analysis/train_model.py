import os
import logging
import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoModelForSequenceClassification, AutoTokenizer, TrainingArguments, Trainer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
import datetime
import json
import traceback
import time
import re
from transformers import get_linear_schedule_with_warmup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib

# Set up logging
logger = logging.getLogger(__name__)

def setup_gpu():
    """Configure and verify GPU setup"""
    try:
        # Try Intel GPU (XPU) first
        if hasattr(torch, 'xpu') and torch.xpu.is_available():
            import intel_extension_for_pytorch as ipex
            device = torch.device('xpu')
            logger.info("Using Intel GPU (XPU) for training")
            logger.info(f"Device name: {torch.xpu.get_device_name()}")
            return device, True
        # Fall back to CUDA if available
        elif torch.cuda.is_available():
            device = torch.device('cuda')
            logger.info("Using CUDA GPU for training")
            logger.info(f"Device name: {torch.cuda.get_device_name(0)}")
            return device, True
        else:
            logger.warning("No GPU found. Using CPU for training")
            return torch.device('cpu'), False
    except Exception as e:
        logger.error(f"Error setting up GPU: {str(e)}")
        logger.warning("Falling back to CPU")
        return torch.device('cpu'), False

# Try to set up GPU first
device, is_gpu_available = setup_gpu()

# Set up logging
current_dir = os.path.dirname(os.path.abspath(__file__))
log_dir = os.path.join(current_dir, 'logs')
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, 'train_model.log')),
        logging.StreamHandler()
    ]
)

# Constants
SENTIMENT_LABELS = ['negative', 'neutral', 'positive']
ENGAGEMENT_LABELS = ['low', 'medium', 'high']

# Sentiment Model Parameters (larger dataset)
SENTIMENT_BATCH_SIZE = 32  # Increased due to larger dataset
SENTIMENT_ITERATIONS = 10  # Reduced as we have more data per iteration
SENTIMENT_EPOCHS = 3
SENTIMENT_LEARNING_RATE = 2e-5
SENTIMENT_BATCHES_PER_EPOCH = max(1, 27481 // (SENTIMENT_BATCH_SIZE * 10))  # Ensure we see all data

# Engagement Model Parameters (smaller dataset)
ENGAGEMENT_BATCH_SIZE = 16  # Smaller batch size for better generalization
ENGAGEMENT_ITERATIONS = 15  # Increased iterations due to smaller dataset
ENGAGEMENT_EPOCHS = 3
ENGAGEMENT_LEARNING_RATE = 2e-5
ENGAGEMENT_BATCHES_PER_EPOCH = max(1, 732 // (ENGAGEMENT_BATCH_SIZE * 5))  # Ensure we see all data

# Shared parameters
MAX_LENGTH = 256
NUM_WORKERS = 4  # Optimize data loading

# Intel optimization settings
IPEX_OPTIMIZE = True
QUANTIZE_MODEL = True

# Model directories
BASE_MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'ml_models')
SENTIMENT_MODEL_DIR = os.path.join(BASE_MODEL_DIR, 'sentiment_model')
ENGAGEMENT_MODEL_DIR = os.path.join(BASE_MODEL_DIR, 'engagement_model')
META_MODEL_DIR = os.path.join(BASE_MODEL_DIR, 'sentiment_analysis')

# Ensure directories exist
os.makedirs(SENTIMENT_MODEL_DIR, exist_ok=True)
os.makedirs(ENGAGEMENT_MODEL_DIR, exist_ok=True)
os.makedirs(META_MODEL_DIR, exist_ok=True)

def normalize_label(label):
    """Normalize sentiment and engagement labels"""
    if pd.isna(label) or not isinstance(label, str):
        return 'neutral'  # Default to neutral for invalid inputs
    
    label = str(label).lower().strip()
    
    # Sentiment normalization
    if label in ['negative', 'neg', '-1', 'n']:
        return 'negative'
    elif label in ['positive', 'pos', '1', 'p']:
        return 'positive'
    elif label in ['neutral', 'neu', '0', 'medium', 'med', 'm']:
        return 'neutral'
    # Engagement normalization
    elif label in ['low', 'l']:
        return 'low'
    elif label in ['high', 'h']:
        return 'high'
    else:
        return 'neutral'  # Default case

def preprocess_text(text):
    """Preprocess text for better model understanding"""
    if pd.isna(text) or not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = str(text).lower()
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Remove URLs (simple pattern)
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters but keep emoticons and important punctuation
    text = re.sub(r'[^\w\s!?.,;:)(><=/\-\+\]\[@#$%^&*]', '', text)
    
    return text.strip()

class TextDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length, label_mapping):
        # Preprocess all texts
        self.texts = [preprocess_text(text) for text in texts]
        
        # Normalize and map labels, with error handling
        self.labels = []
        label_counts = {}
        for label in labels:
            try:
                normalized = normalize_label(label)
                if normalized not in label_mapping:
                    logger.warning(f"Normalized label '{normalized}' not found in mapping, using default")
                    normalized = list(label_mapping.keys())[1]
                self.labels.append(label_mapping[normalized])
                label_counts[normalized] = label_counts.get(normalized, 0) + 1
            except Exception as e:
                logger.warning(f"Error processing label {label}: {str(e)}, using default")
                normalized = list(label_mapping.keys())[1]
                self.labels.append(label_mapping[normalized])
                label_counts[normalized] = label_counts.get(normalized, 0) + 1
        
        logger.info(f"Label distribution: {label_counts}")
        
        self.tokenizer = tokenizer
        self.max_length = max_length
        
        # Calculate class weights for weighted loss
        total_samples = sum(label_counts.values())
        self.class_weights = {
            label_mapping[label]: total_samples / (len(label_counts) * count)
            for label, count in label_counts.items()
        }
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        # Get item with device placement
        item = self.tokenizer(
            self.texts[idx],
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        # Move tensors to appropriate device
        for key in item:
            item[key] = item[key].squeeze().to(device)
            
        return {
            'input_ids': item['input_ids'],
            'attention_mask': item['attention_mask'],
            'labels': torch.tensor(self.labels[idx], dtype=torch.long).to(device)
        }

class MetaModel:
    def __init__(self, transformer_model, tfidf_model=None, lr_model=None):
        self.transformer_model = transformer_model
        self.tfidf_model = tfidf_model if tfidf_model else TfidfVectorizer(max_features=5000)
        self.lr_model = lr_model if lr_model else LogisticRegression(max_iter=1000)
        self.scaler = StandardScaler()
        
    def fit(self, texts, labels, tokenizer):
        # Get transformer embeddings
        self.transformer_model.eval()
        embeddings = []
        
        with torch.no_grad():
            for text in texts:
                inputs = tokenizer(
                    text,
                    max_length=MAX_LENGTH,
                    padding='max_length',
                    truncation=True,
                    return_tensors='pt'
                )
                outputs = self.transformer_model(**inputs)
                embeddings.append(outputs.logits.numpy()[0])
        
        # Get TF-IDF features
        tfidf_features = self.tfidf_model.fit_transform(texts).toarray()
        
        # Combine features
        combined_features = np.hstack([np.array(embeddings), tfidf_features])
        
        # Scale features
        scaled_features = self.scaler.fit_transform(combined_features)
        
        # Train logistic regression
        self.lr_model.fit(scaled_features, labels)
    
    def predict(self, texts, tokenizer):
        # Get transformer embeddings
        self.transformer_model.eval()
        embeddings = []
        
        with torch.no_grad():
            for text in texts:
                inputs = tokenizer(
                    text,
                    max_length=MAX_LENGTH,
                    padding='max_length',
                    truncation=True,
                    return_tensors='pt'
                )
                outputs = self.transformer_model(**inputs)
                embeddings.append(outputs.logits.numpy()[0])
        
        # Get TF-IDF features
        tfidf_features = self.tfidf_model.transform(texts).toarray()
        
        # Combine features
        combined_features = np.hstack([np.array(embeddings), tfidf_features])
        
        # Scale features
        scaled_features = self.scaler.transform(combined_features)
        
        # Make predictions
        return self.lr_model.predict(scaled_features)

def calculate_metrics(y_true, y_pred, y_pred_proba=None):
    """Calculate comprehensive evaluation metrics"""
    metrics = {}
    
    # Basic metrics
    metrics['accuracy'] = accuracy_score(y_true, y_pred)
    metrics['precision_macro'] = precision_score(y_true, y_pred, average='macro', zero_division=0)
    metrics['recall_macro'] = recall_score(y_true, y_pred, average='macro', zero_division=0)
    metrics['f1_macro'] = f1_score(y_true, y_pred, average='macro', zero_division=0)
    
    # Get unique classes and ensure they're sorted
    unique_classes = np.unique(y_true)
    n_classes = len(unique_classes)
    
    # Only calculate ROC AUC if we have probabilities and multiple classes
    if y_pred_proba is not None and n_classes > 1:
        try:
            # For binary classification
            if n_classes == 2:
                metrics['roc_auc'] = roc_auc_score(y_true, y_pred_proba[:, 1])
            # For multi-class
            else:
                # Convert true labels to one-hot encoding
                y_true_onehot = np.zeros((len(y_true), n_classes))
                for i, label in enumerate(y_true):
                    y_true_onehot[i, label] = 1
                
                # Calculate ROC AUC using one-vs-rest approach
                metrics['roc_auc'] = roc_auc_score(
                    y_true_onehot,
                    y_pred_proba,
                    multi_class='ovr',
                    average='macro'
                )
        except Exception as e:
            logger.warning(f"Could not calculate ROC AUC score: {str(e)}")
            metrics['roc_auc'] = None
    else:
        metrics['roc_auc'] = None
    
    # Confusion matrix
    metrics['confusion_matrix'] = confusion_matrix(y_true, y_pred).tolist()
    
    return metrics, unique_classes

def train_model(model_type='both'):
    """
    Train sentiment and engagement models
    """
    try:
        # Load and preprocess data
        data_file = os.path.join(current_dir, 'data1.csv')
        if not os.path.exists(data_file):
            raise FileNotFoundError(f"Training data file not found at: {data_file}")
            
        data = pd.read_csv(data_file)
        logger.info(f"Loaded training data from {data_file}")
        logger.info(f"Available columns: {data.columns.tolist()}")
        
        # Ensure required columns exist
        if 'text' not in data.columns:
            raise ValueError("Training data must contain 'text' column")
            
        if 'sentiment' not in data.columns:
            raise ValueError("Training data must contain 'sentiment' column")
        
        # For engagement model, create engagement column if it doesn't exist
        if model_type in ['engagement', 'both']:
            if 'engagement' not in data.columns:
                # Map sentiment to engagement: negative->low, neutral->medium, positive->high
                engagement_map = {'negative': 'low', 'neutral': 'medium', 'positive': 'high'}
                data['engagement'] = data['sentiment'].map(engagement_map)
                logger.info("Created engagement column from sentiment data")
                logger.info(f"Engagement value counts:\n{data['engagement'].value_counts()}")
        
        # Initialize tokenizer
        tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
        
        if model_type in ['sentiment', 'both']:
            logger.info("\nTraining Sentiment Model...")
            sentiment_model = AutoModelForSequenceClassification.from_pretrained(
                'distilbert-base-uncased',
                num_labels=3
            ).to(device)
            
            # Initialize model with Intel optimizations if available
            if IPEX_OPTIMIZE:
                try:
                    # Enable Intel GPU optimizations
                    logger.info("Intel GPU optimizations enabled")
                    
                    # Quantization for better performance
                    if QUANTIZE_MODEL:
                        try:
                            # Import Intel PyTorch extensions
                            import intel_extension_for_pytorch as ipex
                            # Quantize the model
                            sentiment_model = ipex.optimize(sentiment_model)
                            logger.info("Model quantization completed successfully")
                        except Exception as e:
                            logger.warning(f"Model quantization failed: {str(e)}")
                            logger.info("Continuing with unquantized model")
                except Exception as e:
                    logger.warning(f"Failed to enable Intel optimizations: {str(e)}")
            
            # Create datasets for sentiment model
            label_mapping = {label: idx for idx, label in enumerate(SENTIMENT_LABELS)}
            train_texts, test_texts, train_labels, test_labels = train_test_split(
                data['text'].values,
                data['sentiment'].values,
                test_size=0.2,
                random_state=42,
                stratify=data['sentiment'].values
            )
            
            # Create train and test datasets
            train_dataset = TextDataset(
                texts=train_texts,
                labels=train_labels,
                tokenizer=tokenizer,
                max_length=MAX_LENGTH,
                label_mapping=label_mapping
            )
            test_dataset = TextDataset(
                texts=test_texts,
                labels=test_labels,
                tokenizer=tokenizer,
                max_length=MAX_LENGTH,
                label_mapping=label_mapping
            )
            
            # Create data loaders with optimized settings
            train_dataloader = DataLoader(
                train_dataset,
                batch_size=SENTIMENT_BATCH_SIZE,
                shuffle=True,
                num_workers=NUM_WORKERS,
                pin_memory=True
            )
            
            val_dataloader = DataLoader(
                test_dataset,
                batch_size=SENTIMENT_BATCH_SIZE,
                shuffle=False,
                num_workers=NUM_WORKERS,
                pin_memory=True
            )
            
            # Training loop
            for iteration in range(SENTIMENT_ITERATIONS):
                logger.info(f"\nSentiment Training Iteration {iteration + 1}/{SENTIMENT_ITERATIONS}")
                
                # Training arguments for this iteration
                training_args = TrainingArguments(
                    output_dir=os.path.join(SENTIMENT_MODEL_DIR, f'iteration_{iteration}'),
                    eval_strategy='epoch',
                    per_device_train_batch_size=SENTIMENT_BATCH_SIZE,
                    per_device_eval_batch_size=SENTIMENT_BATCH_SIZE,
                    num_train_epochs=SENTIMENT_EPOCHS,
                    learning_rate=SENTIMENT_LEARNING_RATE,
                    weight_decay=0.01,
                    logging_dir=os.path.join(log_dir, 'sentiment_logs'),
                    logging_steps=100,
                    save_strategy='epoch',
                    load_best_model_at_end=True,
                    metric_for_best_model='eval_loss',
                    use_cpu=not is_gpu_available,  # Only use CPU if GPU is not available
                    fp16=is_gpu_available,  # Enable mixed precision training on GPU
                    bf16=is_gpu_available and device.type == 'xpu',  # Use bfloat16 for Intel GPUs
                )
                
                # Create trainer for this iteration
                trainer = Trainer(
                    model=sentiment_model,
                    args=training_args,
                    train_dataset=train_dataset,
                    eval_dataset=test_dataset,
                    compute_metrics=calculate_metrics,
                    processing_class=tokenizer.__class__  # Updated from tokenizer
                )
                
                # Train the model for this iteration
                trainer.train()
                
                # Evaluate after each iteration
                logger.info(f"\nEvaluating Sentiment Model - Iteration {iteration + 1}")
                evaluate_model(sentiment_model, test_dataset, SENTIMENT_LABELS)
            
            # Save final model and tokenizer
            sentiment_model.save_pretrained(SENTIMENT_MODEL_DIR)
            tokenizer.save_pretrained(SENTIMENT_MODEL_DIR)
            
            # Train and save meta-model
            sentiment_meta_model = train_meta_model(sentiment_model, train_texts, train_labels, test_texts, test_labels)
            joblib.dump(sentiment_meta_model.tfidf_model, os.path.join(META_MODEL_DIR, 'sentiment_tfidf.joblib'))
            joblib.dump(sentiment_meta_model.lr_model, os.path.join(META_MODEL_DIR, 'sentiment_lr.joblib'))
            joblib.dump(sentiment_meta_model.scaler, os.path.join(META_MODEL_DIR, 'sentiment_scaler.joblib'))
        
        if model_type in ['engagement', 'both']:
            logger.info("\nTraining Engagement Model...")
            engagement_model = AutoModelForSequenceClassification.from_pretrained(
                'distilbert-base-uncased',
                num_labels=3
            ).to(device)
            
            # Initialize model with Intel optimizations if available
            if IPEX_OPTIMIZE:
                try:
                    # Enable Intel GPU optimizations
                    logger.info("Intel GPU optimizations enabled")
                    
                    # Quantization for better performance
                    if QUANTIZE_MODEL:
                        try:
                            # Import Intel PyTorch extensions
                            import intel_extension_for_pytorch as ipex
                            # Quantize the model
                            engagement_model = ipex.optimize(engagement_model)
                            logger.info("Model quantization completed successfully")
                        except Exception as e:
                            logger.warning(f"Model quantization failed: {str(e)}")
                            logger.info("Continuing with unquantized model")
                except Exception as e:
                    logger.warning(f"Failed to enable Intel optimizations: {str(e)}")
            
            # Create datasets for engagement model
            label_mapping = {label: idx for idx, label in enumerate(ENGAGEMENT_LABELS)}
            train_texts, test_texts, train_labels, test_labels = train_test_split(
                data['text'].values,
                data['engagement'].values,
                test_size=0.2,
                random_state=42,
                stratify=data['engagement'].values
            )
            
            # Create train and test datasets
            train_dataset = TextDataset(
                texts=train_texts,
                labels=train_labels,
                tokenizer=tokenizer,
                max_length=MAX_LENGTH,
                label_mapping=label_mapping
            )
            test_dataset = TextDataset(
                texts=test_texts,
                labels=test_labels,
                tokenizer=tokenizer,
                max_length=MAX_LENGTH,
                label_mapping=label_mapping
            )
            
            # Create data loaders with optimized settings
            train_dataloader = DataLoader(
                train_dataset,
                batch_size=ENGAGEMENT_BATCH_SIZE,
                shuffle=True,
                num_workers=NUM_WORKERS,
                pin_memory=True
            )
            
            val_dataloader = DataLoader(
                test_dataset,
                batch_size=ENGAGEMENT_BATCH_SIZE,
                shuffle=False,
                num_workers=NUM_WORKERS,
                pin_memory=True
            )
            
            # Training loop
            for iteration in range(ENGAGEMENT_ITERATIONS):
                logger.info(f"\nEngagement Training Iteration {iteration + 1}/{ENGAGEMENT_ITERATIONS}")
                
                # Training arguments for this iteration
                training_args = TrainingArguments(
                    output_dir=os.path.join(ENGAGEMENT_MODEL_DIR, f'iteration_{iteration}'),
                    evaluation_strategy="epoch",
                    save_strategy="epoch",
                    learning_rate=ENGAGEMENT_LEARNING_RATE,
                    per_device_train_batch_size=ENGAGEMENT_BATCH_SIZE,
                    per_device_eval_batch_size=ENGAGEMENT_BATCH_SIZE,
                    num_train_epochs=ENGAGEMENT_EPOCHS,
                    weight_decay=0.01,
                    logging_dir=os.path.join(ENGAGEMENT_MODEL_DIR, 'logs'),
                    logging_steps=10,
                    load_best_model_at_end=True,
                    metric_for_best_model="eval_loss",
                    greater_is_better=False,
                    report_to=[],
                    save_total_limit=2,
                    overwrite_output_dir=True
                )
                
                # Create trainer for this iteration
                trainer = Trainer(
                    model=engagement_model,
                    args=training_args,
                    train_dataset=train_dataset,
                    eval_dataset=test_dataset,
                    tokenizer=tokenizer,
                )
                
                # Train the model for this iteration
                trainer.train()
                
                # Evaluate after each iteration
                logger.info(f"\nEvaluating Engagement Model - Iteration {iteration + 1}")
                evaluate_model(engagement_model, test_dataset, ENGAGEMENT_LABELS)
            
            # Save final model and tokenizer
            engagement_model.save_pretrained(ENGAGEMENT_MODEL_DIR)
            tokenizer.save_pretrained(ENGAGEMENT_MODEL_DIR)
            
            # Train and save meta-model
            engagement_meta_model = train_meta_model(engagement_model, train_texts, train_labels, test_texts, test_labels)
            joblib.dump(engagement_meta_model.tfidf_model, os.path.join(META_MODEL_DIR, 'engagement_tfidf.joblib'))
            joblib.dump(engagement_meta_model.lr_model, os.path.join(META_MODEL_DIR, 'engagement_lr.joblib'))
            joblib.dump(engagement_meta_model.scaler, os.path.join(META_MODEL_DIR, 'engagement_scaler.joblib'))
        
        logger.info("Model training completed successfully")
        
    except Exception as e:
        logger.error(f"Error during model training: {str(e)}")
        raise

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Train sentiment and engagement models')
    parser.add_argument('--model', choices=['sentiment', 'engagement', 'both'], 
                      default='both', help='Model type to train')
    
    args = parser.parse_args()
    train_model(args.model)

if __name__ == "__main__":
    main()
