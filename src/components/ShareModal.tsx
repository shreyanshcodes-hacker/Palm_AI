import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Send, Facebook, Twitter, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { Language, PalmReadingReport } from '../types';
import { UI_TRANSLATIONS } from '../constants/languages';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: PalmReadingReport;
  language: Language;
  onToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  report,
  language,
  onToast,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareTitle = `PalmAI Reading for ${report.name || 'User'}`;
  const shareText = `✨ Explore my luxury AI Palm Reading report on PalmAI!`;
  const shareUrl = window.location.href;

  const handleNativeShare = async () => {
    setIsSharingImage(true);
    try {
      const reportEl = document.getElementById('report-container');
      let imageFile: File | null = null;

      if (reportEl && typeof toBlob === 'function') {
        try {
          const blob = await toBlob(reportEl, {
            quality: 0.9,
            pixelRatio: 1.5,
            backgroundColor: '#FAF9F6',
          });
          if (blob) {
            imageFile = new File([blob], `PalmAI-${report.name || 'Reading'}.png`, { type: 'image/png' });
          }
        } catch (err) {
          console.warn('Could not generate snapshot blob for share:', err);
        }
      }

      if (navigator.share) {
        const shareData: ShareData = {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        };

        if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
          shareData.files = [imageFile];
        }

        await navigator.share(shareData);
        onToast('Shared successfully!');
        onClose();
      } else {
        // Fallback to copy link
        await handleCopyLink();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Web Share failed:', err);
        handleCopyLink();
      }
    } finally {
      setIsSharingImage(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onToast(t.copiedToast);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const isWebShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-stone-200 shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900">
                {t.shareModalTitle}
              </h3>
              <p className="text-xs text-stone-500">{t.shareModalSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Primary Web Share API Action */}
          {isWebShareSupported && (
            <button
              id="share-native-api-btn"
              type="button"
              disabled={isSharingImage}
              onClick={handleNativeShare}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white font-medium text-sm shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{isSharingImage ? 'Preparing Share...' : t.shareNativeBtn}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          )}

          {/* Copy Link Section */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Direct Link
            </label>
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 pl-3 rounded-2xl border border-stone-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-stone-700 flex-1 outline-none truncate font-mono"
              />
              <button
                id="share-copy-link-btn"
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Social Shares */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Social Media
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                id="share-whatsapp-btn"
                type="button"
                onClick={shareToWhatsApp}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/60 flex items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              {/* X / Twitter */}
              <button
                id="share-x-btn"
                type="button"
                onClick={shareToX}
                className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 flex items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <Twitter className="w-4 h-4 text-stone-800" />
                <span>X (Twitter)</span>
              </button>

              {/* Facebook */}
              <button
                id="share-facebook-btn"
                type="button"
                onClick={shareToFacebook}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 text-blue-900 border border-blue-200/60 flex items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </button>

              {/* Telegram */}
              <button
                id="share-telegram-btn"
                type="button"
                onClick={shareToTelegram}
                className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100/80 text-sky-900 border border-sky-200/60 flex items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 text-center text-[11px] text-stone-400">
          PalmAI • Luxury AI Palm Reading Engine
        </div>
      </div>
    </div>
  );
};
