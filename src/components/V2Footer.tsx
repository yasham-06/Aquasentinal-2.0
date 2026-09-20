import React from 'react';

export const V2Footer: React.FC = () => {
  return (
    <footer className="h-9 bg-[#061421] border-t border-[#163B55] px-6 flex items-center justify-between text-[11px] text-[#64748B] font-sans">
      <div>
        <span className="font-semibold text-[#94A3B8]">AquaSentinel 2.0</span>
        <span className="mx-2">|</span>
        <span>Demo Campus</span>
      </div>
      <div>
        <span className="font-semibold text-[#94A3B8]">HACKDAY 1.0</span>
        <span className="mx-2">|</span>
        <span>Detect Today. Predict Tomorrow.</span>
      </div>
    </footer>
  );
};
