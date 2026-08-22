import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInfo, PalmReadingReport, Language } from './types';
import { getFallbackReading } from './utils/fallbackReading';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { InputForm } from './components/InputForm';
import { UploadSection } from './components/UploadSection';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ReportView } from './components/ReportView';
import { AboutDeveloper } from './components/AboutDeveloper';

type AppStep = 'landing' | 'form' | 'upload' | 'loading' | 'report';
type ViewPage = 'app' | 'about';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewPage>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/about') {
      return 'about';
    }
    return 'app';
  });

  const [step, setStep] = useState<AppStep>('landing');

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    language: 'English',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('palmai_image_preview');
      } catch {
        return null;
      }
    }
    return null;
  });

  const [report, setReport] = useState<PalmReadingReport | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('palmai_saved_report');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep sessionStorage in sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (report) {
          sessionStorage.setItem('palmai_saved_report', JSON.stringify(report));
        } else {
          sessionStorage.removeItem('palmai_saved_report');
        }
      } catch (e) {
        console.warn('SessionStorage sync notice:', e);
      }
    }
  }, [report]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (imagePreview) {
          sessionStorage.setItem('palmai_image_preview', imagePreview);
        } else {
          sessionStorage.removeItem('palmai_image_preview');
        }
      } catch (e) {
        console.warn('SessionStorage sync notice:', e);
      }
    }
  }, [imagePreview]);

  // Sync browser URL with routing
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/about') {
        setCurrentView('about');
      } else {
        setCurrentView('app');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (view: ViewPage) => {
    setCurrentView(view);
    if (view === 'about') {
      window.history.pushState(null, '', '/about');
    } else {
      window.history.pushState(null, '', '/');
      document.title = 'PalmAI — Luxury AI Palmistry Engine';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setCurrentView('app');
    window.history.pushState(null, '', '/');
    document.title = 'PalmAI — Luxury AI Palmistry Engine';
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

      let result: any = null;
      try {
        const text = await res.text();
        if (text && text.trim().startsWith('{')) {
          result = JSON.parse(text);
        }
      } catch (parseErr) {
        console.warn('Analysis JSON parse warning:', parseErr);
      }

      if (res.ok && result?.data) {
        setReport(result.data);
      } else {
        // Fallback engine
        console.log('Using fallback reading engine:', result?.message || res.statusText);
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
          currentView={currentView}
          onNavigate={handleNavigate}
        />

        {/* Main Content Area */}
        <main className="pb-16 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'about' ? (
              <motion.div
                key="about-page"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <AboutDeveloper
                  language={userInfo.language}
                  onNavigateHome={() => handleNavigate('app')}
                />
              </motion.div>
            ) : (
              <React.Fragment key="app-flow">
                {step === 'landing' && (
                  <motion.div
                    key="landing"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <LandingHero
                      language={userInfo.language}
                      onStart={() => setStep('form')}
                    />
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <InputForm
                      userInfo={userInfo}
                      onChange={setUserInfo}
                      onNext={() => setStep('upload')}
                      language={userInfo.language}
                    />
                  </motion.div>
                )}

                {step === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <UploadSection
                      imagePreview={imagePreview}
                      onImageSelected={setImagePreview}
                      onAnalyze={handleStartAnalysis}
                      onBack={() => setStep('form')}
                      language={userInfo.language}
                    />
                  </motion.div>
                )}

                {step === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <LoadingAnimation
                      imagePreview={imagePreview}
                      language={userInfo.language}
                    />
                  </motion.div>
                )}

                {step === 'report' && report && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <ReportView
                      report={report}
                      imagePreview={imagePreview}
                      language={userInfo.language}
                      onReset={handleReset}
                    />
                  </motion.div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif font-semibold text-stone-800">
            Palm<span className="text-amber-700">AI</span> — Luxury AI Palmistry Engine
          </p>
          <div className="flex items-center gap-4 text-[#6B7280] font-medium">
            <button
              type="button"
              onClick={() => handleNavigate('about')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              About Developer
            </button>
            <span>•</span>
            <p>Built with ❤️ by ShreyanshCodes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
