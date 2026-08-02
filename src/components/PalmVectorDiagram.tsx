import React, { useState } from 'react';
import { Language } from '../types';

interface PalmVectorDiagramProps {
  language: Language;
  activeLineKey?: string;
  onSelectLine?: (lineKey: string) => void;
}

export const PalmVectorDiagram: React.FC<PalmVectorDiagramProps> = ({
  language,
  activeLineKey,
  onSelectLine,
}) => {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const isHindi = language === 'Hindi';

  const lineLabels: Record<string, { en: string; hi: string; color: string }> = {
    heart: { en: 'Heart Line', hi: 'हृदय रेखा', color: '#e11d48' }, // rose-600
    head: { en: 'Head Line', hi: 'मस्तिष्क रेखा', color: '#2563eb' }, // blue-600
    life: { en: 'Life Line', hi: 'जीवन रेखा', color: '#059669' }, // emerald-600
    fate: { en: 'Fate Line', hi: 'भाग्य रेखा', color: '#d97706' }, // amber-600
    sun: { en: 'Sun Line', hi: 'सूर्य रेखा', color: '#9333ea' }, // purple-600
  };

  const getLineOpacity = (key: string) => {
    const current = hoveredLine || activeLineKey;
    if (!current) return 0.85;
    return current === key ? 1 : 0.35;
  };

  const getLineWidth = (key: string) => {
    const current = hoveredLine || activeLineKey;
    return current === key ? 5 : 3;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md flex flex-col items-center justify-between h-full relative">
      <div className="text-center mb-2">
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-mono">
          {isHindi ? 'हस्तरेखा मानचित्र' : 'Palm Line Map'}
        </h4>
        <p className="text-[11px] text-stone-400 mt-0.5">
          {isHindi ? 'रेखा पर क्लिक करें' : 'Click line to highlight section'}
        </p>
      </div>

      {/* SVG Palm Vector Contour */}
      <div className="relative w-full max-w-[260px] aspect-3/4 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full filter drop-shadow-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hand Outline Contour - Elegant minimal monochrome stroke */}
          <path
            d="M 60 220 
               C 50 160, 45 120, 55 90 
               C 62 70, 78 70, 85 95 
               C 92 120, 95 150, 98 170
               C 102 120, 105 50, 118 40
               C 128 32, 142 38, 145 65
               C 148 110, 148 150, 149 170
               C 155 120, 162 45, 175 35
               C 186 28, 198 35, 200 65
               C 202 110, 198 160, 196 180
               C 205 140, 218 90, 230 85
               C 242 80, 252 92, 245 115
               C 238 140, 225 190, 222 230
               C 220 280, 210 340, 190 375
               C 170 400, 110 400, 85 365
               C 70 340, 68 280, 60 220 Z"
            fill="#FAF9F6"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Wrist bracelets (Rascette lines) */}
          <path d="M 90 375 Q 140 385 185 375" stroke="#a8a29e" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          <path d="M 95 385 Q 140 393 180 385" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

          {/* 1. HEART LINE (Pink / Rose) */}
          <path
            d="M 220 185 C 180 160, 140 155, 110 135 C 95 125, 88 115, 82 105"
            fill="none"
            stroke={lineLabels.heart.color}
            strokeWidth={getLineWidth('heart')}
            strokeLinecap="round"
            opacity={getLineOpacity('heart')}
            className="cursor-pointer transition-all duration-300 hover:stroke-width-6"
            onMouseEnter={() => setHoveredLine('heart')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectLine?.('heart')}
          />

          {/* 2. HEAD LINE (Blue) */}
          <path
            d="M 80 180 C 110 175, 150 180, 190 195 C 205 200, 215 210, 222 225"
            fill="none"
            stroke={lineLabels.head.color}
            strokeWidth={getLineWidth('head')}
            strokeLinecap="round"
            opacity={getLineOpacity('head')}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredLine('head')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectLine?.('head')}
          />

          {/* 3. LIFE LINE (Green) */}
          <path
            d="M 80 180 C 85 220, 95 280, 125 330 C 135 345, 145 355, 155 360"
            fill="none"
            stroke={lineLabels.life.color}
            strokeWidth={getLineWidth('life')}
            strokeLinecap="round"
            opacity={getLineOpacity('life')}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredLine('life')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectLine?.('life')}
          />

          {/* 4. FATE LINE (Amber) */}
          <path
            d="M 140 350 C 145 280, 150 210, 150 130"
            fill="none"
            stroke={lineLabels.fate.color}
            strokeWidth={getLineWidth('fate')}
            strokeLinecap="round"
            strokeDasharray="2 2"
            opacity={getLineOpacity('fate')}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredLine('fate')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectLine?.('fate')}
          />

          {/* 5. SUN LINE (Purple) */}
          <path
            d="M 185 260 C 187 210, 188 170, 188 125"
            fill="none"
            stroke={lineLabels.sun.color}
            strokeWidth={getLineWidth('sun')}
            strokeLinecap="round"
            strokeDasharray="2 2"
            opacity={getLineOpacity('sun')}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredLine('sun')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectLine?.('sun')}
          />
        </svg>
      </div>

      {/* Interactive Legend Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
        {Object.entries(lineLabels).map(([key, info]) => {
          const isSelected = (hoveredLine || activeLineKey) === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectLine?.(key)}
              onMouseEnter={() => setHoveredLine(key)}
              onMouseLeave={() => setHoveredLine(null)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 scale-105 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <span>{isHindi ? info.hi : info.en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
