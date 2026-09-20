import React from 'react';
import { SimulationMode } from '../types';
import { RotateCcw, AlertTriangle, ShieldCheck, Droplet, Flame } from 'lucide-react';

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
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Single Subtle Demo Indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Demo environment · Simulated telemetry</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => onModeChange('NORMAL')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              simulationMode === 'NORMAL'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NORMAL MODE</span>
          </button>

          <button
            onClick={() => onModeChange('LEAK')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-bold transition-colors ${
              simulationMode === 'LEAK'
                ? 'bg-rose-600 text-white font-bold ring-1 ring-rose-400'
                : 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE LEAK</span>
          </button>

          <button
            onClick={() => onModeChange('OVERFLOW')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              simulationMode === 'OVERFLOW'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>TANK OVERFLOW</span>
          </button>

          <button
            onClick={() => onModeChange('HIGH_USAGE')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              simulationMode === 'HIGH_USAGE'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>HIGH USAGE</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
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
