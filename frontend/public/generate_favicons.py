'''
Created Date: Friday, November 15th 2024, 7:22:42 pm
Author: Declan Trevor Kintu

Copyright (c) 2024 Your Company
'''

from PIL import Image
import os
import sys
from pathlib import Path

def is_valid_image(file_path):
    """Check if file is a valid image and has valid dimensions."""
    try:
        with Image.open(file_path) as img:
            # Get image dimensions
            width, height = img.size
            
            # Check if image is square
            if width != height:
                print(f"Error: Image must be square. Current dimensions: {width}x{height}")
                return False
            
            # Check if image is at least 600x600
            if width < 600:
                print(f"Error: Image must be at least 600x600 pixels. Current size: {width}x{height}")
                return False
            
            return True
    except Exception as e:
        print(f"Error: Unable to process image - {str(e)}")
        return False

def generate_favicons(source_path):
    """Generate favicon files from a source HD image."""
    # Check if source file exists
    if not os.path.exists(source_path):
        print(f"Error: Source file '{source_path}' not found!")
        return False

    # Validate source image
    if not is_valid_image(source_path):
        return False

    # Open and process the source image
    try:
        original = Image.open(source_path)
        print(f"Source image size: {original.size[0]}x{original.size[1]} pixels")
        print(f"Source image format: {original.format}")

        # Convert to RGBA if not already
        if original.mode != 'RGBA':
            original = original.convert('RGBA')

        # Define the required sizes and formats
        favicon_sizes = {
            'favicon-16x16.png': (16, 16),
            'favicon-32x32.png': (32, 32),
            'favicon-192x192.png': (192, 192),
            'favicon-512x512.png': (512, 512),
            'apple-touch-icon.png': (180, 180)
        }

        # Generate PNG versions
        for filename, size in favicon_sizes.items():
            try:
                img = original.copy()
                img = img.resize(size, Image.Resampling.LANCZOS)
                img.save(filename, 'PNG', quality=100, optimize=True)
                print(f"Generated {filename} ({size[0]}x{size[1]} pixels)")
            except Exception as e:
                print(f"Error generating {filename}: {e}")
                continue

        # Generate ICO file (containing both 16x16 and 32x32)
        try:
            ico_sizes = [(16, 16), (32, 32)]
            ico_images = []
            for size in ico_sizes:
                img = original.copy()
                img = img.resize(size, Image.Resampling.LANCZOS)
                ico_images.append(img)
            
            # Save as ICO with both sizes
            ico_images[0].save('favicon.ico', 
                             format='ICO', 
                             sizes=[(16, 16), (32, 32)],
                             append_images=[ico_images[1]])
            print("Generated favicon.ico (16x16, 32x32)")
        except Exception as e:
            print(f"Error generating favicon.ico: {e}")

        print("\nFavicon generation completed successfully!")
        return True

    except Exception as e:
        print(f"Error processing source image: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_favicons.py <source_image_path>")
        print("Supported formats: PNG, JPG, JPEG, WebP")
        print("Requirements: ")
        print("- Square image (e.g., 600x600)")
        print("- Minimum size: 600x600 pixels")
        sys.exit(1)

    source = sys.argv[1]
    if not os.path.exists(source):
        print(f"Error: Source file '{source}' not found!")
        sys.exit(1)

    # Check file extension
    valid_extensions = {'.png', '.jpg', '.jpeg', '.webp'}
    file_ext = Path(source).suffix.lower()
    if file_ext not in valid_extensions:
        print(f"Error: Unsupported file format. Please use: {', '.join(valid_extensions)}")
        sys.exit(1)

    if not generate_favicons(source):
        sys.exit(1)
