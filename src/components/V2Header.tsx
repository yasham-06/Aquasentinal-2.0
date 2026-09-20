import React from 'react';
import { ChevronDown, Droplets } from 'lucide-react';
import { SimulationMode } from '../types';

interface V2HeaderProps {
  simulationMode: SimulationMode;
}

export const V2Header: React.FC<V2HeaderProps> = ({
  simulationMode,
}) => {
  return (
    <header className="h-14 bg-[#061421] border-b border-[#163B55] px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
      
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 font-display text-lg font-bold tracking-tight">
          <span className="text-[#22D3EE]">Aqua</span>
          <span className="text-[#F8FAFC]">Sentinel</span>
          <span className="text-[#22D3EE]">2.0</span>
        </div>

        <span className="text-[#163B55] text-sm">————</span>

        <span className="text-xs text-[#94A3B8] font-sans hidden md:inline-block">
          AI-Powered Water Network Intelligence
        </span>
      </div>

      {/* Right Controls / Campus Selector & Product Icon */}
      <div className="flex items-center space-x-4">
        
        {/* Live Status Badge */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B2134] border border-[#163B55] text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${simulationMode === 'NORMAL' ? 'bg-[#22C55E]' : 'bg-[#EF4444] animate-ping'}`} />
          <span className={`text-[11px] font-semibold ${simulationMode === 'NORMAL' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {simulationMode === 'NORMAL' ? '● Live' : '● Leak Active'}
          </span>
        </div>

        {/* Campus Selector Dropdown */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#0B2134] border border-[#163B55] text-xs text-[#F8FAFC] cursor-pointer hover:bg-[#0F2940] transition-colors">
          <span>Demo Campus</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
        </div>

        {/* Product Water Drop Icon */}
        <div className="w-8 h-8 rounded-full bg-[#0F2940] text-[#22D3EE] flex items-center justify-center shadow-md border border-[#163B55]">
          <Droplets className="w-4 h-4 text-[#22D3EE]" />
        </div>

      </div>

    </header>
  );
};
