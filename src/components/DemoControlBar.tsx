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
    <div className="bg-[#061421] border-b border-[#163B55] px-6 py-2 text-[#94A3B8]">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Simulation Environment Label */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
          <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Telemetry Simulation Console</span>
          <span className="text-[#163B55]">|</span>
          <span className="text-[#22D3EE] font-semibold">Active Mode: {simulationMode}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => onModeChange('NORMAL')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              simulationMode === 'NORMAL'
                ? 'bg-[#22C55E] text-[#061421] font-bold shadow'
                : 'bg-[#0B2134] text-[#F8FAFC] hover:bg-[#0F2940] border border-[#163B55]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NORMAL</span>
          </button>

          <button
            onClick={() => onModeChange('LEAK')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              simulationMode === 'LEAK'
                ? 'bg-[#EF4444] text-white font-bold animate-pulse shadow-md shadow-[#EF4444]/20'
                : 'bg-[#0B2134] text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE LEAK</span>
          </button>

          <button
            onClick={() => onModeChange('OVERFLOW')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              simulationMode === 'OVERFLOW'
                ? 'bg-[#F59E0B] text-[#061421] font-bold'
                : 'bg-[#0B2134] text-[#F59E0B] border border-[#F59E0B]/40 hover:bg-[#F59E0B]/10'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>TANK OVERFLOW</span>
          </button>

          <button
            onClick={() => onModeChange('HIGH_USAGE')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              simulationMode === 'HIGH_USAGE'
                ? 'bg-[#38BDF8] text-[#061421] font-bold'
                : 'bg-[#0B2134] text-[#38BDF8] border border-[#38BDF8]/40 hover:bg-[#38BDF8]/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>HIGH USAGE</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#0B2134] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#163B55]"
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
