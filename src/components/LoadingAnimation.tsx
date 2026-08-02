import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Scan, Check } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface LoadingAnimationProps {
  imagePreview: string | null;
  language: Language;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ imagePreview, language }) => {
  const t = UI_TRANSLATIONS[language];
  const [currentStep, setCurrentStep] = useState(1);

  const isHindi = language === 'Hindi';

  const steps = [
    { num: 1, label: isHindi ? t.step1 : "Detecting Palm..." },
    { num: 2, label: isHindi ? t.step2 : "Finding Main Lines..." },
    { num: 3, label: isHindi ? t.step3 : "Analyzing Palm Shape..." },
    { num: 4, label: isHindi ? t.step4 : "Studying Finger Structure..." },
    { num: 5, label: isHindi ? t.step5 : "Preparing Reading..." },
    { num: 6, label: isHindi ? t.step6 : "Designing Premium Report..." },
  ];

  useEffect(() => {
    // Advance steps every 1.8 seconds up to 6
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 6 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round((currentStep / 6) * 100);

  return (
    <div id="loading-screen" className="max-w-xl mx-auto px-4 py-12 text-center">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-2xl shadow-stone-200/50 relative overflow-hidden">
        {/* Glowing Palm Image Frame with Scanning Laser */}
        {imagePreview && (
          <div className="relative w-48 h-64 mx-auto mb-8 rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xl bg-stone-900">
            <img
              src={imagePreview}
              alt="Scanning Palm"
              className="w-full h-full object-cover opacity-90 filter contrast-105"
            />
            {/* Animated Laser Scanning Beam */}
            <motion.div
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] z-10"
            />
            {/* Overlay grid mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          </div>
        )}

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold mb-4">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <span>{steps[currentStep - 1].label}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mb-2">
          {t.loadingSubtitle}
        </h3>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 rounded-full h-3 mb-6 p-0.5 border border-stone-200 overflow-hidden">
          <motion.div
            initial={{ width: '15%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-stone-900 via-amber-800 to-amber-600 rounded-full"
          />
        </div>

        {/* Steps Tracker */}
        <div className="space-y-2 text-left max-w-sm mx-auto mb-6">
          {steps.map((s) => {
            const isDone = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <div
                key={s.num}
                className={`flex items-center gap-3 text-xs p-2 rounded-xl transition-colors ${
                  isCurrent
                    ? 'bg-amber-50 text-amber-950 font-semibold border border-amber-200/80'
                    : isDone
                    ? 'text-stone-400 font-medium'
                    : 'text-stone-300 font-normal'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-stone-900 text-amber-400 animate-pulse'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-stone-400 font-mono">{t.estTime}</p>
      </div>
    </div>
  );
};
