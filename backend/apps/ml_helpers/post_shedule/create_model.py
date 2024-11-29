import os
import pandas as pd
import numpy as np
import tensorflow as tf
from prophet import Prophet
from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib
import mlflow
import mlflow.tensorflow
import mlflow.prophet
from sklearn.metrics import mean_squared_error, mean_absolute_error
from math import sqrt
import logging
from datetime import datetime
import gc
from typing import List, Optional, Dict, Any, Tuple
import warnings
from pathlib import Path
import json
import pickle
from sklearn.linear_model import LinearRegression
from django.conf import settings

# Configure logger
logger = logging.getLogger('poseidon.ml_helpers')

def get_log_dir() -> str:
    """Get the log directory, falling back to default if Django settings aren't available"""
    try:
        from django.conf import settings
        return getattr(settings, 'LOG_DIR', os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs'))
    except Exception:
        # Fallback to a default logs directory in the project root
        return os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')

def configure_logging():
    """Configure logging for the ML models module"""
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
        
        # File handler - save to log directory
        log_dir = get_log_dir()
        os.makedirs(log_dir, exist_ok=True)
        file_handler = logging.FileHandler(
            os.path.join(log_dir, 'ml_helpers.log'),
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        
        # Set propagate to False to avoid duplicate logging
        logger.propagate = False

        logger.info(f"Logging configured. Log directory: {log_dir}")

# Configure logging when module is imported
configure_logging()

# Suppress known warnings
warnings.filterwarnings('ignore', category=FutureWarning)
tf.get_logger().setLevel('ERROR')

class DataValidationError(Exception):
    """Custom exception for data validation errors"""
    pass

def validate_data(data: pd.DataFrame, required_columns: List[str]) -> None:
    """Validate data structure and content
    
    Args:
        data: DataFrame to validate
        required_columns: List of required column names
    
    Raises:
        DataValidationError: If validation fails
    """
    missing_cols = [col for col in required_columns if col not in data.columns]
    if missing_cols:
        raise DataValidationError(f"Missing required columns: {missing_cols}")
    
    if data.empty:
        raise DataValidationError("Dataset is empty")
    
    if data['Date'].isna().any():
        raise DataValidationError("Missing dates detected")

def load_and_preprocess_data(data_path: str, channel: Optional[str] = None) -> pd.DataFrame:
    """Load and preprocess data for both Prophet and LSTM models with enhanced error handling
    
    Args:
        data_path: Path to the data file
        channel: Specific channel to filter data for
    
    Returns:
        Preprocessed DataFrame ready for model training
    
    Raises:
        FileNotFoundError: If data file doesn't exist
        DataValidationError: If data validation fails
    """
    try:
        # Get absolute path to data file
        current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        data_file = current_dir / data_path
        
        if not data_file.exists():
            raise FileNotFoundError(f"Data file not found: {data_file}")
        
        logger.info(f"Loading data from {data_file}")
        data = pd.read_csv(data_file)
        
        # Clean monetary values (remove '$' and convert to float)
        data['Acquisition_Cost'] = data['Acquisition_Cost'].str.replace('$', '').str.replace(',', '').astype(float)
        
        # Validate data structure
        required_columns = ['Date', 'Channel_Used', 'Engagement_Score', 'Clicks', 'Impressions', 
                          'Conversion_Rate', 'Acquisition_Cost', 'ROI', 'Target_Audience']
        validate_data(data, required_columns)
        
        # Convert date and sort
        data['Date'] = pd.to_datetime(data['Date'])
        data = data.sort_values('Date')
        
        # Filter by channel if specified
        if channel:
            if channel not in data['Channel_Used'].unique():
                raise DataValidationError(f"Channel '{channel}' not found in data")
            data = data[data['Channel_Used'] == channel]
            if len(data) < 30:  # Minimum data points for meaningful analysis
                raise DataValidationError(f"Insufficient data points for channel '{channel}' (minimum 30 required)")
        
        # Aggregate metrics by date
        agg_dict = {
            'Engagement_Score': 'mean',
            'Clicks': 'sum',  # Changed to sum as these are count metrics
            'Impressions': 'sum',
            'Conversion_Rate': 'mean',
            'Acquisition_Cost': 'mean',
            'ROI': 'mean'  # Note: This is uppercase ROI as in the data
        }
        
        time_series_data = data.groupby('Date').agg(agg_dict).reset_index()
        
        # Add derived features
        time_series_data['ctr'] = time_series_data['Clicks'] / time_series_data['Impressions']
        time_series_data['cost_per_click'] = time_series_data['Acquisition_Cost'] / time_series_data['Clicks']
        
        # Prepare Prophet data
        prophet_data = time_series_data.rename(columns={
            'Date': 'ds',
            'Engagement_Score': 'y'
        })
        
        # Create a mapping of column names to their lowercase versions for regressors
        column_mapping = {
            'Clicks': 'clicks',
            'Impressions': 'impressions',
            'ctr': 'ctr',  # Already lowercase
            'cost_per_click': 'cost_per_click',  # Already lowercase
            'Conversion_Rate': 'conversion_rate',
            'ROI': 'roi'
        }
        
        # Add regressors (normalized to prevent scale issues)
        for original_col, prophet_col in column_mapping.items():
            if original_col in time_series_data.columns:
                if prophet_col in ['clicks', 'impressions']:
                    # Use log transformation for highly skewed count data
                    prophet_data[prophet_col] = np.log1p(time_series_data[original_col])
                else:
                    # Min-max normalization for rate metrics
                    values = time_series_data[original_col]
                    prophet_data[prophet_col] = (values - values.min()) / (values.max() - values.min())
        
        logger.info(f"Data preprocessed successfully: {len(prophet_data)} rows")
        logger.info(f"Date range: {prophet_data['ds'].min()} to {prophet_data['ds'].max()}")
        logger.info(f"Added regressors: {list(prophet_data.columns[2:])}")  # Skip 'ds' and 'y'
        
        return prophet_data
        
    except Exception as e:
        logger.error(f"Error in data preprocessing: {str(e)}")
        raise

def create_prophet_model(data: pd.DataFrame, params: Optional[Dict[str, Any]] = None) -> Prophet:
    """Create and configure Prophet model with optimized parameters
    
    Args:
        data: Preprocessed DataFrame
        params: Optional dictionary of Prophet parameters
    
    Returns:
        Configured Prophet model
    """
    try:
        # Default parameters optimized for social media data
        default_params = {
            'yearly_seasonality': True,
            'weekly_seasonality': True,
            'daily_seasonality': True,
            'seasonality_mode': 'multiplicative',  # Social media typically shows multiplicative patterns
            'changepoint_prior_scale': 0.05,  # Slightly more flexible than default for social media volatility
            'seasonality_prior_scale': 10,  # Stronger seasonality prior for social patterns
            'holidays_prior_scale': 10,  # Stronger holiday effects for social media
        }
        
        model_params = {**default_params, **(params or {})}
        model = Prophet(**model_params)
        
        # Add all available regressors with appropriate modes
        regressor_configs = {
            'clicks': {'mode': 'multiplicative', 'standardize': 'auto'},
            'impressions': {'mode': 'multiplicative', 'standardize': 'auto'},
            'ctr': {'mode': 'multiplicative', 'standardize': 'auto'},
            'cost_per_click': {'mode': 'additive', 'standardize': 'auto'},
            'conversion_rate': {'mode': 'multiplicative', 'standardize': 'auto'},
            'roi': {'mode': 'multiplicative', 'standardize': 'auto'}
        }
        
        # Only add regressors that exist in the data
        available_regressors = [reg for reg in regressor_configs.keys() if reg in data.columns]
        
        for regressor in available_regressors:
            config = regressor_configs[regressor]
            model.add_regressor(
                name=regressor,
                mode=config['mode'],
                standardize=config['standardize']
            )
            logger.debug(f"Added regressor {regressor} with config {config}")
        
        # Add country-specific holidays
        model.add_country_holidays(country_name='US')
        
        logger.info(f"Created Prophet model with parameters: {model_params}")
        logger.info(f"Added regressors: {available_regressors}")
        
        return model
        
    except Exception as e:
        logger.error(f"Error creating Prophet model: {str(e)}")
        raise

def create_lstm_model(input_shape: Tuple[int, int], dropout_rate: float = 0.2) -> Sequential:
    """Create LSTM model with improved architecture
    
    Args:
        input_shape: Shape of input data (sequence_length, n_features)
        dropout_rate: Dropout rate for regularization
    
    Returns:
        Configured LSTM model
    """
    model = Sequential([
        LSTM(50, activation='relu', input_shape=input_shape, return_sequences=False),
        Dropout(dropout_rate),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mse')
    logger.info(f"Created LSTM model with input shape: {input_shape}")
    return model

def create_hybrid_models_batch(channels: Optional[List[str]] = None, data_path: str = 'data.csv') -> None:
    """Create hybrid models for multiple channels with enhanced error handling and memory management
    
    Args:
        channels: List of channels to create models for
        data_path: Path to the data file
    """
    start_time = datetime.now()
    logger.info(f"Starting batch model creation at {start_time}")
    
    try:
        # If no channels specified, get all channels
        if channels is None:
            channels = get_channels(data_path)
        
        # Validate channels
        if not channels:
            raise ValueError("No channels specified or found in data")
        
        # Start MLflow run for batch
        with mlflow.start_run(run_name="hybrid_models_batch_training") as run:
            mlflow.log_params({
                "channels": channels,
                "data_path": data_path,
                "start_time": start_time.isoformat()
            })
            
            failed_channels = []
            for channel in channels:
                try:
                    logger.info(f"Processing channel: {channel}")
                    
                    # Load and preprocess data
                    data = load_and_preprocess_data(data_path, channel)
                    
                    # Train and evaluate Prophet model
                    with mlflow.start_run(run_name=f"prophet_{channel}", nested=True):
                        prophet_model = create_prophet_model(data)
                        prophet_forecast = prophet_model.fit(data).predict(data)
                        
                        # Calculate and log metrics
                        metrics = calculate_metrics(data['y'], prophet_forecast['yhat'], prefix=f"{channel}_prophet")
                        mlflow.log_metrics(metrics)
                        
                        # Save Prophet model
                        save_prophet_model(prophet_model, channel, base_path="ml_models")
                    
                    # Clear memory after Prophet
                    del prophet_model, prophet_forecast
                    gc.collect()
                    
                    # Train and evaluate LSTM model
                    with mlflow.start_run(run_name=f"lstm_{channel}", nested=True):
                        seq_length = 7
                        X, y = prepare_lstm_data(data, seq_length)
                        X = X.reshape((X.shape[0], X.shape[1], 1))
                        
                        lstm_model = create_lstm_model((X.shape[1], 1))
                        history = lstm_model.fit(
                            X, y,
                            epochs=20,
                            batch_size=32,
                            validation_split=0.2,
                            verbose=0
                        )
                        
                        # Calculate and log metrics
                        lstm_predictions = lstm_model.predict(X).flatten()
                        metrics = calculate_metrics(y, lstm_predictions, prefix=f"{channel}_lstm")
                        metrics.update({
                            f"{channel}_lstm_final_loss": history.history['loss'][-1],
                            f"{channel}_lstm_final_val_loss": history.history['val_loss'][-1]
                        })
                        mlflow.log_metrics(metrics)
                        
                        # Save LSTM model
                        save_model_with_metadata(lstm_model, f"lstm_{channel}", channel)
                    
                    # Clear memory after LSTM
                    del lstm_model, X, y
                    gc.collect()
                    
                except Exception as e:
                    logger.error(f"Error processing channel {channel}: {str(e)}")
                    failed_channels.append((channel, str(e)))
                    continue
            
            # Log final status
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            mlflow.log_params({
                "end_time": end_time.isoformat(),
                "duration_seconds": duration,
                "failed_channels": [c[0] for c in failed_channels]
            })
            
            if failed_channels:
                logger.warning(f"Failed channels: {failed_channels}")
            
            logger.info(f"Batch processing completed in {duration:.2f} seconds")
            
    except Exception as e:
        logger.error(f"Critical error in batch processing: {str(e)}")
        raise

def process_channel(channel: str, data_path: str, model_dir: str = None):
    """Process data for a single channel with ensemble learning
    
    Args:
        channel: Channel name
        data_path: Path to data file
        model_dir: Directory to save models. If None, uses backend/ml_models
    """
    if model_dir is None:
        model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'ml_models')
    
    try:
        logger.info(f"Starting processing for channel: {channel}")
        
        # Load and preprocess data
        data = load_and_preprocess_data(data_path, channel)
        logger.debug(f"Loaded and preprocessed data for {channel}: {len(data)} records")
        
        # Split data into train and validation sets (80-20 split)
        train_size = int(len(data) * 0.8)
        train_data = data[:train_size]
        val_data = data[train_size:]
        logger.debug(f"Split data into train ({len(train_data)} records) and validation ({len(val_data)} records)")
        
        # Train Prophet model
        logger.info(f"Training Prophet model for {channel}")
        prophet_model = create_prophet_model(train_data)
        prophet_model.fit(train_data)
        logger.info(f"Prophet model training completed for {channel}")
        
        # Generate Prophet predictions for validation set
        prophet_forecast = prophet_model.predict(val_data)
        prophet_predictions = prophet_forecast['yhat'].values
        logger.debug(f"Generated Prophet predictions for validation set: {len(prophet_predictions)} predictions")
        
        # Prepare LSTM data
        logger.info(f"Preparing LSTM data for {channel}")
        sequence_length = 30
        X_train, y_train, scaler_params = prepare_lstm_data(train_data, sequence_length)
        logger.debug(f"Prepared LSTM training data: {X_train.shape}")
        
        # Get input shape for LSTM model
        n_features = X_train.shape[2]
        input_shape = (sequence_length, n_features)
        
        # Create and train LSTM model
        logger.info(f"Training LSTM model for {channel}")
        lstm_model = create_lstm_model(input_shape)
        lstm_model.fit(X_train, y_train, epochs=50, batch_size=32, verbose=1)
        logger.info(f"LSTM model training completed for {channel}")
        
        # Generate LSTM predictions for validation set
        X_val, y_val, _ = prepare_lstm_data(val_data, sequence_length, scaler_params)
        lstm_predictions = lstm_model.predict(X_val).flatten()
        logger.debug(f"Generated LSTM predictions for validation set: {len(lstm_predictions)} predictions")
        
        # Align predictions lengths
        min_len = min(len(prophet_predictions), len(lstm_predictions))
        prophet_predictions = prophet_predictions[-min_len:]
        lstm_predictions = lstm_predictions[-min_len:]
        actual_values = val_data['y'].values[-min_len:]
        
        # Train meta-model
        logger.info(f"Training meta-model for {channel}")
        meta_model = train_meta_model(
            prophet_predictions=prophet_predictions,
            lstm_predictions=lstm_predictions,
            actual_values=actual_values
        )
        logger.info(f"Meta-model training completed for {channel}")
        
        # Calculate metrics for individual models and ensemble
        meta_predictions = meta_model.predict(
            np.column_stack((prophet_predictions, lstm_predictions))
        )
        
        metrics = {}
        metrics.update(calculate_metrics(actual_values, prophet_predictions, "prophet_"))
        metrics.update(calculate_metrics(actual_values, lstm_predictions, "lstm_"))
        metrics.update(calculate_metrics(actual_values, meta_predictions, "ensemble_"))
        
        logger.info(f"Model metrics for {channel}:")
        for name, value in metrics.items():
            logger.info(f"{name}: {value:.4f}")
        
        # Save all models
        logger.info(f"Saving models for {channel}")
        channel_dir = os.path.join(model_dir, channel)
        save_prophet_model(prophet_model, channel, model_dir)
        save_lstm_model(lstm_model, channel, model_dir)
        save_meta_model(meta_model, channel, model_dir)
        
        # Save scaler parameters
        scaler_path = os.path.join(channel_dir, 'scaler_params.json')
        with open(scaler_path, 'w') as f:
            json.dump(scaler_params, f, indent=4)
        
        logger.info(f"Successfully completed processing for channel {channel}")
        
    except Exception as e:
        logger.error(f"Error processing channel {channel}: {str(e)}", exc_info=True)
        raise

def calculate_metrics(actual: np.ndarray, predicted: np.ndarray, prefix: str = "") -> Dict[str, float]:
    """Calculate evaluation metrics
    
    Args:
        actual: Actual values
        predicted: Predicted values
        prefix: Prefix for metric names
    
    Returns:
        Dictionary of metrics
    """
    return {
        f"{prefix}_mae": mean_absolute_error(actual, predicted),
        f"{prefix}_mse": mean_squared_error(actual, predicted),
        f"{prefix}_rmse": sqrt(mean_squared_error(actual, predicted))
    }

def save_model_with_metadata(model: Any, model_name: str, channel: str) -> None:
    """Save model and its metadata
    
    Args:
        model: Model to save (Prophet or LSTM)
        model_name: Name for the saved model
        channel: Channel name
    """
    try:
        model_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        
        # Save model based on its type
        if isinstance(model, Prophet):
            # For Prophet models, use the new save_prophet_model function
            save_prophet_model(model, channel, base_path=model_dir)
        else:
            # For LSTM models, use tensorflow save_model
            save_model(model, str(model_dir / model_name))
        
        # Save metadata
        metadata = {
            'channel': channel,
            'creation_time': datetime.now().isoformat(),
            'model_type': type(model).__name__,
            'model_path': str(model_dir / model_name)
        }
        joblib.dump(metadata, model_dir / f'{model_name}_metadata.joblib')
        
        logger.info(f"Successfully saved {type(model).__name__} model for channel {channel}")
        
    except Exception as e:
        logger.error(f"Error saving {type(model).__name__} model: {str(e)}")
        raise

def get_channels(data_path: str) -> List[str]:
    """Get list of unique channels from the data
    
    Args:
        data_path: Path to the data file
    
    Returns:
        List of unique channel names
    
    Raises:
        FileNotFoundError: If data file doesn't exist
    """
    try:
        current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        data_file = current_dir / data_path
        
        if not data_file.exists():
            raise FileNotFoundError(f"Data file not found: {data_file}")
        
        data = pd.read_csv(data_file)
        return sorted(data['Channel_Used'].unique().tolist())
        
    except Exception as e:
        logger.error(f"Error getting channels: {str(e)}")
        raise

def serialize_prophet_model(model: Prophet) -> dict:
    """Serialize Prophet model to a dictionary
    
    Args:
        model: Prophet model to serialize
    
    Returns:
        Dictionary containing model parameters and state
    """
    model_data = {
        'growth': model.growth,
        'n_changepoints': model.n_changepoints,
        'changepoint_range': float(model.changepoint_range),
        'yearly_seasonality': model.yearly_seasonality,
        'weekly_seasonality': model.weekly_seasonality,
        'daily_seasonality': model.daily_seasonality,
        'seasonality_mode': model.seasonality_mode,
        'seasonality_prior_scale': float(model.seasonality_prior_scale),
        'changepoint_prior_scale': float(model.changepoint_prior_scale),
        'holidays_prior_scale': float(model.holidays_prior_scale),
        'mcmc_samples': model.mcmc_samples,
        'interval_width': model.interval_width,
        'uncertainty_samples': model.uncertainty_samples,
        'stan_backend': type(model.stan_backend).__name__,
    }
    
    # Add changepoints if they exist
    if model.changepoints is not None:
        # Convert pandas timestamps to string format
        model_data['changepoints'] = model.changepoints.dt.strftime('%Y-%m-%d %H:%M:%S').tolist()
    
    # Add country holidays if specified
    if hasattr(model, 'country_holidays') and model.country_holidays is not None:
        model_data['country_holidays'] = model.country_holidays
    
    # Add custom seasonalities
    if hasattr(model, 'seasonalities') and model.seasonalities:
        model_data['seasonalities'] = {
            name: {
                'period': s['period'],
                'fourier_order': s['fourier_order'],
                'prior_scale': float(s['prior_scale']),
                'mode': s['mode'],
                'condition_name': s['condition_name']
            }
            for name, s in model.seasonalities.items()
        }
    
    # Add extra regressors if any
    if hasattr(model, 'extra_regressors') and model.extra_regressors:
        model_data['extra_regressors'] = {
            name: {
                'prior_scale': float(regressor['prior_scale']),
                'standardize': regressor['standardize'],
                'mode': regressor['mode']
            }
            for name, regressor in model.extra_regressors.items()
        }
    
    # Add training data summary
    if hasattr(model, 'history') and model.history is not None:
        model_data['history_dates'] = {
            'start': model.history['ds'].min().strftime('%Y-%m-%d %H:%M:%S'),
            'end': model.history['ds'].max().strftime('%Y-%m-%d %H:%M:%S'),
            'periods': len(model.history)
        }
    
    return model_data

def save_prophet_model(model: Prophet, channel: str, base_path: str) -> str:
    """Save Prophet model with its parameters and state
    
    Args:
        model: Trained Prophet model
        channel: Social media channel name
        base_path: Base path for saving model files
    
    Returns:
        Path to saved model directory
    """
    try:
        # Create prophet model directory
        model_dir = os.path.join(base_path, channel, 'prophet')
        os.makedirs(model_dir, exist_ok=True)
        
        # Save model parameters and configuration
        model_data = serialize_prophet_model(model)
        model_path = os.path.join(model_dir, 'model.json')
        with open(model_path, 'w') as f:
            json.dump(model_data, f, indent=4)
        
        # Save the fitted model using pickle
        model_binary_path = os.path.join(model_dir, 'model.pkl')
        with open(model_binary_path, 'wb') as f:
            pickle.dump(model, f)
        
        logger.info(f"Prophet model saved to {model_dir}")
        return model_dir
        
    except Exception as e:
        logger.error(f"Error saving Prophet model: {str(e)}", exc_info=True)
        raise

def load_prophet_model(model_dir: str) -> Prophet:
    """Load a saved Prophet model
    
    Args:
        model_dir: Directory containing saved model files
    
    Returns:
        Loaded Prophet model
    """
    try:
        model_binary_path = os.path.join(model_dir, 'model.pkl')
        if not os.path.exists(model_binary_path):
            raise FileNotFoundError(f"Prophet model file not found at {model_binary_path}")
        
        with open(model_binary_path, 'rb') as f:
            model = pickle.load(f)
        
        logger.info(f"Prophet model loaded from {model_binary_path}")
        return model
        
    except Exception as e:
        logger.error(f"Error loading Prophet model: {str(e)}", exc_info=True)
        raise

def save_meta_model(model: LinearRegression, channel: str, base_path: str) -> str:
    """Save meta-model and its parameters
    
    Args:
        model: Trained meta-model
        channel: Social media channel name
        base_path: Base path for saving model files
    
    Returns:
        Path to saved model directory
    """
    model_dir = os.path.join(base_path, channel, 'meta_model')
    os.makedirs(model_dir, exist_ok=True)
    
    # Save model using joblib
    model_path = os.path.join(model_dir, 'model.joblib')
    joblib.dump(model, model_path)
    
    # Save metadata
    metadata = {
        'coefficients': model.coef_.tolist(),
        'intercept': float(model.intercept_),
        'timestamp': datetime.now().isoformat()
    }
    
    metadata_path = os.path.join(model_dir, 'config.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    
    logger.info(f"Meta-model saved to {model_dir}")
    return model_dir

def load_meta_model(model_dir: str) -> LinearRegression:
    """Load a saved meta-model
    
    Args:
        model_dir: Directory containing saved meta-model files
    
    Returns:
        Loaded meta-model
    """
    model_path = os.path.join(model_dir, 'model.joblib')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Meta-model file not found at {model_path}")
    
    model = joblib.load(model_path)
    logger.info(f"Meta-model loaded from {model_path}")
    return model

def save_lstm_model(model: Sequential, channel: str, base_path: str) -> str:
    """Save LSTM model and its metadata
    
    Args:
        model: Trained LSTM model
        channel: Channel name
        base_path: Base path for saving model files
    
    Returns:
        Path to saved model directory
    """
    model_dir = os.path.join(base_path, channel, 'lstm')
    os.makedirs(model_dir, exist_ok=True)
    
    # Save model in Keras format
    model_path = os.path.join(model_dir, 'model.keras')
    model.save(model_path)
    
    # Save model configuration
    config = {
        'input_shape': model.input_shape[1:],  # Remove batch dimension
        'architecture': model.get_config(),
        'timestamp': datetime.now().isoformat()
    }
    
    config_path = os.path.join(model_dir, 'config.json')
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=4)
    
    logger.info(f"LSTM model saved to {model_dir}")
    return model_dir

def load_lstm_model(model_dir: str) -> Sequential:
    """Load a saved LSTM model
    
    Args:
        model_dir: Directory containing saved model files
    
    Returns:
        Loaded LSTM model
    """
    model_path = os.path.join(model_dir, 'model.keras')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"LSTM model file not found at {model_path}")
    
    model = tf.keras.models.load_model(model_path)
    logger.info(f"LSTM model loaded from {model_path}")
    return model

def normalize_features(data: pd.DataFrame, feature_columns: List[str]) -> Tuple[pd.DataFrame, Dict[str, Dict[str, float]]]:
    """Normalize features using min-max scaling
    
    Args:
        data: Input DataFrame
        feature_columns: List of columns to normalize
    
    Returns:
        Tuple of normalized DataFrame and dictionary of (min, max) values for each feature
    """
    normalized_data = data.copy()
    scaler_params = {}
    
    for col in feature_columns:
        if col not in data.columns:
            raise ValueError(f"Column {col} not found in data")
        
        values = data[col].values
        min_val = float(np.min(values))
        max_val = float(np.max(values))
        
        # Store parameters
        scaler_params[col] = {
            'min': min_val,
            'max': max_val
        }
        
        # Normalize if there's a range, otherwise set to 0
        if max_val > min_val:
            normalized_data[col] = (values - min_val) / (max_val - min_val)
        else:
            normalized_data[col] = 0
    
    return normalized_data, scaler_params

def prepare_sequences(data: pd.DataFrame, feature_columns: List[str], sequence_length: int = 30) -> Tuple[np.ndarray, np.ndarray]:
    """Prepare sequences for LSTM model
    
    Args:
        data: Input DataFrame
        feature_columns: List of feature columns
        sequence_length: Length of input sequences
    
    Returns:
        Tuple of input sequences and target values
    """
    # Ensure all feature columns exist in the data
    missing_cols = [col for col in feature_columns if col not in data.columns]
    if missing_cols:
        raise ValueError(f"Missing columns in data: {missing_cols}")
    
    # Extract features and target
    features = data[feature_columns].values
    target = data['y'].values
    
    # Create sequences
    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(features[i:(i + sequence_length)])
        y.append(target[i + sequence_length])
    
    return np.array(X), np.array(y)

def prepare_lstm_data(data: pd.DataFrame, sequence_length: int = 30, scaler_params: Optional[Dict[str, Dict[str, float]]] = None) -> Tuple[np.ndarray, np.ndarray, Dict[str, Dict[str, float]]]:
    """Prepare data for LSTM model training
    
    Args:
        data: Input DataFrame
        sequence_length: Length of sequences for LSTM
        scaler_params: Optional dictionary of scaling parameters
    
    Returns:
        Tuple of (X_train, y_train, scaler_params)
    """
    # Define feature columns (excluding 'ds' and 'y')
    feature_columns = [col for col in data.columns if col not in ['ds', 'y']]
    
    # Normalize features
    if scaler_params is None:
        normalized_data, scaler_params = normalize_features(data, feature_columns)
    else:
        # Apply existing scaling parameters
        normalized_data = data.copy()
        for col in feature_columns:
            if col in scaler_params:
                min_val = scaler_params[col]['min']
                max_val = scaler_params[col]['max']
                if max_val > min_val:
                    normalized_data[col] = (data[col] - min_val) / (max_val - min_val)
                else:
                    normalized_data[col] = 0
            else:
                logger.warning(f"No scaling parameters found for column {col}, skipping normalization")
                normalized_data[col] = data[col]
    
    # Add target variable to normalized data
    normalized_data['y'] = data['y']
    
    # Prepare sequences
    X, y = prepare_sequences(normalized_data, feature_columns, sequence_length)
    
    logger.info(f"Prepared LSTM data with shape X: {X.shape}, y: {y.shape}")
    return X, y, scaler_params

def train_meta_model(prophet_predictions: np.ndarray, lstm_predictions: np.ndarray, actual_values: np.ndarray) -> LinearRegression:
    """Train a meta-model that combines Prophet and LSTM predictions
    
    Args:
        prophet_predictions: Predictions from Prophet model
        lstm_predictions: Predictions from LSTM model
        actual_values: Actual target values
    
    Returns:
        Trained meta-model (Linear Regression)
    """
    # Combine predictions as features for meta-model
    meta_features = np.column_stack((prophet_predictions, lstm_predictions))
    
    # Create and train meta-model
    meta_model = LinearRegression()
    meta_model.fit(meta_features, actual_values)
    
    logger.info(f"Meta-model coefficients - Prophet: {meta_model.coef_[0]:.3f}, LSTM: {meta_model.coef_[1]:.3f}")
    logger.info(f"Meta-model intercept: {meta_model.intercept_:.3f}")
    
    return meta_model

def save_meta_model(model: LinearRegression, channel: str, base_path: str) -> str:
    """Save meta-model and its parameters
    
    Args:
        model: Trained meta-model
        channel: Social media channel name
        base_path: Base path for saving model files
    
    Returns:
        Path to saved model directory
    """
    model_dir = os.path.join(base_path, channel, 'meta_model')
    os.makedirs(model_dir, exist_ok=True)
    
    # Save model using joblib
    model_path = os.path.join(model_dir, 'model.joblib')
    joblib.dump(model, model_path)
    
    # Save metadata
    metadata = {
        'coefficients': model.coef_.tolist(),
        'intercept': float(model.intercept_),
        'timestamp': datetime.now().isoformat()
    }
    
    metadata_path = os.path.join(model_dir, 'config.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    
    logger.info(f"Meta-model saved to {model_dir}")
    return model_dir

def load_meta_model(model_dir: str) -> LinearRegression:
    """Load a saved meta-model
    
    Args:
        model_dir: Directory containing saved meta-model files
    
    Returns:
        Loaded meta-model
    """
    model_path = os.path.join(model_dir, 'model.joblib')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Meta-model file not found at {model_path}")
    
    model = joblib.load(model_path)
    logger.info(f"Meta-model loaded from {model_path}")
    return model

if __name__ == "__main__":
    try:
        # Get available channels
        channels = get_channels('data.csv')
        logger.info(f"Available channels: {channels}")
        
        # Create models for all social media channels
        for channel in channels:
            process_channel(channel, 'data.csv')
        
    except Exception as e:
        logger.error(f"Application error: {str(e)}")
        raise
