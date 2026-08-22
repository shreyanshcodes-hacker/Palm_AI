import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, UploadCloud, AlertCircle, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';
import { processAndCompressImage } from '../utils/imageProcessor';
import { getHandLandmarker, evaluateHandPose } from '../utils/handLandmarker';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  onSwitchToFileUpload?: () => void;
  language: Language;
}

type AutoCaptureStage = 'WAITING_FOR_HAND' | 'HAND_DETECTED' | 'HOLD_STEADY' | 'COUNTDOWN' | 'CAPTURING';

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onSwitchToFileUpload,
  language,
}) => {
  const t = UI_TRANSLATIONS[language];
  const isHindi = language === 'Hindi';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileFallbackRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Auto-capture state
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(true);
  const [stage, setStage] = useState<AutoCaptureStage>('WAITING_FOR_HAND');
  const [statusMessage, setStatusMessage] = useState<string>(t.showPalmMsg || 'Show your palm to the camera');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const [stabilityScore, setStabilityScore] = useState<number>(0);

  // Animation & detection loop refs
  const animationFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const stableStartTimeRef = useRef<number | null>(null);
  const prevPositionRef = useRef<{ x: number; y: number } | null>(null);
  const isCapturingRef = useRef<boolean>(false);

  const stopCamera = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop warning:', e);
        }
      });
      setStream(null);
    }
    isCapturingRef.current = false;
    setCountdown(null);
    setStabilityScore(0);
    setStage('WAITING_FOR_HAND');
  }, [stream]);

  const executeCapture = useCallback(async () => {
    if (!videoRef.current || isCapturingRef.current) return;
    isCapturingRef.current = true;
    setStage('CAPTURING');
    setStatusMessage(t.capturingPalmMsg || 'Capturing your palm...');

    // Trigger visual shutter flash
    setIsShutterFlashing(true);

    try {
      const video = videoRef.current;
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = video.videoWidth || 1280;
      snapCanvas.height = video.videoHeight || 720;
      const ctx = snapCanvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
        const rawDataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);

        // Client-side optimize/compress
        const optimizedImage = await processAndCompressImage(rawDataUrl, 1600, 0.88);

        setTimeout(() => {
          setIsShutterFlashing(false);
          onCapture(optimizedImage);
          stopCamera();
          onClose();
        }, 200);
      }
    } catch (err) {
      console.error('Auto snap execution failed:', err);
      isCapturingRef.current = false;
      setIsShutterFlashing(false);
    }
  }, [onCapture, onClose, stopCamera, t.capturingPalmMsg]);

  // Hand detection & tracking loop
  const startDetectionLoop = useCallback(async () => {
    const handLandmarker = await getHandLandmarker();

    const renderLoop = () => {
      if (!videoRef.current || !isOpen || isCapturingRef.current) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        if (canvas) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        if (handLandmarker && autoCaptureEnabled) {
          try {
            const results = handLandmarker.detectForVideo(video, performance.now());
            const landmarks = results.landmarks?.[0];

            if (landmarks && landmarks.length > 0) {
              const evaluation = evaluateHandPose(landmarks, language);
              const { isInsideFrame, isSizeAppropriate, isOpenPalm, qualityFeedback } = evaluation;

              // Draw subtle landmark guides on canvas
              if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const cw = canvas.width;
                  const ch = canvas.height;

                  // Draw landmark dots
                  ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
                  landmarks.forEach((pt) => {
                    ctx.beginPath();
                    ctx.arc(pt.x * cw, pt.y * ch, 3.5, 0, 2 * Math.PI);
                    ctx.fill();
                  });

                  // Draw connecting palm lines
                  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
                  ctx.lineWidth = 1.5;

                  const connections = [
                    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                    [0, 5], [5, 6], [6, 7], [7, 8], // Index
                    [0, 9], [9, 10], [10, 11], [11, 12], // Middle
                    [0, 13], [13, 14], [14, 15], [15, 16], // Ring
                    [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
                    [5, 9], [9, 13], [13, 17], // Palm base
                  ];

                  connections.forEach(([i, j]) => {
                    const p1 = landmarks[i];
                    const p2 = landmarks[j];
                    if (p1 && p2) {
                      ctx.beginPath();
                      ctx.moveTo(p1.x * cw, p1.y * ch);
                      ctx.lineTo(p2.x * cw, p2.y * ch);
                      ctx.stroke();
                    }
                  });
                }
              }

              // Check stability
              const wrist = landmarks[0];
              const middleMcp = landmarks[9];
              const currentCenter = {
                x: (wrist.x + middleMcp.x) / 2,
                y: (wrist.y + middleMcp.y) / 2,
              };

              let isStable = false;
              if (prevPositionRef.current) {
                const movement = Math.hypot(
                  currentCenter.x - prevPositionRef.current.x,
                  currentCenter.y - prevPositionRef.current.y
                );
                // Jitter threshold
                isStable = movement < 0.025;
              }
              prevPositionRef.current = currentCenter;

              const isAllConditionsMet = isInsideFrame && isSizeAppropriate && isOpenPalm && isStable;

              if (isAllConditionsMet) {
                const now = performance.now();
                if (!stableStartTimeRef.current) {
                  stableStartTimeRef.current = now;
                }

                const elapsedMs = now - stableStartTimeRef.current;
                const progress = Math.min(100, Math.round((elapsedMs / 1000) * 100));
                setStabilityScore(progress);

                if (elapsedMs < 350) {
                  setStage('HAND_DETECTED');
                  setStatusMessage(t.palmDetectedMsg || 'Palm detected');
                  setCountdown(null);
                } else if (elapsedMs < 750) {
                  setStage('HOLD_STEADY');
                  setStatusMessage(t.holdStillMsg || 'Hold still...');
                  setCountdown(3);
                } else if (elapsedMs < 1100) {
                  setStage('COUNTDOWN');
                  setStatusMessage(t.holdStillMsg || 'Hold still...');
                  setCountdown(2);
                } else if (elapsedMs < 1400) {
                  setStage('COUNTDOWN');
                  setStatusMessage(t.holdStillMsg || 'Hold still...');
                  setCountdown(1);
                } else {
                  // Capture trigger!
                  setCountdown(0);
                  executeCapture();
                  return;
                }
              } else {
                // Reset stability timer if hand moved out or is unstable
                stableStartTimeRef.current = null;
                setStabilityScore(0);
                setCountdown(null);

                if (!isInsideFrame || !isSizeAppropriate || !isOpenPalm) {
                  setStage('HAND_DETECTED');
                  setStatusMessage(qualityFeedback);
                } else {
                  setStage('HAND_DETECTED');
                  setStatusMessage(t.holdStillMsg || 'Hold still...');
                }
              }
            } else {
              // No hand detected
              stableStartTimeRef.current = null;
              prevPositionRef.current = null;
              setStabilityScore(0);
              setCountdown(null);
              setStage('WAITING_FOR_HAND');
              setStatusMessage(t.showPalmMsg || 'Show your palm to the camera');
            }
          } catch (detErr) {
            console.warn('Detection frame warning:', detErr);
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);
  }, [autoCaptureEnabled, executeCapture, isOpen, language, t.capturingPalmMsg, t.holdStillMsg, t.palmDetectedMsg, t.showPalmMsg]);

  const startCamera = async () => {
    setErrorMsg(null);
    setIsPermissionDenied(false);
    setIsRetrying(true);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg(t.cameraUnsupportedMsg || 'Live camera is not supported on this browser. Please upload an image directly.');
      setIsRetrying(false);
      return;
    }

    let mediaStream: MediaStream | null = null;

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch (primaryErr: any) {
      console.warn('Primary environment camera request failed, trying fallback video:', primaryErr?.message);
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (fallbackErr: any) {
        console.warn('Fallback camera request failed:', fallbackErr);

        const errorName = fallbackErr?.name || '';
        const errorMessage = String(fallbackErr?.message || '').toLowerCase();

        const isDenied =
          errorName === 'NotAllowedError' ||
          errorName === 'PermissionDeniedError' ||
          errorMessage.includes('permission') ||
          errorMessage.includes('denied') ||
          errorMessage.includes('dismissed');

        const isNotFound = errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError';
        const isBusy = errorName === 'NotReadableError' || errorName === 'TrackStartError';

        setIsPermissionDenied(isDenied);

        if (isDenied) {
          setErrorMsg(t.cameraPermissionDeniedMsg || 'Camera access was denied. You can still upload a palm photo from your gallery.');
        } else if (isNotFound) {
          setErrorMsg(
            isHindi
              ? 'इस डिवाइस पर कोई कैमरा नहीं मिला। कृपया गैलरी से फोटो अपलोड करें।'
              : 'No camera was found on this device. You can still upload a palm photo from your gallery.'
          );
        } else if (isBusy) {
          setErrorMsg(
            isHindi
              ? 'कैमरा किसी अन्य ऐप में उपयोग में है। कृपया गैलरी से फोटो चुनें।'
              : 'Camera is currently in use by another app or tab. Please upload an image or close other camera apps.'
          );
        } else {
          setErrorMsg(t.cameraUnavailableMsg || 'Could not access the camera. Please allow camera permissions or upload from your gallery.');
        }
      }
    }

    if (mediaStream) {
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      startDetectionLoop();
    }
    setIsRetrying(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleManualSnap = () => {
    executeCapture();
  };

  const handleFallbackFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimizedImage = await processAndCompressImage(file, 1600, 0.88);
      onCapture(optimizedImage);
      stopCamera();
      onClose();
    } catch (err) {
      console.error('Fallback file error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full flex flex-col relative text-white">
        {/* Hidden Fallback Input */}
        <input
          ref={fileFallbackRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          className="hidden"
          onChange={handleFallbackFile}
        />

        {/* Shutter Flash Animation Effect */}
        {isShutterFlashing && (
          <div className="absolute inset-0 z-50 bg-white animate-fadeOut pointer-events-none" />
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold font-serif text-stone-100 flex items-center gap-2">
                <span>{t.autoCaptureTitle || t.cameraModalTitle}</span>
                {autoCaptureEnabled && !errorMsg && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                    AI Auto
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Video / Error Viewport */}
        <div className="relative bg-black aspect-4/3 w-full overflow-hidden flex items-center justify-center">
          {errorMsg ? (
            <div className="p-6 text-center max-w-sm flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-stone-100 mb-2">
                {isPermissionDenied
                  ? isHindi
                    ? 'कैमरा अनुमति अस्वीकृत'
                    : 'Camera Access Denied'
                  : isHindi
                  ? 'कैमरा उपलब्ध नहीं है'
                  : 'Camera Unavailable'}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-normal">{errorMsg}</p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToFileUpload) {
                      stopCamera();
                      onSwitchToFileUpload();
                    } else {
                      fileFallbackRef.current?.click();
                    }
                  }}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-stone-950" />
                  <span>{t.uploadFromGalleryBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isRetrying}
                  className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{t.tryCameraAgainBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Main Camera Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {/* Hand Landmark Canvas Overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100 z-10"
              />

              {/* Luxury Scanning Frame */}
              <div className="absolute inset-6 sm:inset-10 pointer-events-none z-20 flex flex-col justify-between">
                {/* Top corners */}
                <div className="flex justify-between">
                  <div className="w-7 h-7 border-t-2 border-l-2 border-amber-400 rounded-tl-xl shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  <div className="w-7 h-7 border-t-2 border-r-2 border-amber-400 rounded-tr-xl shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                </div>

                {/* Center scan line animation when hand is detected */}
                {stage !== 'WAITING_FOR_HAND' && (
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                )}

                {/* Bottom corners */}
                <div className="flex justify-between">
                  <div className="w-7 h-7 border-b-2 border-l-2 border-amber-400 rounded-bl-xl shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  <div className="w-7 h-7 border-b-2 border-r-2 border-amber-400 rounded-br-xl shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                </div>
              </div>

              {/* Real-time Status Badge */}
              <div className="absolute top-4 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
                <div
                  className={`px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border shadow-lg flex items-center gap-2 transition-all duration-300 ${
                    countdown !== null
                      ? 'bg-amber-500/90 text-stone-950 border-amber-300 scale-105 font-semibold'
                      : stage === 'HOLD_STEADY'
                      ? 'bg-amber-500/80 text-stone-950 border-amber-400'
                      : stage === 'HAND_DETECTED'
                      ? 'bg-stone-900/90 text-amber-300 border-amber-500/40'
                      : 'bg-stone-900/80 text-stone-300 border-stone-700/60'
                  }`}
                >
                  {countdown !== null ? (
                    <Sparkles className="w-3.5 h-3.5 text-stone-950 animate-spin" />
                  ) : stage === 'HAND_DETECTED' || stage === 'HOLD_STEADY' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              </div>

              {/* Large Visual Countdown Overlay */}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-stone-950/20 backdrop-blur-[2px]">
                  <div className="w-20 h-20 rounded-full bg-amber-500 text-stone-950 font-serif text-4xl font-bold flex items-center justify-center shadow-2xl border-4 border-white/80 animate-ping duration-700">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Stability Progress Bar */}
              {stabilityScore > 0 && countdown === null && (
                <div className="absolute bottom-3 inset-x-8 z-30 pointer-events-none">
                  <div className="h-1.5 w-full bg-stone-900/80 rounded-full overflow-hidden border border-stone-700/40">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-150"
                      style={{ width: `${stabilityScore}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Privacy Notice Banner */}
        <div className="px-5 py-2 bg-stone-900/90 border-t border-stone-800 flex items-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="leading-tight">{t.privacyNote}</span>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-stone-950 border-t border-stone-800">
          {/* Switch to manual file upload */}
          <button
            type="button"
            onClick={() => {
              if (onSwitchToFileUpload) {
                stopCamera();
                onSwitchToFileUpload();
              } else {
                fileFallbackRef.current?.click();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-medium text-xs border border-stone-800 transition-colors cursor-pointer flex items-center gap-2"
          >
            <UploadCloud className="w-3.5 h-3.5 text-stone-400" />
            <span>{t.uploadImageInsteadBtn || 'Upload Image Instead'}</span>
          </button>

          {!errorMsg && (
            <div className="flex items-center gap-2.5 ml-auto">
              {/* Manual Snap Button */}
              <button
                type="button"
                onClick={handleManualSnap}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform hover:scale-102 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-stone-950" />
                <span>{t.manualSnapBtn || 'Snap Now'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
