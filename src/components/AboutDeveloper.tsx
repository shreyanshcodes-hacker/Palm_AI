import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Sparkles,
  Target,
  Compass,
  Cpu,
  Github,
  Linkedin,
  Globe,
  Mail,
  CheckCircle2,
  Quote,
  Zap,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../types';

interface AboutDeveloperProps {
  language: Language;
  onNavigateHome: () => void;
}

const SKILLS = [
  'Artificial Intelligence',
  'Generative AI',
  'Google Gemini AI',
  'Computer Vision',
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Tailwind CSS',
  'Python',
  'UI/UX Design',
  'Automation',
];

const FEATURES_BUILT = [
  {
    icon: '👁️',
    title: 'AI Vision',
    desc: 'Powered by Gemini Vision models for accurate line detection.',
  },
  {
    icon: '📄',
    title: 'Luxury Reports',
    desc: 'Bespoke infographic cards with one-click PNG & PDF export.',
  },
  {
    icon: '🌐',
    title: 'Multilingual',
    desc: 'Seamless dual-language experience in English and Hindi.',
  },
  {
    icon: '🎨',
    title: 'Modern UI',
    desc: 'Apple-inspired minimalist design system with fluid motion.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Direct processing with zero permanent image storage.',
  },
  {
    icon: '⚡',
    title: 'Fast Processing',
    desc: 'Instant AI report synthesis in just seconds.',
  },
];

const TIMELINE = [
  {
    title: 'Started learning programming',
    subtitle: 'Built foundations in algorithms, software design, and web architecture.',
  },
  {
    title: 'Started AI Development',
    subtitle: 'Explored deep learning, generative models, and computer vision applications.',
  },
  {
    title: 'Created ShreyanshCodes',
    subtitle: 'Established an AI-focused product studio to build intelligent software.',
  },
  {
    title: 'Built PalmAI',
    subtitle: 'Developed the luxury AI palm reading & self-reflection platform.',
  },
  {
    title: 'Building Future AI Products',
    subtitle: 'Pioneering next-generation user experiences powered by artificial intelligence.',
  },
];

