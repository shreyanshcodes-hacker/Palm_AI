import React, { useState } from 'react';
import { UserInfo, PalmReadingReport, Language } from './types';
import { getFallbackReading } from './utils/fallbackReading';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { InputForm } from './components/InputForm';
import { UploadSection } from './components/UploadSection';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ReportView } from './components/ReportView';

type AppStep = 'landing' | 'form' | 'upload' | 'loading' | 'report';

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    language: 'English',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [report, setReport] = useState<PalmReadingReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLanguageChange = (lang: Language) => {
    setUserInfo((prev) => ({ ...prev, language: lang }));
    // If report is already generated, update fallback translation if needed
    if (report) {
      setReport((prev) => {
        if (!prev) return null;
        return getFallbackReading(prev.name, prev.age, lang);
      });
    }
  };

  const handleReset = () => {
    setStep('landing');
    setUserInfo({ name: '', age: '', language: userInfo.language });
    setImagePreview(null);
    setReport(null);
    setErrorMsg(null);
  };

  const handleStartAnalysis = async () => {
    setStep('loading');
    setErrorMsg(null);

    try {
      if (!imagePreview) {
        throw new Error('No palm image selected');
      }

      // Call Express server endpoint
      const res = await fetch('/api/analyze-palm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: 'image/jpeg',
          name: userInfo.name,
          age: Number(userInfo.age) || 25,
          language: userInfo.language,
        }),
      });

      const result = await res.json();

      if (res.ok && result.data) {
        setReport(result.data);
      } else {
        // Fallback engine
        console.log('Using fallback reading engine:', result.message || res.statusText);
        const fallback = getFallbackReading(userInfo.name, Number(userInfo.age) || 25, userInfo.language);
        setReport(fallback);
      }
    } catch (err: any) {
      console.warn('Backend API request error, utilizing intelligent fallback engine:', err);
      const fallback = getFallbackReading(userInfo.name, Number(userInfo.age) || 25, userInfo.language);
      setReport(fallback);
    } finally {
      // Small buffer to allow smooth transition after step 6 animation
      setTimeout(() => {
        setStep('report');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-amber-200 flex flex-col justify-between antialiased">
      <div>
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Navigation Bar */}
        <Navbar
          language={userInfo.language}
          onLanguageChange={handleLanguageChange}
          onReset={handleReset}
          hasReport={!!report && step === 'report'}
        />

        {/* Main Content Area */}
        <main className="pb-16">
          {step === 'landing' && (
            <LandingHero
              language={userInfo.language}
              onStart={() => setStep('form')}
            />
          )}

          {step === 'form' && (
            <InputForm
              userInfo={userInfo}
              onChange={setUserInfo}
              onNext={() => setStep('upload')}
              language={userInfo.language}
            />
          )}

          {step === 'upload' && (
            <UploadSection
              imagePreview={imagePreview}
              onImageSelected={setImagePreview}
              onAnalyze={handleStartAnalysis}
              onBack={() => setStep('form')}
              language={userInfo.language}
            />
          )}

          {step === 'loading' && (
            <LoadingAnimation
              imagePreview={imagePreview}
              language={userInfo.language}
            />
          )}

          {step === 'report' && report && (
            <ReportView
              report={report}
              imagePreview={imagePreview}
              language={userInfo.language}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif font-semibold text-stone-800">
            Palm<span className="text-amber-700">AI</span> — Luxury AI Palmistry Engine
          </p>
          <p className="text-[#6B7280] font-medium">
            100% Free • Powered by ShreyanshCodes
          </p>
        </div>
      </footer>
    </div>
  );
}
