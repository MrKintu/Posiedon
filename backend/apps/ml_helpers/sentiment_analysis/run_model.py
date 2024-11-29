import os
import logging
import torch
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import joblib
from django.conf import settings
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

# Set up logging
if not os.path.exists('./logs'):
    os.makedirs('./logs')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('./logs/run_model.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self):
        """Initialize the sentiment analysis pipeline with all required models"""
        try:
            logger.info("Initializing SentimentAnalyzer")
            
            # Set up model paths
            model_base_dir = os.path.join(settings.BASE_DIR, 'ml_models')
            self.sentiment_dir = os.path.join(model_base_dir, 'sentiment_model')
            self.engagement_dir = os.path.join(model_base_dir, 'engagement_model')
            self.meta_dir = os.path.join(model_base_dir, 'sentiment_analysis')

            # Load sentiment model components
            self.sentiment_model = AutoModelForSequenceClassification.from_pretrained(
                os.path.join(self.sentiment_dir, 'trained_model')
            )
            self.tokenizer = AutoTokenizer.from_pretrained(
                os.path.join(self.sentiment_dir, 'tokenizer')
            )
            self.sentiment_tfidf = joblib.load(
                os.path.join(self.sentiment_dir, 'tfidf_vectorizer.joblib')
            )
            self.sentiment_scaler = joblib.load(
                os.path.join(self.sentiment_dir, 'scaler.joblib')
            )

            # Load engagement model components
            self.engagement_model = AutoModelForSequenceClassification.from_pretrained(
                os.path.join(self.engagement_dir, 'trained_model')
            )
            self.engagement_tfidf = joblib.load(
                os.path.join(self.engagement_dir, 'tfidf_vectorizer.joblib')
            )
            self.engagement_scaler = joblib.load(
                os.path.join(self.engagement_dir, 'scaler.joblib')
            )

            # Load meta-model components
            self.meta_model = joblib.load(os.path.join(self.meta_dir, 'trained_meta_model.joblib'))

            # Set device
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            self.sentiment_model.to(self.device)
            self.engagement_model.to(self.device)
            self.sentiment_model.eval()
            self.engagement_model.eval()

            # Define label mappings
            self.sentiment_labels = ['positive', 'negative', 'neutral']
            self.engagement_labels = ['low', 'medium', 'high']

            logger.info("SentimentAnalyzer initialized successfully")

        except Exception as e:
            logger.error(f"Error initializing SentimentAnalyzer: {str(e)}")
            raise

    def preprocess_text(self, text):
        """Preprocess text for model input"""
        try:
            # Basic text cleaning
            text = str(text).lower().strip()
            # Remove excessive whitespace
            text = ' '.join(text.split())
            return text
        except Exception as e:
            logger.error(f"Error preprocessing text: {str(e)}")
            raise

    def _get_transformer_prediction(self, text, model, is_sentiment=True):
        """Get predictions from a transformer model with improved error handling"""
        try:
            # Preprocess text
            text = self.preprocess_text(text)
            
            # Tokenize input
            inputs = self.tokenizer(
                text,
                max_length=128,
                padding="max_length",
                truncation=True,
                return_tensors="pt"
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            # Get prediction
            with torch.no_grad():
                outputs = model(**inputs)
                predictions = torch.softmax(outputs.logits, dim=1)
                predicted_class = torch.argmax(predictions, dim=1)
                confidence_scores = predictions[0].cpu().numpy().tolist()

            # Get feature representation for meta model
            tfidf = self.sentiment_tfidf if is_sentiment else self.engagement_tfidf
            scaler = self.sentiment_scaler if is_sentiment else self.engagement_scaler
            features = tfidf.transform([text])
            scaled_features = scaler.transform(features)

            return predicted_class.item(), confidence_scores, scaled_features

        except Exception as e:
            logger.error(f"Error in transformer prediction: {str(e)}")
            raise

    def analyze_text(self, text):
        """
        Analyze text using all models with improved error handling and logging
        """
        try:
            # Get sentiment prediction
            sentiment_class, sentiment_scores, sentiment_features = self._get_transformer_prediction(
                text, self.sentiment_model, is_sentiment=True
            )
            sentiment_prediction = {
                'label': self.sentiment_labels[sentiment_class],
                'confidence_scores': {
                    label: score 
                    for label, score in zip(self.sentiment_labels, sentiment_scores)
                }
            }

            # Get engagement prediction
            engagement_class, engagement_scores, engagement_features = self._get_transformer_prediction(
                text, self.engagement_model, is_sentiment=False
            )
            engagement_prediction = {
                'label': self.engagement_labels[engagement_class],
                'confidence_scores': {
                    label: score 
                    for label, score in zip(self.engagement_labels, engagement_scores)
                }
            }

            # Get meta-model prediction
            combined_features = np.hstack([sentiment_features.toarray(), engagement_features.toarray()])
            meta_prediction = self.meta_model.predict(combined_features)[0]
            meta_probabilities = self.meta_model.predict_proba(combined_features)[0]

            meta_result = {
                'label': self.engagement_labels[meta_prediction],
                'confidence_scores': {
                    label: score 
                    for label, score in zip(self.engagement_labels, meta_probabilities)
                }
            }

            # Return comprehensive results
            return {
                'sentiment': sentiment_prediction,
                'engagement': engagement_prediction,
                'meta_prediction': meta_result,
                'input_text': text
            }

        except Exception as e:
            logger.error(f"Error analyzing text: {str(e)}")
            raise

    def batch_analyze(self, texts, batch_size=32):
        """
        Analyze a batch of texts with improved batching
        """
        try:
            results = []
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                batch_results = [self.analyze_text(text) for text in batch]
                results.extend(batch_results)
            return results
        except Exception as e:
            logger.error(f"Error in batch analysis: {str(e)}")
            raise

    def create_sentiment_distribution_plot(self, results):
        """
        Create a bar plot showing the distribution of sentiments in analyzed texts
        Args:
            results: List of analysis results from batch_analyze
        Returns:
            Dictionary with plot data in a JSON serializable format
        """
        try:
            # Count sentiment labels
            sentiment_counts = {'positive': 0, 'negative': 0, 'neutral': 0}
            for result in results:
                sentiment_counts[result['sentiment']['label']] += 1

            # Create plot
            plt.figure(figsize=(10, 6))
            plt.bar(sentiment_counts.keys(), sentiment_counts.values())
            plt.title('Sentiment Distribution')
            plt.xlabel('Sentiment')
            plt.ylabel('Count')

            # Save plot to bytes buffer
            buffer = BytesIO()
            plt.savefig(buffer, format='png')
            plt.close()
            buffer.seek(0)
            image_png = buffer.getvalue()
            buffer.close()

            return {
                'image': base64.b64encode(image_png).decode('utf-8'),
                'data': {
                    'labels': list(sentiment_counts.keys()),
                    'values': list(sentiment_counts.values())
                }
            }
        except Exception as e:
            logger.error(f"Error creating sentiment distribution plot: {str(e)}")
            raise

    def create_confidence_heatmap(self, results):
        """
        Create a heatmap showing confidence scores for sentiment predictions
        Args:
            results: List of analysis results from batch_analyze
        Returns:
            Dictionary with heatmap data in a JSON serializable format
        """
        try:
            # Extract confidence scores
            confidence_matrix = []
            for result in results:
                scores = result['sentiment']['confidence_scores']
                confidence_matrix.append([scores[label] for label in self.sentiment_labels])

            # Create heatmap
            plt.figure(figsize=(10, len(results) * 0.3))
            sns.heatmap(confidence_matrix, 
                       xticklabels=self.sentiment_labels,
                       yticklabels=range(len(results)),
                       cmap='YlOrRd',
                       cbar_kws={'label': 'Confidence Score'})
            plt.title('Sentiment Prediction Confidence Scores')
            plt.xlabel('Sentiment')
            plt.ylabel('Text Sample')

            # Save plot to bytes buffer
            buffer = BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight')
            plt.close()
            buffer.seek(0)
            image_png = buffer.getvalue()
            buffer.close()

            return {
                'image': base64.b64encode(image_png).decode('utf-8'),
                'data': {
                    'matrix': [
                        [float(score) for score in row]  # Convert numpy floats to Python floats
                        for row in confidence_matrix
                    ],
                    'x_labels': self.sentiment_labels,
                    'y_labels': list(range(len(results)))
                }
            }
        except Exception as e:
            logger.error(f"Error creating confidence heatmap: {str(e)}")
            raise

    def visualize_batch_results(self, texts):
        """
        Create visualizations for a batch of analyzed texts
        Args:
            texts: List of texts to analyze
        Returns:
            Dictionary containing JSON serializable visualization data and analysis results
        """
        try:
            # Analyze texts
            results = self.batch_analyze(texts)
            
            # Create visualizations
            distribution_data = self.create_sentiment_distribution_plot(results)
            heatmap_data = self.create_confidence_heatmap(results)
            
            # Ensure all numeric values are JSON serializable
            analysis_results = []
            for result in results:
                # Convert numpy floats to Python floats in confidence scores
                sentiment_scores = {
                    k: float(v) for k, v in result['sentiment']['confidence_scores'].items()
                }
                engagement_scores = {
                    k: float(v) for k, v in result['engagement']['confidence_scores'].items()
                }
                meta_scores = {
                    k: float(v) for k, v in result['meta_prediction']['confidence_scores'].items()
                }
                
                analysis_results.append({
                    'sentiment': {
                        'label': result['sentiment']['label'],
                        'confidence_scores': sentiment_scores
                    },
                    'engagement': {
                        'label': result['engagement']['label'],
                        'confidence_scores': engagement_scores
                    },
                    'meta_prediction': {
                        'label': result['meta_prediction']['label'],
                        'confidence_scores': meta_scores
                    },
                    'input_text': result['input_text']
                })
            
            return {
                'visualizations': {
                    'sentiment_distribution': distribution_data,
                    'confidence_heatmap': heatmap_data
                },
                'analysis_results': analysis_results
            }
        except Exception as e:
            logger.error(f"Error creating visualizations: {str(e)}")
            raise
