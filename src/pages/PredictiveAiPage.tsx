import React from 'react';
import { Zap, AlertTriangle, ShieldCheck, Activity, LineChart as IconLineChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { MicroPressurePoint } from '../types';

interface PredictiveAiPageProps {
  pressurePoints: MicroPressurePoint[];
}

export const PredictiveAiPage: React.FC<PredictiveAiPageProps> = ({ pressurePoints }) => {
  const latest = pressurePoints[pressurePoints.length - 1] || {
    timestamp: '16:00',
    baselinePressure: 2.8,
    measuredPressure: 2.8,
    pressureGradient: 0.01,
    fatigueIndex: 12,
    fatigueRisk: 'NORMAL'
  };

  const isCritical = latest.fatigueRisk === 'CRITICAL_FATIGUE';

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4" />
          <span>AquaSentinel 2.0 · Pre-Burst Predictive Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Micro-Pressure Fatigue Forecaster</h1>
        <p className="text-slate-400 text-sm mt-1">
          Analyzes micro-pressure drop gradients (ΔP / Δt) to forecast structural pipe fatigue before leaks breach volume thresholds.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase">Baseline Pressure</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-1">2.80 <span className="text-xs text-slate-400">bar</span></div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase">Measured Pressure</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${isCritical ? 'text-red-400' : 'text-cyan-400'}`}>
            {latest.measuredPressure} <span className="text-xs text-slate-400">bar</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase">Gradient (ΔP / Δt)</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{latest.pressureGradient} <span className="text-xs text-slate-400">bar/s</span></div>
        </div>

        <div className={`p-5 rounded-xl border ${isCritical ? 'bg-red-950/40 border-red-500/40' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="text-xs font-mono text-slate-400 uppercase">Pipe Structural Risk</div>
          <div className={`text-xl font-bold font-mono mt-1 ${isCritical ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            {latest.fatigueRisk}
          </div>
        </div>
      </div>

      {/* Pressure Trend Chart */}
      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Micro-Pressure Waveform & Fatigue Score</h3>
            <p className="text-xs text-slate-400">Real-time pressure drop detection across Block B utility lines.</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
            500Hz SAMPLING RATE
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pressurePoints}>
              <defs>
                <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[2.0, 3.2]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} 
              />
              <ReferenceLine y={2.8} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Baseline (2.8 bar)', fill: '#22c55e', fontSize: 10 }} />
              <Area type="monotone" dataKey="measuredPressure" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#pressureGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
