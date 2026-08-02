import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div
      id="top-announcement-bar"
      className="w-full bg-stone-100/90 border-b border-stone-200/70 py-2 px-4 text-center text-xs font-medium text-[#6B7280] flex items-center justify-center gap-2 select-none tracking-wide"
    >
      <span>100% Free</span>
      <span className="text-[#6B7280]/60">•</span>
      <span>Powered by ShreyanshCodes</span>
    </div>
  );
};
