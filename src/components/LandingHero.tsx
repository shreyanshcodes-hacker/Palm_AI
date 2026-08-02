import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Upload, ScanLine, FileText, Lock, ArrowRight, Award } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface LandingHeroProps {
  language: Language;
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ language, onStart }) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <div id="landing-hero" className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      {/* Floating background aesthetic elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-100/50 via-stone-100/40 to-amber-200/30 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-stone-200/40 blur-2xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Luxury Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-stone-100 text-xs sm:text-sm font-medium shadow-lg mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.badgeText}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-stone-300 font-serif italic">100% Free & Private</span>
        </motion.div>

        {/* Large Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-stone-900 tracking-tight leading-[1.1] mb-6"
        >
          {t.heroHeading}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
        >
          {t.heroSubtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            id="hero-upload-btn"
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-base shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
          >
            <Upload className="w-5 h-5 text-amber-400 group-hover:translate-y-[-2px] transition-transform" />
            <span>{t.startReadingBtn}</span>
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-generate-btn"
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-medium text-base border border-stone-200/80 shadow-md flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <FileText className="w-5 h-5 text-stone-600" />
            <span>{t.generateReportBtn}</span>
          </button>
        </motion.div>

        {/* Visual Feature Highlights / Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/70 shadow-lg shadow-stone-200/40 relative group hover:border-amber-300/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-900 mb-4 font-serif text-lg font-bold">
              <ScanLine className="w-6 h-6 text-amber-800" />
            </div>
            <h3 className="text-lg font-semibold font-serif text-stone-900 mb-2">
              Gemini Vision Scan
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Analyzes Life, Head, Heart, Fate & Sun lines directly from your uploaded palm photo without guesswork.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/70 shadow-lg shadow-stone-200/40 relative group hover:border-amber-300/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 mb-4 font-serif text-lg font-bold">
              <Award className="w-6 h-6 text-stone-800" />
            </div>
            <h3 className="text-lg font-semibold font-serif text-stone-900 mb-2">
              Apple-Inspired Editorial
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Generates high-end luxury infographic cards with clean white space, refined typography, and key insights.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/70 shadow-lg shadow-stone-200/40 relative group hover:border-amber-300/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-900 mb-4 font-serif text-lg font-bold">
              <Lock className="w-6 h-6 text-amber-800" />
            </div>
            <h3 className="text-lg font-semibold font-serif text-stone-900 mb-2">
              Instant PNG & PDF Export
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Download your complete reading as a crisp high-res PNG image or formatted PDF document with one click.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
