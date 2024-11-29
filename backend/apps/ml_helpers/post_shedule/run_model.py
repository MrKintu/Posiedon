import os
import logging
import pandas as pd
import numpy as np
import tensorflow as tf
from prophet import Prophet
from tensorflow.keras.models import load_model
import joblib
import base64
import matplotlib.pyplot as plt
import io
import json
from pathlib import Path
from django.conf import settings

# Configure logger
logger = logging.getLogger('poseidon.ml_models.predictor')

def configure_logging():
    """Configure logging for the predictor module"""
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        # Create formatters and handlers
        formatter = logging.Formatter(
            '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        # File handler - save to Django's log directory
        log_dir = getattr(settings, 'LOG_DIR', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        file_handler = logging.FileHandler(
            os.path.join(log_dir, 'predictor.log'),
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        
        # Set propagate to False to avoid duplicate logging
        logger.propagate = False

# Configure logging when module is imported
configure_logging()

class HybridPredictor:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HybridPredictor, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        self.models_dir = os.path.join(self.base_dir, 'ml_models')
        
        # Load model configuration
        try:
            self._load_models()
            self._initialized = True
            logger.info("HybridPredictor initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing HybridPredictor: {str(e)}", exc_info=True)
            raise
    
    def _load_models(self):
        """Load all required models"""
        try:
            # Get available channels
            channels = [d for d in os.listdir(self.models_dir) 
                      if os.path.isdir(os.path.join(self.models_dir, d))]
            
            self.models = {}
            for channel in channels:
                channel_dir = os.path.join(self.models_dir, channel)
                
                # Load Prophet model
                prophet_dir = os.path.join(channel_dir, 'prophet')
                with open(os.path.join(prophet_dir, 'model.pkl'), 'rb') as f:
                    prophet_model = joblib.load(f)
                
                # Load LSTM model
                lstm_dir = os.path.join(channel_dir, 'lstm_model')
                lstm_model = tf.keras.models.load_model(
                    os.path.join(lstm_dir, 'model.keras')
                )
                
                # Load meta model
                meta_dir = os.path.join(channel_dir, 'meta_model')
                meta_model = joblib.load(os.path.join(meta_dir, 'model.joblib'))
                
                # Load configuration
                with open(os.path.join(lstm_dir, 'config.json'), 'r') as f:
                    config = json.load(f)
                
                self.models[channel] = {
                    'prophet': prophet_model,
                    'lstm': lstm_model,
                    'meta': meta_model,
                    'config': config
                }
                
                logger.info(f"Loaded models for channel: {channel}")
                
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}", exc_info=True)
            raise
    
    def prepare_data(self, params, channel):
        """Prepare input data for prediction
        
        Args:
            params: Dictionary of prediction parameters
            channel: Social media channel
        
        Returns:
            Prepared DataFrame for prediction
        """
        try:
            logger.info(f"Preparing data for channel {channel}")
            
            # Create dataframe for Prophet
            future_dates = pd.date_range(
                start=params['start_date'],
                end=params['end_date'],
                freq='D'
            )
            future_df = pd.DataFrame({'ds': future_dates})
            
            # Add regressors if provided
            for regressor in ['clicks', 'impressions', 'reach']:
                if regressor in params:
                    future_df[regressor] = params[regressor]
            
            logger.debug(f"Prepared data shape: {future_df.shape}")
            return future_df
            
        except Exception as e:
            logger.error(f"Error preparing data: {str(e)}", exc_info=True)
            raise
    
    def generate_plot(self, dates, predictions, actual=None, title='Engagement Score Predictions', 
                     channel=None, figsize=(12, 6)):
        """Generate plot of predictions"""
        try:
            plt.figure(figsize=figsize)
            plt.plot(dates, predictions, label='Predicted', color='blue')
            
            if actual is not None:
                plt.plot(dates, actual, label='Actual', color='red')
            
            title = f"{channel} - {title}" if channel else title
            plt.title(title)
            plt.xlabel('Date')
            plt.ylabel('Engagement Score')
            plt.legend()
            plt.grid(True)
            
            # Save plot to buffer
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=300, bbox_inches='tight')
            plt.close()
            
            # Encode plot as base64 string
            buf.seek(0)
            plot_data = base64.b64encode(buf.getvalue()).decode('utf-8')
            
            return plot_data
            
        except Exception as e:
            logger.error(f"Error generating plot: {str(e)}", exc_info=True)
            raise
    
    def predict(self, params, channel):
        """Make predictions using the hybrid model
        
        Args:
            params: Dictionary of prediction parameters
            channel: Social media channel
        
        Returns:
            Dictionary containing predictions, dates, and plot
        """
        try:
            logger.info(f"Making predictions for channel {channel} with parameters: {params}")
            
            if channel not in self.models:
                raise ValueError(f"No models found for channel: {channel}")
            
            models = self.models[channel]
            
            # Prepare data
            future_df = self.prepare_data(params, channel)
            
            # Get Prophet predictions
            prophet_forecast = models['prophet'].predict(future_df)
            prophet_predictions = prophet_forecast['yhat'].values
            
            # Get sequence length from config
            sequence_length = models['config']['input_shape'][0]
            
            # Prepare sequence for LSTM
            if len(prophet_predictions) >= sequence_length:
                sequences = []
                for i in range(len(prophet_predictions) - sequence_length + 1):
                    sequences.append(prophet_predictions[i:i+sequence_length])
                sequences = np.array(sequences).reshape(-1, sequence_length, 1)
                
                # Get LSTM predictions
                lstm_predictions = models['lstm'].predict(sequences).flatten()
                
                # Use meta-model for final predictions
                combined_predictions = np.column_stack((
                    prophet_predictions[sequence_length-1:],
                    lstm_predictions
                ))
                final_predictions = models['meta'].predict(combined_predictions)
            else:
                final_predictions = prophet_predictions
            
            # Generate plot
            plot_data = self.generate_plot(
                dates=future_df['ds'].values[-len(final_predictions):],
                predictions=final_predictions,
                channel=channel,
                title='Hybrid Model Predictions'
            )
            
            # Prepare response
            response = {
                'predictions': final_predictions.tolist(),
                'dates': future_df['ds'].dt.strftime('%Y-%m-%d').tolist()[-len(final_predictions):],
                'plot': plot_data
            }
            
            logger.info(f"Successfully generated predictions for channel {channel}")
            return response
                
        except Exception as e:
            logger.error(f"Error making predictions: {str(e)}", exc_info=True)
            raise

# Create singleton instance
predictor = HybridPredictor()
