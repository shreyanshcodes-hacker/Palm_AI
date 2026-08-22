import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  AlertCircle,
  X,
  Smartphone,
} from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';
import { CameraModal } from './CameraModal';
import { validateImageFile, processAndCompressImage } from '../utils/imageProcessor';

interface UploadSectionProps {
  imagePreview: string | null;
  onImageSelected: (base64Image: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
  language: Language;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  imagePreview,
  onImageSelected,
  onAnalyze,
  onBack,
  language,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hidden file inputs
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessFile = async (file: File) => {
    setValidationError(null);

    // 1. Validate file format and size
    const validation = validateImageFile(file, language);
    if (!validation.valid) {
      setValidationError(validation.error || 'Please select a valid image file.');
      return;
    }

    try {
      setIsProcessing(true);
      // 2. Compress and scale image for fast upload and preview
      const compressedBase64 = await processAndCompressImage(file, 1600, 0.88);
      onImageSelected(compressedBase64);
    } catch (err: any) {
      console.error('Image processing error:', err);
      setValidationError(
        language === 'Hindi'
          ? 'फोटो लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Failed to process the selected image. Please try another photo.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleTakePhotoClick = () => {
    setValidationError(null);

    // Check if mediaDevices and getUserMedia exist
    const hasGetUserMedia =
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';

    if (hasGetUserMedia) {
      setIsCameraOpen(true);
    } else {
      // Fallback directly to native mobile camera capture
      mobileCameraInputRef.current?.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      {/* Hidden standard gallery file input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleProcessFile(e.target.files[0]);
            e.target.value = ''; // Reset input
          }
        }}
      />

      {/* Hidden mobile camera capture input with capture="environment" */}
      <input
        ref={mobileCameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleProcessFile(e.target.files[0]);
            e.target.value = ''; // Reset input
          }
        }}
      />

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-2xl shadow-stone-200/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backBtn}</span>
          </button>
          <div className="text-right">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200/60">
              Step 2 of 2
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {t.uploadHeading}
          </h2>
          <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">{t.uploadSub}</p>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 text-sm animate-shake">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Dropzone or Preview */}
        {!imagePreview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
              isDragging
                ? 'border-amber-500 bg-amber-50/40 scale-[1.01]'
                : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-900 shadow-sm">
              <Upload className="w-8 h-8 text-amber-800" />
            </div>

            <p className="text-base font-medium text-stone-800 mb-1">{t.dragDropText}</p>
            <p className="text-xs text-stone-400 mb-6">{t.supportedFormats}</p>

            {/* Action Buttons for Mobile & Desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="browse-files-btn"
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-md flex items-center justify-center gap-2.5 cursor-pointer transition-transform hover:scale-102"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{t.browseFilesBtn}</span>
              </button>

              <span className="text-xs text-stone-400 font-medium uppercase px-2">{t.orText}</span>

              <button
                id="take-photo-btn"
                type="button"
                onClick={handleTakePhotoClick}
                disabled={isProcessing}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-md flex items-center justify-center gap-2.5 cursor-pointer transition-transform hover:scale-102"
              >
                <Camera className="w-4 h-4 text-stone-950" />
                <span>{t.scanWithCameraBtn || t.takePhotoBtn}</span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-950/20 text-stone-950 font-mono font-bold">
                  Auto
                </span>
              </button>
            </div>

            {isProcessing && (
              <p className="mt-4 text-xs text-amber-700 animate-pulse font-medium">
                {language === 'Hindi' ? 'फोटो प्रोसेस हो रही है...' : 'Optimizing photo for reading...'}
              </p>
            )}
          </div>
        ) : (
          /* Image Selected Preview */
          <div className="space-y-6">
            <div className="relative max-w-sm mx-auto rounded-3xl overflow-hidden border-4 border-stone-100 shadow-2xl bg-stone-900 group">
              <img
                src={imagePreview}
                alt="Palm Preview"
                className="w-full aspect-3/4 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4 justify-between">
                <span className="text-xs text-stone-200 font-medium bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700">
                  ✓ {t.photoLoadedText || 'Photo Loaded'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="text-xs text-amber-300 font-medium bg-stone-900/90 hover:bg-stone-900 px-3 py-1.5 rounded-full border border-amber-400/40 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.changePhotoBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Retake / Change Options */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
              >
                <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.uploadFromGalleryBtn || 'Upload from Gallery'}</span>
              </button>

              <button
                type="button"
                onClick={handleTakePhotoClick}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
              >
                <Camera className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.retakePhotoBtn || 'Retake Photo'}</span>
              </button>
            </div>

            {/* Main Action: Continue / Analyze Palm */}
            <button
              id="analyze-now-btn"
              type="button"
              onClick={onAnalyze}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 hover:from-stone-800 hover:to-amber-900 text-white font-semibold text-base shadow-xl shadow-amber-900/10 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{t.analyzeNowBtn}</span>
            </button>
          </div>
        )}

        {/* Guidelines Checklist */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4 text-center">
            {t.guidelinesTitle}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-stone-700 font-medium">{t.guideLighting}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-stone-700 font-medium">{t.guideFingers}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-stone-700 font-medium">{t.guideEntirePalm}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-stone-700 font-medium">{t.guideBackground}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => onImageSelected(dataUrl)}
        onSwitchToFileUpload={() => {
          setIsCameraOpen(false);
          galleryInputRef.current?.click();
        }}
        language={language}
      />
    </motion.div>
  );
};

