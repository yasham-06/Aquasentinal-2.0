import React from 'react';
import { SimulationMode } from '../types';
import { RotateCcw, AlertTriangle, ShieldCheck, Droplet, Flame, Terminal } from 'lucide-react';

interface DemoControlBarProps {
  simulationMode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
  onReset: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  simulationMode,
  onModeChange,
  onReset,
}) => {
  return (
    <div className="bg-[#0B1A28] border-b border-[#183C5A] px-6 py-2.5 text-[#94A3B8] shadow-md">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Simulation Environment Label */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
          <Terminal className="w-4 h-4 text-[#22D3EE]" />
          <span className="font-semibold text-[#F8FAFC]">Simulation Console</span>
          <span className="text-[#183C5A]">|</span>
          <span className="text-[#94A3B8]">Mode:</span>
          <span className="px-2 py-0.5 rounded-lg bg-[#040D17] border border-[#183C5A] text-[#22D3EE] font-bold text-[11px]">
            {simulationMode}
          </span>
          <span className="hidden lg:inline text-[10px] text-[#64748B] ml-2">
            (DEMO MODE — SIMULATED SENSOR DATA)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => onModeChange('NORMAL')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
              simulationMode === 'NORMAL'
                ? 'bg-[#22C55E] text-[#06101E] shadow-md shadow-[#22C55E]/20'
                : 'bg-[#0D2032] text-[#F8FAFC] hover:bg-[#15334E] border border-[#183C5A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NORMAL</span>
          </button>

          <button
            onClick={() => onModeChange('LEAK')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
              simulationMode === 'LEAK'
                ? 'bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/30 animate-pulse'
                : 'bg-[#0D2032] text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE LEAK</span>
          </button>

          <button
            onClick={() => onModeChange('OVERFLOW')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
              simulationMode === 'OVERFLOW'
                ? 'bg-[#F59E0B] text-[#06101E] shadow-md shadow-[#F59E0B]/20'
                : 'bg-[#0D2032] text-[#F59E0B] border border-[#F59E0B]/40 hover:bg-[#F59E0B]/10'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>TANK OVERFLOW</span>
          </button>

          <button
            onClick={() => onModeChange('HIGH_USAGE')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
              simulationMode === 'HIGH_USAGE'
                ? 'bg-[#38BDF8] text-[#06101E] shadow-md shadow-[#38BDF8]/20'
                : 'bg-[#0D2032] text-[#38BDF8] border border-[#38BDF8]/40 hover:bg-[#38BDF8]/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>HIGH USAGE</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[#040D17] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#22D3EE]/50 border border-[#183C5A] transition-all"
            title="Reset telemetry stream to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

      </div>
    </div>
  );
};
