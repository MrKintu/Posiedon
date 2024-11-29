import os
import logging
import pandas as pd
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
import joblib
import torch
from torch.utils.data import Dataset, DataLoader

# Set up logging
current_dir = os.path.dirname(os.path.abspath(__file__))
log_dir = os.path.join(current_dir, 'logs')
model_base_dir = os.path.join(current_dir, '..', '..', '..', 'ml_models')

if not os.path.exists(log_dir):
    os.makedirs(log_dir)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, 'create_model.log')),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def normalize_label(label):
    # Convert to lowercase and strip whitespace
    normalized = label.lower().strip()
    # Map emotions to sentiment categories
    positive_emotions = {
        'happy', 'joy', 'excited', 'enthusiasm', 'euphoria', 'proud', 'pride', 'gratitude',
        'hope', 'optimism', 'satisfaction', 'confidence', 'admiration', 'love', 'happiness',
        'positive', 'radiance', 'dazzle', 'elation', 'triumph', 'blessed', 'success',
        'accomplishment', 'celebration', 'playful', 'inspiration', 'motivated'
    }
    negative_emotions = {
        'sad', 'angry', 'fear', 'disgust', 'grief', 'regret', 'shame', 'guilt',
        'disappointment', 'frustration', 'anxiety', 'despair', 'negative', 'heartbreak',
        'sorrow', 'depression', 'melancholy', 'hatred', 'jealousy', 'envy', 'bitterness',
        'loneliness', 'devastated', 'suffering', 'pain', 'darkness', 'desolation'
    }
    neutral_emotions = {
        'neutral', 'calm', 'indifferent', 'ambivalent', 'contemplative', 'pensive',
        'reflection', 'acceptance', 'numbness', 'confusion', 'surprise', 'wonder',
        'curiosity', 'anticipation'
    }
    
    # Clean the normalized label further by removing any remaining spaces
    normalized = ''.join(normalized.split())
    # Map to sentiment categories
    if any(emotion in normalized for emotion in positive_emotions):
        return 'positive'
    elif any(emotion in normalized for emotion in negative_emotions):
        return 'negative'
    else:
        return 'neutral'

# Constants
MAX_LENGTH = 256  # Increased max length to capture more context
BATCH_SIZE = 16

class TextDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length, label_mapping):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
        self.label_mapping = label_mapping

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]

        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(self.label_mapping[label])
        }

