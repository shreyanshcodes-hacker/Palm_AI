import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Camera, CheckCircle2, Image as ImageIcon, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';
import { CameraModal } from './CameraModal';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-900 shadow-sm">
              <Upload className="w-8 h-8 text-amber-800" />
            </div>

            <p className="text-base font-medium text-stone-800 mb-1">{t.dragDropText}</p>
            <p className="text-xs text-stone-400 mb-6">{t.supportedFormats}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="browse-files-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{t.browseFilesBtn}</span>
              </button>

              <span className="text-xs text-stone-400 font-medium uppercase px-2">{t.orText}</span>

              <button
                id="take-photo-btn"
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
              >
                <Camera className="w-4 h-4 text-stone-950" />
                <span>{t.takePhotoBtn}</span>
              </button>
            </div>
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
                  ✓ Photo Loaded
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-amber-300 font-medium bg-stone-900/90 hover:bg-stone-900 px-3 py-1.5 rounded-full border border-amber-400/40 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.changePhotoBtn}</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            <button
              id="analyze-now-btn"
              type="button"
              onClick={onAnalyze}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 hover:from-stone-800 hover:to-amber-900 text-white font-medium text-base shadow-xl shadow-amber-900/10 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
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
        language={language}
      />
    </motion.div>
  );
};
