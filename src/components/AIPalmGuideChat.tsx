import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send, Bot, User, RotateCcw, AlertCircle, MessageSquare } from 'lucide-react';
import Markdown from 'react-markdown';
import { PalmReadingReport, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIPalmGuideChatProps {
  report: PalmReadingReport | null;
  language: Language;
}

const CHIPS_EN = [
  { label: '💼 Career', question: 'Based on my palm reading report, what career directions seem most aligned with my strengths?' },
  { label: '❤️ Relationships', question: 'What does my palm reading suggest about my relationship style?' },
  { label: '🧠 Personality', question: 'What are my strongest personality traits according to my palm reading?' },
  { label: '🌱 Self Growth', question: 'What areas of personal growth should I focus on?' },
  { label: '💰 Finance', question: 'What does my report suggest about my approach to financial stability?' },
  { label: '🎯 Strengths', question: 'What are my strongest qualities according to my report?' },
  { label: '✨ Future Guidance', question: 'What general areas should I focus on in the future?' },
  { label: '👨‍👩‍👧 Family', question: 'What does my palm reading suggest about my family relationships?' },
];

const CHIPS_HI = [
  { label: '💼 करियर', question: 'मेरी हस्तरेखा रिपोर्ट के अनुसार, मेरी शक्तियों के अनुरूप कौन से करियर विकल्प सबसे सही हैं?' },
  { label: '❤️ संबंध', question: 'मेरी हस्तरेखा रिपोर्ट मेरी संबंधों की शैली के बारे में क्या संकेत देती है?' },
  { label: '🧠 व्यक्तित्व', question: 'मेरी हस्तरेखा रिपोर्ट के अनुसार मेरे सबसे मजबूत व्यक्तित्व लक्षण कौन से हैं?' },
  { label: '🌱 आत्म-विकास', question: 'मुझे व्यक्तिगत विकास के किन क्षेत्रों पर ध्यान केंद्रित करना चाहिए?' },
  { label: '💰 वित्त', question: 'मेरी रिपोर्ट वित्तीय स्थिरता के प्रति मेरे दृष्टिकोण के बारे में क्या बताती है?' },
  { label: '🎯 शक्तियां', question: 'मेरी रिपोर्ट के अनुसार मेरे सबसे मजबूत गुण कौन से हैं?' },
  { label: '✨ भविष्य मार्गदर्शन', question: 'मुझे भविष्य में किन सामान्य क्षेत्रों पर ध्यान देना चाहिए?' },
  { label: '👨‍👩‍👧 परिवार', question: 'मेरी हस्तरेखा रिपोर्ट मेरे पारिवारिक संबंधों के बारे में क्या संकेत देती है?' },
];

export const AIPalmGuideChat: React.FC<AIPalmGuideChatProps> = ({ report, language }) => {
  const t = UI_TRANSLATIONS[language];
  const isHindi = language === 'Hindi';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If no report exists, show empty state notice
  if (!report) {
    return (
      <div id="ai-palm-guide-empty" className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-stone-200/80 shadow-lg text-center my-8">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold font-serif text-stone-900 mb-1">
          {t.chatTitle}
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          {t.emptyChatState}
        </p>
      </div>
    );
  }

  const chips = isHindi ? CHIPS_HI : CHIPS_EN;

  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || isLoading) return;

    setErrorMsg(null);
    setLastQuestion(question);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          report,
          language,
        }),
      });

      let data: any = null;
      try {
        const text = await res.text();
        if (text && text.trim().startsWith('{')) {
          data = JSON.parse(text);
        }
      } catch (parseErr) {
        console.warn('[Chat JSON Parse Warning]:', parseErr);
      }

      const answerText = data?.answer || data?.reply;

      if (data && data.success && answerText) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data?.error || "PalmAI couldn't answer right now. Please try again.");
      }
    } catch (err) {
      console.error('[AI Palm Guide Chat Error]:', err);
      setErrorMsg("PalmAI couldn't answer right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuestion) {
      handleSendMessage(lastQuestion);
    }
  };

  return (
    <div id="ai-palm-guide-section" className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 fill-stone-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-900 flex items-center gap-2">
              <span>{t.chatTitle}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                AI ASSISTANT
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {t.chatSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Question Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 font-mono block">
          {isHindi ? 'त्वरित प्रश्न चुनें:' : 'Quick Questions:'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              id={`quick-chip-${idx}`}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(chip.question)}
              className="px-3.5 py-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-stone-700 hover:text-amber-900 text-xs font-medium transition-all shadow-2xs hover:scale-102 cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-[#FAF9F6] rounded-2xl p-4 sm:p-6 border border-stone-200/70 min-h-[220px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-6 space-y-2 text-stone-400">
            <MessageSquare className="w-8 h-8 text-amber-500/60 mb-1" />
            <p className="text-sm font-medium text-stone-600">
              {isHindi ? 'अपनी रिपोर्ट से संबंधित कोई भी सवाल पूछें' : 'Ask any follow-up question about your palm report'}
            </p>
            <p className="text-xs max-w-xs">
              {isHindi
                ? 'करियर, प्यार, व्यक्तित्व, भाग्य या आने वाले समय के लिए मार्गदर्शन प्राप्त करें।'
                : 'Get personalized insights on career, relationships, personality, strengths, or future guidance.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-amber-500 text-stone-950'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                } max-w-[85%] sm:max-w-[80%]`}
              >
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="markdown-body space-y-3 prose prose-stone prose-xs sm:prose-sm max-w-none">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))
        )}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-xs border border-stone-200/90 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-stone-500 font-medium ml-1">
                {isHindi ? 'एआई उत्तर तैयार कर रहा है...' : 'PalmAI is thinking...'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Error Card with Retry Button */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-800"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.retryBtnText || 'Retry'}</span>
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-stone-50 p-2 pl-4 rounded-2xl border border-stone-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all shadow-xs"
      >
        <input
          id="chat-user-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatPlaceholder}
          disabled={isLoading}
          className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none"
        />

        <button
          id="chat-send-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-400 font-medium text-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
