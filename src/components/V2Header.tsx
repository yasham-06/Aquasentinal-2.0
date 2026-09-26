import React from 'react';
import { ChevronDown, Droplets, Bell, Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SimulationMode } from '../types';

interface V2HeaderProps {
  simulationMode: SimulationMode;
}

export const V2Header: React.FC<V2HeaderProps> = ({
  simulationMode,
}) => {
  return (
    <header className="h-16 bg-[#06101E] border-b border-[#183C5A]/60 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
      
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 font-display text-lg font-extrabold tracking-tight">
          <span className="text-[#22D3EE]">Aqua</span>
          <span className="text-[#F8FAFC]">Sentinel</span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#15334E] text-[#22D3EE] rounded-lg border border-[#183C5A]">
            2.0
          </span>
        </div>

        <span className="text-[#183C5A] text-sm">/</span>

        <span className="text-xs text-[#94A3B8] font-sans hidden md:inline-block">
          AI-Powered Water Network Operations
        </span>
      </div>

      {/* Right Action Pills (matching reference top-right controls) */}
      <div className="flex items-center space-x-3">
        
        {/* Live System Status Pill */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#0B1A28] border border-[#183C5A] text-xs font-mono">
          {simulationMode === 'NORMAL' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-[#22C55E] font-bold text-[11px]">System Normal</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] animate-bounce" />
              <span className="text-[#EF4444] font-bold text-[11px]">Leak Active</span>
            </>
          )}
        </div>

        {/* Campus Selector Dropdown */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#0B1A28] border border-[#183C5A] text-xs text-[#F8FAFC] cursor-pointer hover:bg-[#0D2032] transition-colors">
          <span className="font-medium text-xs">Demo Campus</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
        </div>

        {/* Quick Search Action */}
        <button className="w-9 h-9 rounded-xl bg-[#0B1A28] border border-[#183C5A] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell with Badge */}
        <button className="w-9 h-9 rounded-xl bg-[#0B1A28] border border-[#183C5A] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center relative transition-colors">
          <Bell className="w-4 h-4" />
          {simulationMode !== 'NORMAL' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          )}
        </button>

        {/* User / Product Icon Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#22D3EE] text-[#06101E] flex items-center justify-center font-bold shadow-md shadow-[#22D3EE]/20">
          <Droplets className="w-4.5 h-4.5 text-[#06101E]" />
        </div>

      </div>

    </header>
  );
};
