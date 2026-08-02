import React from 'react';
import { SectionAnalysis } from '../types';
import { Sparkles } from 'lucide-react';

interface ReportCardProps {
  id?: string;
  analysis: SectionAnalysis;
  icon: React.ReactNode;
  accentColor?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  id,
  analysis,
  icon,
  accentColor = 'bg-stone-100 text-stone-900',
  isActive = false,
  onClick,
}) => {
  if (!analysis) return null;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden ${
        isActive
          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-900/5'
          : 'border-stone-200/80 hover:border-stone-300 shadow-lg shadow-stone-200/40 hover:shadow-xl'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs font-serif ${accentColor}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 tracking-tight">
            {analysis.title}
          </h3>
        </div>
      </div>

      {/* Main Overview Description */}
      {analysis.description && (
        <p className="text-sm text-stone-600 leading-relaxed mb-5 font-normal">
          {analysis.description}
        </p>
      )}

      {/* Bullet Points */}
      {analysis.points && analysis.points.length > 0 && (
        <ul className="space-y-2.5 mb-5 text-xs sm:text-sm text-stone-700">
          {analysis.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Short Key Insight Box */}
      {analysis.insight && (
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-2.5 bg-stone-50/70 -mx-6 -mb-6 p-4 px-6 sm:px-8">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-stone-800 italic leading-relaxed">
            "{analysis.insight}"
          </p>
        </div>
      )}
    </div>
  );
};
