import React from 'react';

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full px-8 py-2 flex items-center gap-6 shadow-[0_1px_2px_0_rgba(5,26,36,0.1),_0_4px_4px_0_rgba(5,26,36,0.09),_0_9px_6px_0_rgba(5,26,36,0.05)] border border-slate-100">
      <span className="font-mondwest text-2xl font-semibold text-[#051A24] select-none">
        V
      </span>
      <a
        href="https://halaskastudio.com/./book"
        className="bg-[#051A24] text-white text-xs font-semibold rounded-full px-6 py-2 transition-transform duration-300 hover:scale-105 active:scale-100 btn-shadow-primary font-neue-montreal"
      >
        Start a chat
      </a>
    </div>
  );
}
