import React from 'react';
import { Sparkles, RotateCcw, ShieldCheck, User } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
  hasReport: boolean;
  currentView: 'app' | 'about';
  onNavigate: (view: 'app' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onReset,
  hasReport,
  currentView,
  onNavigate,
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => {
              if (currentView === 'about') {
                onNavigate('app');
              } else {
                onReset();
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-900 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight text-stone-900 font-serif">
                Palm<span className="text-amber-700">AI</span>
              </span>
              <span className="hidden lg:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200">
                Luxury Edition
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-stone-100/80 p-1 rounded-full border border-stone-200/80 text-xs font-medium">
            <button
              id="nav-btn-home"
              type="button"
              onClick={() => onNavigate('app')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentView === 'app'
                  ? 'bg-stone-900 text-amber-300 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {t.navHome || 'Home'}
            </button>
            <button
              id="nav-btn-about"
              type="button"
              onClick={() => onNavigate('about')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                currentView === 'about'
                  ? 'bg-stone-900 text-amber-300 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.navAbout || 'About Developer'}</span>
            </button>
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile About Button */}
          <button
            id="mobile-nav-btn-about"
            type="button"
            onClick={() => onNavigate(currentView === 'about' ? 'app' : 'about')}
            className="sm:hidden flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800"
          >
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentView === 'about' ? (t.navHome || 'Home') : 'About'}</span>
          </button>

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
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
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
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                language === 'Hindi'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Reset / Start Over if report is present & in app view */}
          {hasReport && currentView === 'app' && (
            <button
              id="navbar-reset-btn"
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors border border-stone-200 cursor-pointer"
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
