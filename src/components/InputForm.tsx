import React, { useState } from 'react';
import { UserInfo, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';
import { User, Calendar, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InputFormProps {
  userInfo: UserInfo;
  onChange: (info: UserInfo) => void;
  onNext: () => void;
  language: Language;
}

export const InputForm: React.FC<InputFormProps> = ({
  userInfo,
  onChange,
  onNext,
  language,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const validate = () => {
    const errs: { name?: string; age?: string } = {};

    if (!userInfo.name.trim()) {
      errs.name = t.nameRequired;
    }

    if (userInfo.age === '' || isNaN(Number(userInfo.age))) {
      errs.age = t.ageRequired;
    } else {
      const numAge = Number(userInfo.age);
      if (numAge < 10 || numAge > 100) {
        errs.age = t.ageRequired;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto px-4 py-8"
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-2xl shadow-stone-200/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 mb-3 shadow-xs font-serif text-xl">
            ✍️
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {t.stepDetailsHeading}
          </h2>
          <p className="text-sm text-stone-500 mt-1">{t.stepDetailsSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-500" />
              <span>{t.nameLabel}</span>
            </label>
            <input
              id="input-name"
              type="text"
              value={userInfo.name}
              onChange={(e) => {
                onChange({ ...userInfo, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder={t.namePlaceholder}
              className={`w-full px-4 py-3.5 rounded-xl border bg-stone-50/50 text-stone-900 text-base focus:outline-hidden transition-all duration-200 ${
                errors.name
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-stone-200 focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10'
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>{t.ageLabel}</span>
            </label>
            <input
              id="input-age"
              type="number"
              min="10"
              max="100"
              value={userInfo.age}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                onChange({ ...userInfo, age: val });
                if (errors.age) setErrors({ ...errors, age: undefined });
              }}
              placeholder={t.agePlaceholder}
              className={`w-full px-4 py-3.5 rounded-xl border bg-stone-50/50 text-stone-900 text-base focus:outline-hidden transition-all duration-200 ${
                errors.age
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-stone-200 focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10'
              }`}
            />
            {errors.age && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.age}</span>
              </p>
            )}
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-stone-500" />
              <span>{t.langLabel}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="lang-option-en"
                type="button"
                onClick={() => onChange({ ...userInfo, language: 'English' })}
                className={`py-3.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  userInfo.language === 'English'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>English</span>
              </button>
              <button
                id="lang-option-hi"
                type="button"
                onClick={() => onChange({ ...userInfo, language: 'Hindi' })}
                className={`py-3.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  userInfo.language === 'Hindi'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            id="input-continue-btn"
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-base shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>{t.continueBtn}</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
