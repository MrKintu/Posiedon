#!/usr/bin/env python
import os
import sys
import logging
import argparse
import pandas as pd
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import json
import torch
from sklearn.model_selection import train_test_split
import joblib
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Add the Django project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.append(project_root)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

from django.conf import settings
from create_model import (
    process_channel, configure_logging, normalize_features,
    prepare_lstm_data, create_lstm_model, create_prophet_model,
    train_meta_model, calculate_metrics
)

# Configure logger
logger = logging.getLogger('poseidon.ml_models.trainer')

def configure_trainer_logging():
    """Configure logging for the model trainer"""
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        # File handler
        log_dir = getattr(settings, 'LOG_DIR', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        file_handler = logging.FileHandler(
            os.path.join(log_dir, 'model_training.log'),
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        
        logger.propagate = False

def generate_synthetic_data(
    num_records: int = 1000,
    start_date: str = '2023-01-01',
    channels: List[str] = ['Facebook', 'Instagram', 'Twitter', 'Pinterest']
) -> Dict[str, pd.DataFrame]:
    """Generate synthetic data for model training
    
    Args:
        num_records: Number of records to generate per channel
        start_date: Start date for the time series
        channels: List of social media channels
    
    Returns:
        Dictionary mapping channel names to their synthetic DataFrames
    """
    np.random.seed(42)  # For reproducibility
    
    channel_data = {}
    date_range = pd.date_range(start=start_date, periods=num_records, freq='D')
    
    for channel in channels:
        # Generate base engagement trend
        base_trend = np.linspace(0, 10, num_records)
        
        # Add seasonality
        weekly = 7 * np.sin(2 * np.pi * np.arange(num_records) / 7)
        monthly = 15 * np.sin(2 * np.pi * np.arange(num_records) / 30)
        
        # Generate features
        clicks = np.random.normal(1000, 200, num_records)
        impressions = clicks * np.random.normal(10, 2, num_records)
        reach = impressions * np.random.normal(0.3, 0.05, num_records)
        
        # Calculate engagement score with channel-specific variations
        engagement = (
            base_trend + 
            weekly + 
            monthly + 
            0.001 * clicks + 
            0.0001 * impressions +
            0.0003 * reach +
            np.random.normal(0, 2, num_records)
        )
        
        # Ensure all values are positive
        engagement = np.maximum(engagement, 0)
        clicks = np.maximum(clicks, 0)
        impressions = np.maximum(impressions, 0)
        reach = np.maximum(reach, 0)
        
        # Create DataFrame
        df = pd.DataFrame({
            'ds': date_range,
            'y': engagement,
            'clicks': clicks.astype(int),
            'impressions': impressions.astype(int),
            'reach': reach.astype(int)
        })
        
        channel_data[channel] = df
        logger.info(f"Generated {num_records} records for {channel}")
    
    return channel_data

def load_or_initialize_models(channel_dir: str, sequence_length: int, n_features: int):
    """Load existing models or initialize new ones
    
    Args:
        channel_dir: Directory for channel models
        sequence_length: Sequence length for LSTM
        n_features: Number of features for LSTM
    
    Returns:
        Tuple of (prophet_model, lstm_model, meta_model, training_state)
    """
    state_file = os.path.join(channel_dir, 'training_state.json')
    
    if os.path.exists(state_file):
        # Load training state
        with open(state_file, 'r') as f:
            training_state = json.load(f)
        
        # Load Prophet model
        prophet_path = os.path.join(channel_dir, 'prophet_model.json')
        if os.path.exists(prophet_path):
            with open(prophet_path, 'r') as f:
                prophet_model = create_prophet_model(None)
                prophet_model.load(f)
        else:
            prophet_model = None
            
        # Load LSTM model
        lstm_path = os.path.join(channel_dir, 'lstm_model.h5')
        if os.path.exists(lstm_path):
            lstm_model = create_lstm_model((sequence_length, n_features))
            lstm_model.load_weights(lstm_path)
        else:
            lstm_model = None
            
        # Load meta model
        meta_path = os.path.join(channel_dir, 'meta_model.joblib')
        if os.path.exists(meta_path):
            meta_model = joblib.load(meta_path)
        else:
            meta_model = None
            
        logger.info(f"Loaded existing models and state from {channel_dir}")
    else:
        prophet_model = None
        lstm_model = None
        meta_model = None
        training_state = {'metrics': [], 'last_iteration': -1}
        
    return prophet_model, lstm_model, meta_model, training_state

def save_models_and_state(channel_dir: str, prophet_model, lstm_model, meta_model, training_state):
    """Save models and training state
    
    Args:
        channel_dir: Directory to save models
        prophet_model: Prophet model
        lstm_model: LSTM model
        meta_model: Meta model
        training_state: Training state dictionary
    """
    os.makedirs(channel_dir, exist_ok=True)
    
    # Save Prophet model
    prophet_path = os.path.join(channel_dir, 'prophet_model.json')
    with open(prophet_path, 'w') as f:
        prophet_model.serialize_prophet_model(f)
    
    # Save LSTM model
    lstm_path = os.path.join(channel_dir, 'lstm_model.h5')
    lstm_model.save_weights(lstm_path)
    
    # Save meta model
    meta_path = os.path.join(channel_dir, 'meta_model.joblib')
    joblib.dump(meta_model, meta_path)
    
    # Save training state
    state_file = os.path.join(channel_dir, 'training_state.json')
    with open(state_file, 'w') as f:
        json.dump(training_state, f)
    
    logger.info(f"Saved models and state to {channel_dir}")

def calculate_metrics(y_true, y_pred):
    """Calculate comprehensive evaluation metrics for regression
    
    Args:
        y_true: True values
        y_pred: Predicted values
    
    Returns:
        dict: Dictionary containing evaluation metrics
    """
    metrics = {
        'mse': mean_squared_error(y_true, y_pred),
        'rmse': np.sqrt(mean_squared_error(y_true, y_pred)),
        'mae': mean_absolute_error(y_true, y_pred),
        'r2': r2_score(y_true, y_pred),
        'mape': np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    }
    return metrics

def train_channel_model_continuous(
    channel: str,
    data: pd.DataFrame,
    model_dir: str,
    batch_size: int = 1000,
    num_iterations: int = 10,
    sequence_length: int = 30,
    epochs_per_iteration: int = 5,
    test_size: float = 0.2,
    continuous: bool = True
) -> None:
    """Train models for a specific channel with continuous learning
    
    Args:
        channel: Channel name
        data: Training data DataFrame
        model_dir: Directory to save models
        batch_size: Number of samples per iteration
        num_iterations: Number of training iterations
        sequence_length: Sequence length for LSTM
        epochs_per_iteration: Number of epochs per iteration
        test_size: Proportion of data to use for testing
        continuous: Whether to use continuous learning
    """
    try:
        logger.info(f"Starting continuous model training for {channel}")
        channel_dir = os.path.join(model_dir, channel)
        os.makedirs(channel_dir, exist_ok=True)
        
        # Create iteration checkpoints directory
        iteration_dir = os.path.join(channel_dir, 'iteration_checkpoints')
        os.makedirs(iteration_dir, exist_ok=True)
        
        # Prepare initial data
        X, y, scaler_params = prepare_lstm_data(data, sequence_length)
        n_features = X.shape[2]
        
        # Load or initialize models
        if continuous:
            prophet_model, lstm_model, meta_model, training_state = load_or_initialize_models(
                channel_dir, sequence_length, n_features
            )
            start_iteration = training_state['last_iteration'] + 1
        else:
            prophet_model = None
            lstm_model = None
            meta_model = None
            training_state = {'metrics': [], 'last_iteration': -1}
            start_iteration = 0
        
        for iteration in range(start_iteration, num_iterations):
            logger.info(f"\nTraining iteration {iteration + 1}/{num_iterations}")
            
            # Sample batch for this iteration
            batch_indices = np.random.choice(len(data), size=batch_size, replace=False)
            batch_data = data.iloc[batch_indices].copy()
            
            # Split into train/test
            train_data, test_data = train_test_split(batch_data, test_size=test_size, shuffle=False)
            
            # Train or update Prophet model
            if prophet_model is None:
                prophet_model = create_prophet_model(train_data)
            prophet_model.fit(train_data)
            
            # Generate Prophet predictions
            prophet_forecast = prophet_model.predict(test_data)
            prophet_predictions = prophet_forecast['yhat'].values
            
            # Prepare LSTM data
            X_train, y_train, _ = prepare_lstm_data(train_data, sequence_length, scaler_params)
            
            # Train or update LSTM model
            if lstm_model is None:
                lstm_model = create_lstm_model((sequence_length, n_features))
            lstm_model.fit(X_train, y_train, epochs=epochs_per_iteration, batch_size=32, verbose=1)
            
            # Generate LSTM predictions
            X_test, y_test, _ = prepare_lstm_data(test_data, sequence_length, scaler_params)
            lstm_predictions = lstm_model.predict(X_test).flatten()
            
            # Align predictions
            min_len = min(len(prophet_predictions), len(lstm_predictions))
            prophet_predictions = prophet_predictions[-min_len:]
            lstm_predictions = lstm_predictions[-min_len:]
            actual_values = test_data['y'].values[-min_len:]
            
            # Train or update meta-model
            meta_model = train_meta_model(
                prophet_predictions=prophet_predictions,
                lstm_predictions=lstm_predictions,
                actual_values=actual_values,
                existing_model=meta_model
            )
            
            # Generate ensemble predictions
            ensemble_predictions = meta_model.predict(
                np.column_stack((prophet_predictions, lstm_predictions))
            )
            
            # Evaluate models
            prophet_metrics = calculate_metrics(actual_values, prophet_predictions)
            lstm_metrics = calculate_metrics(actual_values, lstm_predictions)
            ensemble_metrics = calculate_metrics(actual_values, ensemble_predictions)
            
            # Log metrics
            logger.info(f"\nIteration {iteration + 1} Metrics:")
            logger.info(f"Prophet Model - RMSE: {prophet_metrics['rmse']:.4f}, MAE: {prophet_metrics['mae']:.4f}, R²: {prophet_metrics['r2']:.4f}")
            logger.info(f"LSTM Model - RMSE: {lstm_metrics['rmse']:.4f}, MAE: {lstm_metrics['mae']:.4f}, R²: {lstm_metrics['r2']:.4f}")
            logger.info(f"Ensemble Model - RMSE: {ensemble_metrics['rmse']:.4f}, MAE: {ensemble_metrics['mae']:.4f}, R²: {ensemble_metrics['r2']:.4f}")
            
            # Update training state with metrics
            training_state['metrics'].append({
                'iteration': iteration,
                'prophet_metrics': prophet_metrics,
                'lstm_metrics': lstm_metrics,
                'ensemble_metrics': ensemble_metrics
            })
            
            # Save iteration checkpoint
            checkpoint_dir = os.path.join(iteration_dir, f'checkpoint_{iteration}')
            os.makedirs(checkpoint_dir, exist_ok=True)
            save_models_and_state(checkpoint_dir, prophet_model, lstm_model, meta_model, training_state)
            
        # Save final models
        save_models_and_state(channel_dir, prophet_model, lstm_model, meta_model, training_state)
        logger.info(f"Successfully completed continuous training for {channel}")
        
    except Exception as e:
        logger.error(f"Error training models for {channel}: {str(e)}", exc_info=True)
        raise

def main():
    """Main function to run model training"""
    parser = argparse.ArgumentParser(description='Train posting schedule prediction models')
    parser.add_argument('--continuous', action='store_true', help='Use continuous learning')
    parser.add_argument('--batch-size', type=int, default=1000, help='Batch size for training')
    parser.add_argument('--iterations', type=int, default=10, help='Number of training iterations')
    parser.add_argument('--epochs', type=int, default=5, help='Epochs per iteration')
    parser.add_argument('--platforms', nargs='+', default=['Facebook', 'Instagram', 'Twitter', 'Pinterest'],
                      help='List of platforms to train models for. Defaults to all platforms.')
    parser.add_argument('--records', type=int, default=5000,
                      help='Number of synthetic records to generate per platform')
    args = parser.parse_args()
    
    try:
        configure_trainer_logging()
        logger.info("Starting model training process")
        
        # Set up model directory
        model_dir = os.path.join(settings.ML_MODELS_DIR, 'post_schedule')
        os.makedirs(model_dir, exist_ok=True)
        
        # Generate or load training data
        data = generate_synthetic_data(num_records=args.records, channels=args.platforms)
        
        # Train models for each platform
        for platform in args.platforms:
            logger.info(f"\nTraining model for platform: {platform}")
            train_channel_model_continuous(
                channel=platform,
                data=data[platform],
                model_dir=model_dir,
                batch_size=args.batch_size,
                num_iterations=args.iterations,
                epochs_per_iteration=args.epochs,
                continuous=args.continuous
            )
        
        logger.info("Model training completed successfully")
        
    except Exception as e:
        logger.error(f"Error in model training: {str(e)}", exc_info=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
