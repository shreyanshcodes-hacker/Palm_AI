import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  language: Language;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language,
}) => {
  const t = UI_TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg('Unable to access camera. Please allow camera permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleSnap = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(dataUrl);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-stone-900 text-white rounded-3xl max-w-lg w-full overflow-hidden border border-stone-800 shadow-2xl relative">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold font-serif">{t.cameraModalTitle}</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed */}
        <div className="relative aspect-3/4 bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-red-400 text-sm">
              <p>{errorMsg}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-stone-800 rounded-xl text-white text-xs inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Palm alignment overlay guidelines */}
              <div className="absolute inset-8 border-2 border-dashed border-amber-400/60 rounded-3xl pointer-events-none flex items-center justify-center">
                <span className="text-xs text-amber-300 bg-stone-900/80 px-3 py-1 rounded-full font-mono">
                  Align Palm Here
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 flex items-center justify-between gap-4 bg-stone-950">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-sm hover:bg-stone-800"
          >
            {t.closeCameraBtn}
          </button>
          {!errorMsg && (
            <button
              onClick={handleSnap}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>{t.captureBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
