import torch
import logging
import sys

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

def check_pytorch_gpu():
    logger.info("\n=== PyTorch GPU Status ===")
    logger.info(f"PyTorch version: {torch.__version__}")
    
    # Check Intel XPU (GPU) availability
    try:
        import intel_extension_for_pytorch as ipex
        logger.info("Intel PyTorch Extension (IPEX) is installed")
        xpu_available = torch.xpu.is_available()
        logger.info(f"Intel XPU available: {xpu_available}")
        if xpu_available:
            logger.info(f"XPU device count: {torch.xpu.device_count()}")
            logger.info(f"Current XPU device: {torch.xpu.current_device()}")
            logger.info(f"XPU device name: {torch.xpu.get_device_name()}")
            
            # Test PyTorch XPU Operation
            logger.info("\nTesting PyTorch XPU Operation:")
            device = torch.device('xpu')
            a = torch.randn(1000, 1000).to(device)
            b = torch.randn(1000, 1000).to(device)
            c = torch.matmul(a, b)
            logger.info("Successfully ran tensor operation on Intel XPU")
    except ImportError:
        logger.warning("Intel PyTorch Extension (IPEX) is not installed")
    except Exception as e:
        logger.warning(f"Error checking Intel XPU: {str(e)}")
    
    # Check CUDA availability as fallback
    logger.info(f"\nCUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        logger.info(f"CUDA device count: {torch.cuda.device_count()}")
        logger.info(f"CUDA device name: {torch.cuda.get_device_name(0)}")
        
        # Test PyTorch CUDA Operation
        logger.info("\nTesting PyTorch CUDA Operation:")
        try:
            device = torch.device('cuda')
            a = torch.randn(1000, 1000).to(device)
            b = torch.randn(1000, 1000).to(device)
            c = torch.matmul(a, b)
            logger.info("Successfully ran tensor operation on CUDA GPU")
        except Exception as e:
            logger.error(f"Failed to run operation on CUDA GPU: {str(e)}")
    
    # If no GPU available, test CPU
    if not (torch.cuda.is_available() or (hasattr(torch, 'xpu') and torch.xpu.is_available())):
        logger.info("\nNo GPU available, testing CPU operation:")
        try:
            device = torch.device('cpu')
            a = torch.randn(1000, 1000).to(device)
            b = torch.randn(1000, 1000).to(device)
            c = torch.matmul(a, b)
            logger.info("Successfully ran tensor operation on CPU")
        except Exception as e:
            logger.error(f"Failed to run operation on CPU: {str(e)}")

if __name__ == "__main__":
    logger.info("=== GPU Diagnostic Tool ===")
    check_pytorch_gpu()
