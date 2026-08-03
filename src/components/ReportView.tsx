import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  FileText,
  RotateCcw,
  Share2,
  Heart,
  Brain,
  Activity,
  Compass,
  Sun,
  Globe2,
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { PalmReadingReport, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';
import { PalmVectorDiagram } from './PalmVectorDiagram';
import { ReportCard } from './ReportCard';
import { ShareModal } from './ShareModal';
import { AIPalmGuideChat } from './AIPalmGuideChat';
import { downloadElementAsPng, downloadElementAsPdf } from '../utils/exportUtils';

interface ReportViewProps {
  report: PalmReadingReport;
  imagePreview: string | null;
  language: Language;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  imagePreview,
  language,
  onReset,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [activeLineKey, setActiveLineKey] = useState<string | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isHindi = language === 'Hindi';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      await downloadElementAsPng('report-container', `PalmAI-${report.name || 'Reading'}.png`);
      showToast('PNG Downloaded successfully!');
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await downloadElementAsPdf('report-container', `PalmAI-${report.name || 'Reading'}.pdf`);
      showToast('PDF Downloaded successfully!');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-medium border border-stone-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-stone-200/80 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            {t.reportTitle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="download-png-btn"
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPng}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.downloadPngBtn}</span>
          </button>

          <button
            id="download-pdf-btn"
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs flex items-center gap-2 shadow-xs transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-stone-950" />
            <span>{t.downloadPdfBtn}</span>
          </button>

          <button
            id="share-report-btn"
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs flex items-center gap-1.5 border border-stone-200 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-600" />
            <span>{t.shareBtn}</span>
          </button>

          <button
            id="report-analyze-again-btn"
            type="button"
            onClick={onReset}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs flex items-center gap-1.5 border border-stone-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.analyzeAgainBtn}</span>
          </button>
        </div>
      </div>

      {/* Capture Area for Export */}
      <div
        id="report-container"
        className="bg-[#FAF9F6] p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-2xl space-y-8 text-stone-900"
      >
        {/* Luxury Infographic Header Banner */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                Palm<span className="text-amber-700">AI</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-medium">
                Official Report
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-800">
              {report.name ? `${report.name}'s ${t.reportTitle}` : t.reportTitle}
            </h1>
          </div>

          <div className="text-left sm:text-right text-xs text-stone-500 font-mono">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p className="text-amber-800 font-medium">Language: {report.language}</p>
          </div>
        </div>

        {/* TOP SECTION: Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left Column: Palm Reading Guide / Client Profile */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-mono">
                  {t.clientProfile}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-stone-400 block">{t.nameLabel}</span>
                  <span className="text-lg font-bold font-serif text-stone-900">
                    {report.name || 'Guest User'}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-xs text-stone-400 block">{t.ageLabel}</span>
                    <span className="text-base font-semibold text-stone-800">
                      {report.age} {isHindi ? 'वर्ष' : 'years'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block">{t.langLabel}</span>
                    <span className="text-base font-semibold text-stone-800">
                      {report.language}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-400 block mb-1">{t.handTypeLabel}</span>
                  <span className="text-sm font-bold font-serif text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                    {report.handType || 'Fire Hand Archetype'}
                  </span>
                  {report.handTypeDescription && (
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {report.handTypeDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 bg-stone-50 p-3 rounded-2xl text-[11px] text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isHindi ? '100% सटीक एआई विज़न विश्लेषण' : 'Gemini Vision AI Authenticated'}</span>
            </div>
          </div>

          {/* Middle Column: Uploaded Palm Image */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="absolute top-4 left-4 z-10 text-[10px] font-mono font-semibold uppercase tracking-wider bg-stone-900/80 text-white px-3 py-1 rounded-full backdrop-blur-md">
              {t.uploadedPhotoLabel}
            </span>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded Palm"
                className="w-full max-h-[320px] object-cover rounded-2xl border border-stone-200 shadow-sm"
              />
            ) : (
              <div className="w-full aspect-3/4 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 text-xs">
                No Image
              </div>
            )}
          </div>

          {/* Right Column: Black & White Vector Illustration with Interactive Line Selector */}
          <PalmVectorDiagram
            language={language}
            activeLineKey={activeLineKey}
            onSelectLine={(key) => {
              setActiveLineKey(key);
              const target = document.getElementById(`card-${key}`);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          />
        </div>

        {/* SECTION CARDS GRID */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold font-serif text-stone-900 border-b border-stone-200 pb-2">
            {isHindi ? 'मुख्य हस्तरेखा कार्ड्स' : 'Detailed Palm Line Analyses'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Life Line */}
            <ReportCard
              id="card-life"
              analysis={report.lifeLine}
              icon={<Activity className="w-5 h-5 text-emerald-600" />}
              accentColor="bg-emerald-50 text-emerald-900"
              isActive={activeLineKey === 'life'}
              onClick={() => setActiveLineKey('life')}
            />

            {/* Head Line */}
            <ReportCard
              id="card-head"
              analysis={report.headLine}
              icon={<Brain className="w-5 h-5 text-blue-600" />}
              accentColor="bg-blue-50 text-blue-900"
              isActive={activeLineKey === 'head'}
              onClick={() => setActiveLineKey('head')}
            />

            {/* Heart Line */}
            <ReportCard
              id="card-heart"
              analysis={report.heartLine}
              icon={<Heart className="w-5 h-5 text-rose-600" />}
              accentColor="bg-rose-50 text-rose-900"
              isActive={activeLineKey === 'heart'}
              onClick={() => setActiveLineKey('heart')}
            />

            {/* Fate Line */}
            <ReportCard
              id="card-fate"
              analysis={report.fateLine}
              icon={<Compass className="w-5 h-5 text-amber-600" />}
              accentColor="bg-amber-50 text-amber-900"
              isActive={activeLineKey === 'fate'}
              onClick={() => setActiveLineKey('fate')}
            />

            {/* Sun Line */}
            <ReportCard
              id="card-sun"
              analysis={report.sunLine}
              icon={<Sun className="w-5 h-5 text-purple-600" />}
              accentColor="bg-purple-50 text-purple-900"
              isActive={activeLineKey === 'sun'}
              onClick={() => setActiveLineKey('sun')}
            />

            {/* Mount Analysis */}
            <ReportCard
              id="card-mounts"
              analysis={report.mountAnalysis}
              icon={<Globe2 className="w-5 h-5 text-teal-600" />}
              accentColor="bg-teal-50 text-teal-900"
            />

            {/* Career & Prosperity */}
            <ReportCard
              id="card-career"
              analysis={report.career}
              icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
              accentColor="bg-indigo-50 text-indigo-900"
            />

            {/* Relationships & Harmony */}
            <ReportCard
              id="card-relationships"
              analysis={report.relationships}
              icon={<Users className="w-5 h-5 text-pink-600" />}
              accentColor="bg-pink-50 text-pink-900"
            />
          </div>
        </div>

        {/* STRENGTHS & CHALLENGES ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Strengths Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900">
                {t.strengthsTitle}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.strengths && report.strengths.length > 0 ? (
                report.strengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-200/70"
                  >
                    ✦ {str}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-400">Natural adaptability, keen focus, leadership</span>
              )}
            </div>
          </div>

          {/* Challenges / Growth Areas Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900">
                {t.challengesTitle}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.challenges && report.challenges.length > 0 ? (
                report.challenges.map((ch, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-950 text-xs font-medium border border-amber-200/70"
                  >
                    ⚠️ {ch}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-400">Patience, work-rest balance</span>
              )}
            </div>
          </div>
        </div>

        {/* FUTURE GUIDANCE CARD (Gold Editorial Highlight) */}
        {report.futureGuidance && (
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold font-serif text-amber-300">
                {t.futureGuidanceTitle}
              </h3>
            </div>
            <p className="text-sm text-stone-200 leading-relaxed italic">
              "{report.futureGuidance}"
            </p>
          </div>
        )}

        {/* SUMMARY CARD */}
        {report.summary && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg">
            <h3 className="text-lg font-bold font-serif text-stone-900 mb-3">
              {t.summaryTitle}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              {report.summary}
            </p>
          </div>
        )}

        {/* LEGAL DISCLAIMER */}
        <div className="pt-6 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-400 max-w-2xl mx-auto leading-relaxed italic">
            <strong>{t.disclaimerTitle}:</strong> {report.disclaimer || t.disclaimerText}
          </p>
        </div>
      </div>

      {/* AI Palm Guide Follow-up Chat */}
      <AIPalmGuideChat report={report} language={language} />

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        report={report}
        language={language}
        onToast={showToast}
      />
    </motion.div>
  );
};