export const AboutDeveloper: React.FC<AboutDeveloperProps> = ({
  language,
  onNavigateHome,
}) => {
  useEffect(() => {
    // SEO Title & Meta update
    document.title = 'About Developer | PalmAI';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Meet Shreyansh Jaiswal, Founder of ShreyanshCodes and creator of PalmAI, an AI-powered luxury palm reading platform.'
    );

    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12 text-stone-900"
    >
      {/* HERO SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Side: Developer Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-[420px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-amber-600/30 to-amber-700/40 rounded-[28px] blur-sm opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-white p-2.5 rounded-[26px] border border-stone-200/80 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="overflow-hidden rounded-[24px]">
                  <img
                    src="/me2.png"
                    alt="Shreyansh Jaiswal - Founder of ShreyanshCodes and Creator of PalmAI"
                    loading="lazy"
                    className="w-full h-[380px] sm:h-[480px] lg:w-[420px] lg:h-[520px] object-cover object-top rounded-[24px] shadow-xs transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="absolute bottom-5 left-5 right-5 bg-stone-900/85 backdrop-blur-md text-white p-3.5 rounded-2xl border border-stone-700/60 flex items-center justify-between text-xs shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-stone-100 tracking-wide">Shreyansh Jaiswal</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    Founder
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Developer Info & Intro */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-mono text-xs font-semibold border border-amber-200/80">
                Founder of ShreyanshCodes
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200">
                ✨ AI Innovation Studio
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-mono flex items-center gap-1.5 mb-1">
                <span>👨‍💻</span> About the Developer
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-stone-900 tracking-tight">
                Shreyansh Jaiswal
              </h1>
              <p className="text-base sm:text-lg font-medium text-amber-700 mt-1">
                Founder & AI Developer
              </p>
            </div>

            {/* Introduction Paragraphs */}
            <div className="space-y-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p className="font-semibold text-stone-800">
                Hello! I'm Shreyansh Jaiswal, the founder of ShreyanshCodes and the creator of PalmAI.
              </p>
              <p>
                I'm passionate about building AI-powered products that combine modern technology with exceptional user experiences. My focus is on developing intelligent web applications, AI tools, automation systems and modern software solutions that are fast, beautiful and accessible.
              </p>
              <p>
                PalmAI was created to demonstrate how artificial intelligence and computer vision can transform a traditional palm reading experience into a modern interactive application designed for entertainment and self-reflection.
              </p>
            </div>

            {/* Call to action */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try PalmAI App</span>
              </button>

              <a
                href="#connect-section"
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm border border-stone-200 transition-colors flex items-center gap-2"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MISSION & ABOUT SHREYANSHCODES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-amber-800" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 mb-3">
              My Mission
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              To build innovative AI-powered products that make advanced technology simple, accessible and enjoyable for everyone.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-mono text-amber-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Human-Centric AI Excellence</span>
          </div>
        </div>

        {/* About ShreyanshCodes Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mb-4 shadow-md">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 mb-3">
              About ShreyanshCodes
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              ShreyanshCodes is an AI-focused development studio dedicated to creating intelligent web applications, AI automation solutions and modern digital products powered by the latest artificial intelligence technologies.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-mono text-stone-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Automation & Web Applications</span>
          </div>
        </div>
      </div>

      {/* WHY PALMAI SECTION */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono uppercase font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Philosophy & Vision</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
            Why PalmAI?
          </h2>
          <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
            PalmAI combines AI vision models, elegant design and multilingual support to create a modern palm reading experience.
          </p>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            The platform focuses on speed, accessibility, privacy and beautiful report generation while providing users with an engaging self-reflection experience.
          </p>
        </div>
      </div>

      {/* SKILLS SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Skills & Technical Stack
            </h2>
            <p className="text-xs text-stone-500">Technologies used to power ShreyanshCodes & PalmAI</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {SKILLS.map((skill, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-full bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-stone-800 hover:text-amber-900 text-xs sm:text-sm font-medium border border-stone-200/80 transition-all shadow-2xs hover:scale-102 cursor-default"
            >
              ✦ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES BUILT */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold font-serif text-stone-900">
            Features Built in PalmAI
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Engineered with a focus on modern UX, performance, and user privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES_BUILT.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h3 className="text-base font-bold font-serif text-stone-900 mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QUOTE SECTION */}
      <div className="bg-amber-50/80 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-lg text-center relative overflow-hidden">
        <Quote className="w-12 h-12 text-amber-300/80 mx-auto mb-3" />
        <p className="text-base sm:text-lg lg:text-xl font-serif font-medium text-stone-800 max-w-3xl mx-auto italic leading-relaxed">
          "Technology is most powerful when it empowers people. PalmAI is my effort to combine artificial intelligence with elegant design to create a unique experience for users around the world."
        </p>
        <span className="block mt-4 text-xs font-mono font-bold uppercase tracking-widest text-amber-900">
          — Shreyansh Jaiswal
        </span>
      </div>

      {/* TIMELINE */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Journey Timeline
            </h2>
            <p className="text-xs text-stone-500">The evolution of ShreyanshCodes & PalmAI</p>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-8 my-4">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-stone-900 border-2 border-amber-400 group-hover:scale-125 transition-transform" />
              <h3 className="text-base font-bold font-serif text-stone-900">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5 max-w-xl">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CONNECT SECTION */}
      <div id="connect-section" className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-semibold block mb-1">
            Get In Touch
          </span>
          <h2 className="text-2xl font-bold font-serif text-stone-900">
            Connect with Shreyansh Jaiswal
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Open for collaborations, AI product consulting, and software development inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* GitHub */}
          <a
            href="https://github.com/shreyanshcodes-hacker"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 flex flex-col items-center text-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:border-stone-300 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xs">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block group-hover:text-amber-800 transition-colors">
                CodeWithShreyansh
              </span>
              <span className="text-[11px] text-stone-500 font-mono">@CodeWithShreyansh</span>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/shreyansh-jaiswal-58b298417/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 flex flex-col items-center text-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:border-blue-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xs">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block group-hover:text-blue-700 transition-colors">
                LinkedIn
              </span>
              <span className="text-[11px] text-stone-500">Shreyansh Jaiswal</span>
            </div>
          </a>

          {/* Portfolio */}
          <a
            href="https://shreyanshcodes.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 flex flex-col items-center text-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:border-amber-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block group-hover:text-amber-700 transition-colors">
                Portfolio
              </span>
              <span className="text-[11px] text-stone-500 font-mono">shreyanshcodes.netlify.app</span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:ethicslearn45@gmail.com"
            className="p-5 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 flex flex-col items-center text-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:border-rose-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block group-hover:text-rose-700 transition-colors">
                Email
              </span>
              <span className="text-[11px] text-stone-500 font-mono">ethicslearn45@gmail.com</span>
            </div>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-6 border-t border-stone-200/80 text-center text-xs font-mono font-medium text-stone-500">
        Built with ❤️ by ShreyanshCodes
      </div>
    </motion.div>
  );
};
