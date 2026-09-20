import React from 'react';
import { Sliders, Zap, ShieldCheck, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { RemoteValve } from '../types';

interface ValvesPageProps {
  valves: RemoteValve[];
  onToggleValve: (valveId: string) => void;
}

export const ValvesPage: React.FC<ValvesPageProps> = ({ valves, onToggleValve }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          <span>AquaSentinel 2.0 · Closed-Loop Actuation Layer</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Remote Isolation Valve Control Center</h1>
        <p className="text-slate-400 text-sm mt-1">
          Industrial MQTT / Modbus remote valve triggers capable of sub-3-second emergency leak isolation.
        </p>
      </div>

      {/* Valves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {valves.map((v) => {
          const isOpen = v.status === 'OPEN';
          return (
            <div 
              key={v.id} 
              className={`bg-slate-900/80 rounded-xl border p-5 space-y-4 transition-all ${
                isOpen 
                  ? 'border-slate-800' 
                  : 'border-red-500/60 bg-red-950/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{v.valveTag}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{v.location}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  isOpen 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {v.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Auto-Shutoff Mode:</span>
                  <span className={v.autoShutoffEnabled ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                    {v.autoShutoffEnabled ? 'ENABLED (AUTO)' : 'MANUAL ONLY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Actuation Latency:</span>
                  <span className="text-white font-bold">{v.responseLatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Actuation:</span>
                  <span className="text-slate-300">{v.lastActuated}</span>
                </div>
              </div>

              <button
                onClick={() => onToggleValve(v.id)}
                className={`w-full py-2.5 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                  isOpen
                    ? 'bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isOpen ? 'EMERGENCY ISOLATE VALVE' : 'RE-OPEN SUPPLY VALVE'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