def create_models():
    """
    Create sentiment analysis, engagement prediction, and meta models
    """
    try:
        logger.info("Starting model creation process")
        
        # Create model directories if they don't exist
        sentiment_dir = os.path.join(model_base_dir, 'sentiment_model')
        engagement_dir = os.path.join(model_base_dir, 'engagement_model')
        meta_dir = os.path.join(model_base_dir, 'sentiment_analysis')
        
        for directory in [sentiment_dir, engagement_dir, meta_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
                logger.info(f"Created directory: {directory}")

        # Load and preprocess data
        sentiment_data_path = os.path.join(current_dir, 'data1.csv')
        engagement_data_path = os.path.join(current_dir, 'data2.csv')
        sentiment_data = pd.read_csv(sentiment_data_path)
        engagement_data = pd.read_csv(engagement_data_path)
        
        logger.info(f"Initial sentiment data columns: {list(sentiment_data.columns)}")
        logger.info(f"Initial engagement data columns: {list(engagement_data.columns)}")
        
        # Calculate engagement score before standardization
        def calculate_engagement_score(df):
            """Calculate engagement score from available metrics"""
            score_components = []
            
            # Check for different possible column names
            like_columns = ['likes', 'Likes', 'like_count', 'LikeCount']
            retweet_columns = ['retweets', 'Retweets', 'retweet_count', 'RetweetCount']
            reply_columns = ['replies', 'Replies', 'reply_count', 'ReplyCount']
            
            # Find available metrics
            for cols in [like_columns, retweet_columns, reply_columns]:
                for col in cols:
                    if col in df.columns:
                        score_components.append(df[col].fillna(0))
                        break
            
            if not score_components:
                logger.warning("No engagement metrics found. Using random scores for demonstration.")
                return np.random.uniform(0, 1, len(df))
            
            # Normalize and combine metrics
            normalized_components = []
            for component in score_components:
                max_val = component.max()
                if max_val > 0:
                    normalized_components.append(component / max_val)
                else:
                    normalized_components.append(component)
            
            # Calculate final score
            engagement_score = sum(normalized_components) / len(normalized_components)
            
            logger.info(f"Calculated engagement scores: min={engagement_score.min():.2f}, max={engagement_score.max():.2f}, mean={engagement_score.mean():.2f}")
            return engagement_score

        # Calculate and add engagement score
        engagement_data['engagement_score'] = calculate_engagement_score(engagement_data)
        
        # Standardize column names
        def standardize_columns(df):
            column_mapping = {
                'Text': 'text',
                'TEXT': 'text',
                'text_content': 'text',
                'content': 'text',
                'Sentiment': 'sentiment',
                'SENTIMENT': 'sentiment',
                'sentiment_label': 'sentiment',
                'label': 'sentiment',
                'Engagement': 'engagement_score',
                'ENGAGEMENT': 'engagement_score',
                'engagement': 'engagement_score',
                'score': 'engagement_score'
            }
            
            # Case-insensitive column mapping
            df_columns = df.columns.str.lower()
            mapping = {}
            for col in df.columns:
                col_lower = col.lower()
                for k, v in column_mapping.items():
                    if col_lower == k.lower():
                        mapping[col] = v
                        break
            
            # Apply mapping only for columns that need to be renamed
            return df.rename(columns=mapping)

        sentiment_data = standardize_columns(sentiment_data)
        engagement_data = standardize_columns(engagement_data)
        
        logger.info(f"Standardized sentiment data columns: {list(sentiment_data.columns)}")
        logger.info(f"Standardized engagement data columns: {list(engagement_data.columns)}")
        
        # Verify required columns exist
        required_columns = {
            'sentiment_data': ['text', 'sentiment'],
            'engagement_data': ['text', 'engagement_score']
        }
        
        missing_columns = []
        for col in required_columns['sentiment_data']:
            if col not in sentiment_data.columns:
                missing_columns.append(f"sentiment_data missing '{col}'")
        
        for col in required_columns['engagement_data']:
            if col not in engagement_data.columns:
                missing_columns.append(f"engagement_data missing '{col}'")
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        logger.info(f"Loaded sentiment data shape: {sentiment_data.shape}")
        logger.info(f"Loaded engagement data shape: {engagement_data.shape}")
        
        # Ensure both datasets have the same samples
        common_indices = sentiment_data.index.intersection(engagement_data.index)
        if len(common_indices) == 0:
            # If no common indices, assume they should be aligned by row
            min_rows = min(len(sentiment_data), len(engagement_data))
            sentiment_data = sentiment_data.iloc[:min_rows]
            engagement_data = engagement_data.iloc[:min_rows]
            logger.info(f"Aligned datasets by truncating to {min_rows} rows")
        else:
            # Use common indices
            sentiment_data = sentiment_data.loc[common_indices]
            engagement_data = engagement_data.loc[common_indices]
            logger.info(f"Aligned datasets using common indices, {len(common_indices)} samples")
        
        logger.info(f"Final sentiment data shape: {sentiment_data.shape}")
        logger.info(f"Final engagement data shape: {engagement_data.shape}")
        
        # Validate text columns
        if sentiment_data['text'].isnull().any() or engagement_data['text'].isnull().any():
            logger.warning("Found null values in text columns, filling with empty string")
            sentiment_data['text'] = sentiment_data['text'].fillna("")
            engagement_data['text'] = engagement_data['text'].fillna("")
        
        # Preprocess sentiment data
        sentiment_data['sentiment'] = sentiment_data['sentiment'].fillna('neutral')
        sentiment_data['sentiment'] = sentiment_data['sentiment'].apply(normalize_label)
        
        # Calculate engagement scores with a small epsilon to avoid exact zeros
        engagement_data['engagement_score'] = engagement_data.apply(
            lambda row: np.log1p(row.get('likes', 0) + row.get('retweets', 0) * 2) + 1e-6, axis=1
        )
        
        # Create engagement labels using quantiles, handling duplicates
        try:
            engagement_data['engagement_level'] = pd.qcut(
                engagement_data['engagement_score'],
                q=3,
                labels=['low', 'medium', 'high'],
                duplicates='drop'
            )
        except ValueError:
            # If too many duplicates for qcut, use cut with manual thresholds
            score_mean = engagement_data['engagement_score'].mean()
            score_std = engagement_data['engagement_score'].std()
            bins = [float('-inf'), score_mean - score_std/2, score_mean + score_std/2, float('inf')]
            engagement_data['engagement_level'] = pd.cut(
                engagement_data['engagement_score'],
                bins=bins,
                labels=['low', 'medium', 'high']
            )

        # ---- Create Sentiment Model ----
        logger.info("Creating sentiment prediction model")
        tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
        
        sentiment_model = AutoModelForSequenceClassification.from_pretrained(
            "distilbert-base-uncased",
            num_labels=3,
            problem_type="single_label_classification"
        )
        
        # Initialize sentiment model weights
        sentiment_model.classifier.weight.data.normal_(mean=0.0, std=0.02)
        sentiment_model.classifier.bias.data.zero_()
        
        # Save sentiment model and tokenizer
        sentiment_model.save_pretrained(os.path.join(sentiment_dir, 'initial_model'))
        tokenizer.save_pretrained(os.path.join(sentiment_dir, 'tokenizer'))
        
        # Create and save sentiment TF-IDF
        sentiment_tfidf = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        X_sentiment = sentiment_tfidf.fit_transform(sentiment_data['text'])
        logger.info(f"Sentiment TF-IDF shape: {X_sentiment.shape}")
        joblib.dump(sentiment_tfidf, os.path.join(sentiment_dir, 'tfidf_vectorizer.joblib'))
        
        # Create and save sentiment scaler
        sentiment_scaler = StandardScaler(with_mean=False)  # with_mean=False for sparse matrices
        X_sentiment_scaled = sentiment_scaler.fit_transform(X_sentiment)
        joblib.dump(sentiment_scaler, os.path.join(sentiment_dir, 'scaler.joblib'))
        
        # Initial model validation for sentiment
        X_train, X_val, y_train, y_val = train_test_split(
            sentiment_data['text'], 
            sentiment_data['sentiment'],
            test_size=0.2,
            random_state=42
        )
        
        # Create validation dataset
        sentiment_label_mapping = {'negative': 0, 'neutral': 1, 'positive': 2}
        val_dataset = TextDataset(
            texts=X_val.tolist(),
            labels=y_val.tolist(),
            tokenizer=tokenizer,
            max_length=MAX_LENGTH,
            label_mapping=sentiment_label_mapping
        )
        val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
        
        # Evaluate initial sentiment model
        sentiment_model.eval()
        val_predictions = []
        val_labels = []
        val_probs = []
        
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['labels'].cpu().numpy()
                
                outputs = sentiment_model(input_ids=input_ids, attention_mask=attention_mask)
                logits = outputs.logits
                probs = torch.softmax(logits, dim=1).cpu().numpy()
                preds = np.argmax(probs, axis=1)
                
                val_predictions.extend(preds)
                val_labels.extend(labels)
                val_probs.extend(probs)
        
        # Calculate and log initial metrics
        all_classes = [0, 1, 2]  # Known classes for both sentiment and engagement
        metrics = {
            'accuracy': accuracy_score(val_labels, val_predictions),
            'precision_macro': precision_score(val_labels, val_predictions, 
                                            average='macro', labels=all_classes, zero_division=0),
            'recall_macro': recall_score(val_labels, val_predictions, 
                                       average='macro', labels=all_classes, zero_division=0),
            'f1_macro': f1_score(val_labels, val_predictions, 
                                average='macro', labels=all_classes, zero_division=0)
        }
        
        # Per-class metrics
        precision = precision_score(val_labels, val_predictions, average=None, 
                                  labels=all_classes, zero_division=0)
        recall = recall_score(val_labels, val_predictions, average=None, 
                            labels=all_classes, zero_division=0)
        
        for i, class_label in enumerate(all_classes):
            metrics[f'precision_class_{class_label}'] = float(precision[i])
            metrics[f'recall_class_{class_label}'] = float(recall[i])
        
        # Add ROC AUC for multi-class
        if len(np.unique(val_labels)) > 1:
            try:
                metrics['roc_auc'] = roc_auc_score(val_labels, val_probs, 
                                                 multi_class='ovr', labels=all_classes)
            except Exception as e:
                logger.warning(f"Could not calculate ROC AUC score: {str(e)}")
                metrics['roc_auc'] = None
        else:
            logger.info("Insufficient classes for ROC AUC calculation")
            metrics['roc_auc'] = None
        
        logger.info("Initial Sentiment Model Metrics:")
        for metric, value in metrics.items():
            if isinstance(value, float):
                logger.info(f"{metric}: {value:.4f}")
            else:
                logger.info(f"{metric}: {value}")
        
        conf_matrix = confusion_matrix(val_labels, val_predictions, labels=all_classes)
        logger.info(f"Confusion Matrix:\n{conf_matrix}")
        
        # ---- Create Engagement Model ----
        logger.info("Creating engagement prediction model")
        
        engagement_model = AutoModelForSequenceClassification.from_pretrained(
            "distilbert-base-uncased",
            num_labels=3,
            problem_type="single_label_classification"
        )
        
        # Initialize engagement model weights
        engagement_model.classifier.weight.data.normal_(mean=0.0, std=0.02)
        engagement_model.classifier.bias.data.zero_()
        
        # Save engagement model
        engagement_model.save_pretrained(os.path.join(engagement_dir, 'initial_model'))
        
        # Create and save engagement TF-IDF
        engagement_tfidf = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        X_engagement = engagement_tfidf.fit_transform(engagement_data['text'])
        logger.info(f"Engagement TF-IDF shape: {X_engagement.shape}")
        joblib.dump(engagement_tfidf, os.path.join(engagement_dir, 'tfidf_vectorizer.joblib'))
        
        # Create and save engagement scaler
        engagement_scaler = StandardScaler(with_mean=False)  # with_mean=False for sparse matrices
        X_engagement_scaled = engagement_scaler.fit_transform(X_engagement)
        joblib.dump(engagement_scaler, os.path.join(engagement_dir, 'scaler.joblib'))
        
        # Initial model validation for engagement
        X_train, X_val, y_train, y_val = train_test_split(
            engagement_data['text'], 
            engagement_data['engagement_level'],
            test_size=0.2,
            random_state=42
        )
        
        # Create validation dataset
        engagement_label_mapping = {'low': 0, 'medium': 1, 'high': 2}
        val_dataset = TextDataset(
            texts=X_val.tolist(),
            labels=y_val.tolist(),
            tokenizer=tokenizer,
            max_length=MAX_LENGTH,
            label_mapping=engagement_label_mapping
        )
        val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
        
        # Evaluate initial engagement model
        engagement_model.eval()
        val_predictions = []
        val_labels = []
        val_probs = []
        
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['labels'].cpu().numpy()
                
                outputs = engagement_model(input_ids=input_ids, attention_mask=attention_mask)
                logits = outputs.logits
                probs = torch.softmax(logits, dim=1).cpu().numpy()
                preds = np.argmax(probs, axis=1)
                
                val_predictions.extend(preds)
                val_labels.extend(labels)
                val_probs.extend(probs)
        
        # Calculate and log initial metrics
        all_classes = [0, 1, 2]  # Known classes for both sentiment and engagement
        metrics = {
            'accuracy': accuracy_score(val_labels, val_predictions),
            'precision_macro': precision_score(val_labels, val_predictions, 
                                            average='macro', labels=all_classes, zero_division=0),
            'recall_macro': recall_score(val_labels, val_predictions, 
                                       average='macro', labels=all_classes, zero_division=0),
            'f1_macro': f1_score(val_labels, val_predictions, 
                                average='macro', labels=all_classes, zero_division=0)
        }
        
        # Per-class metrics
        precision = precision_score(val_labels, val_predictions, average=None, 
                                  labels=all_classes, zero_division=0)
        recall = recall_score(val_labels, val_predictions, average=None, 
                            labels=all_classes, zero_division=0)
        
        for i, class_label in enumerate(all_classes):
            metrics[f'precision_class_{class_label}'] = float(precision[i])
            metrics[f'recall_class_{class_label}'] = float(recall[i])
        
        # Add ROC AUC for multi-class
        if len(np.unique(val_labels)) > 1:
            try:
                metrics['roc_auc'] = roc_auc_score(val_labels, val_probs, 
                                                 multi_class='ovr', labels=all_classes)
            except Exception as e:
                logger.warning(f"Could not calculate ROC AUC score: {str(e)}")
                metrics['roc_auc'] = None
        else:
            logger.info("Insufficient classes for ROC AUC calculation")
            metrics['roc_auc'] = None
        
        logger.info("Initial Engagement Model Metrics:")
        for metric, value in metrics.items():
            if isinstance(value, float):
                logger.info(f"{metric}: {value:.4f}")
            else:
                logger.info(f"{metric}: {value}")
        
        conf_matrix = confusion_matrix(val_labels, val_predictions, labels=all_classes)
        logger.info(f"Confusion Matrix:\n{conf_matrix}")
        
        # ---- Create Meta Model ----
        logger.info("Creating meta model")
        
        # Convert sparse matrices to dense for meta model
        X_sentiment_dense = X_sentiment_scaled.toarray()
        X_engagement_dense = X_engagement_scaled.toarray()
        
        logger.info(f"Sentiment features shape: {X_sentiment_dense.shape}")
        logger.info(f"Engagement features shape: {X_engagement_dense.shape}")
        
        if X_sentiment_dense.shape[0] != X_engagement_dense.shape[0]:
            raise ValueError(f"Number of samples mismatch: sentiment={X_sentiment_dense.shape[0]}, engagement={X_engagement_dense.shape[0]}")
        
        # Combine features for meta model
        X_combined = np.hstack([X_sentiment_dense, X_engagement_dense])
        logger.info(f"Combined features shape: {X_combined.shape}")
        
        # Create meta labels (can be customized based on your needs)
        def create_engagement_labels(scores):
            """Create engagement level labels from scores"""
            try:
                # Try quantile-based binning first
                labels = pd.qcut(
                    scores,
                    q=3,
                    labels=['low', 'medium', 'high']
                )
                logger.info(f"Successfully created engagement labels using quantile binning")
                return labels
            except ValueError as e:
                logger.warning(f"Quantile binning failed: {str(e)}")
                logger.info("Falling back to manual binning")
                
                # Manual binning as fallback
                scores = np.array(scores)
                labels = pd.Series(['medium'] * len(scores))
                
                if len(scores) > 0:
                    # Calculate thresholds
                    low_threshold = np.percentile(scores[scores != 0], 33) if any(scores != 0) else 0.33
                    high_threshold = np.percentile(scores[scores != 0], 66) if any(scores != 0) else 0.66
                    
                    # Assign labels
                    labels[scores <= low_threshold] = 'low'
                    labels[scores > high_threshold] = 'high'
                    
                    logger.info(f"Created engagement labels using manual binning:")
                    logger.info(f"- Low threshold: {low_threshold:.3f}")
                    logger.info(f"- High threshold: {high_threshold:.3f}")
                    logger.info(f"Label distribution: {labels.value_counts().to_dict()}")
                
                return labels

        # Create meta labels
        meta_labels = create_engagement_labels(engagement_data['engagement_score'])
        
        # Train meta model
        meta_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        
        logger.info(f"Meta model input shape: {X_combined.shape}")
        logger.info(f"Meta labels shape: {meta_labels.shape}")
        logger.info(f"Meta labels unique values: {meta_labels.unique()}")
        logger.info(f"Meta labels distribution: {meta_labels.value_counts().to_dict()}")
        
        meta_model.fit(X_combined, meta_labels)
        
        # Save meta model and scalers
        joblib.dump(meta_model, os.path.join(meta_dir, 'trained_meta_model.joblib'))
        joblib.dump(sentiment_scaler, os.path.join(meta_dir, 'sentiment_scaler.joblib'))
        joblib.dump(engagement_scaler, os.path.join(meta_dir, 'engagement_scaler.joblib'))
        
        logger.info("Model creation completed successfully")
        return True

    except Exception as e:
        logger.error(f"Error in model creation: {str(e)}")
        raise

if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    create_models()
