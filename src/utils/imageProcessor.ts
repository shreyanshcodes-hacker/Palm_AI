import { Language } from '../types';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
}

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates selected file for type, extension, and size.
 */
export function validateImageFile(file: File | null | undefined, language: Language = 'English'): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: language === 'Hindi' ? 'कृपया एक वैध फ़ोटो चुनें।' : 'Please select a valid image file.',
    };
  }

  // 1. Check size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error:
        language === 'Hindi'
          ? 'कृपया 10 MB से छोटी फोटो अपलोड करें।'
          : 'Please upload an image smaller than 10 MB.',
    };
  }

  // 2. Check MIME type and extension
  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  const hasValidMime = SUPPORTED_MIME_TYPES.some((mime) => fileType.includes(mime)) || fileType.startsWith('image/');
  const hasValidExt = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasValidMime && !hasValidExt) {
    return {
      valid: false,
      error:
        language === 'Hindi'
          ? 'केवल JPG, PNG, या WEBP प्रारूप समर्थित हैं।'
          : 'Please select a valid image format (JPG, JPEG, PNG, or WEBP).',
    };
  }

  return {
    valid: true,
    file,
  };
}

/**
 * Compresses and scales an image to an optimal size for preview and API transport.
 * Constrains max dimension to 1600px and exports as clean JPEG data URL.
 */
export function processAndCompressImage(
  fileOrBase64: File | string,
  maxDimension = 1600,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    const loadImage = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original src if canvas 2D context is unavailable
            resolve(src);
            return;
          }

          // Fill white background (useful for transparent PNGs converted to JPEG)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Image canvas compression fallback, using source:', err);
          resolve(src);
        }
      };

      img.onerror = (err) => {
        console.error('Failed to load image for compression:', err);
        reject(new Error('Failed to load image file.'));
      };

      img.src = src;
    };

    if (typeof fileOrBase64 === 'string') {
      loadImage(fileOrBase64);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          loadImage(e.target.result as string);
        } else {
          reject(new Error('Failed to read file buffer.'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error.'));
      reader.readAsDataURL(fileOrBase64);
    }
  });
}
