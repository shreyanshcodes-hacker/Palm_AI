import React from 'react';
import { Sparkles, Languages, RotateCcw, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
  hasReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onReset,
  hasReport,
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-900 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight text-stone-900 font-serif">
              Palm<span className="text-amber-700">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200">
              Luxury Edition
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Free Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 bg-amber-50/80 px-3 py-1.5 rounded-full border border-amber-200/60 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.freeBadge}</span>
          </div>

          {/* Language Selector Pills */}
          <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-200 text-xs font-medium">
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => onLanguageChange('English')}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                language === 'English'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-hi"
              type="button"
              onClick={() => onLanguageChange('Hindi')}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                language === 'Hindi'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Reset / Start Over if report is present */}
          {hasReport && (
            <button
              id="navbar-reset-btn"
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors border border-stone-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.analyzeAgainBtn}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
