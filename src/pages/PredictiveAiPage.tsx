import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Sliders,
  Clock,
  Gauge
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { 
  MicroPressurePoint, 
  RemoteValve, 
  MeshNodeInfo, 
  EsgMetrics, 
  SimulationMode,
  PageType 
} from '../types';

interface PredictiveAiPageProps {
  pressurePoints: MicroPressurePoint[];
  valves?: RemoteValve[];
  nodes?: MeshNodeInfo[];
  esgMetrics?: EsgMetrics;
  differentialLeakFlow?: number;
  hasDifferentialLeak?: boolean;
  simulationMode?: SimulationMode;
  onNavigate?: (page: PageType) => void;
}

export const PredictiveAiPage: React.FC<PredictiveAiPageProps> = ({ 
  pressurePoints,
  valves = [],
  nodes = [],
  esgMetrics,
  differentialLeakFlow = 0,
  hasDifferentialLeak = false,
  simulationMode = 'NORMAL',
  onNavigate
}) => {
  const targetValve = valves.find(v => v.id === 'v-blk-b-02') || valves[1] || valves[0];
  const isV02Closed = targetValve?.status === 'CLOSED';
  const isLeakActive = (simulationMode === 'LEAK' || hasDifferentialLeak || differentialLeakFlow > 5) && !isV02Closed;
  const isIsolated = isV02Closed;

  const latestPressurePoint = pressurePoints[pressurePoints.length - 1] || {
    timestamp: '16:00',
    baselinePressure: 2.8,
    measuredPressure: 2.8,
    pressureGradient: 0.01,
    fatigueIndex: 12,
    fatigueRisk: 'NORMAL'
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Explainable Risk Architecture · Diagnostic Engine</span>
          </div>
          <h1 className="text-xl font-bold text-[#F1F5F9]">PREDICTIVE AI INTELLIGENCE CENTER</h1>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            Explainable risk analysis for water-network anomalies from raw telemetry to actionable water-loss risk.
          </p>
        </div>

        {/* Top Status Indicators */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-[#07111F] px-3 py-2 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">AI ENGINE</span>
            <span className="text-[#22D3EE] font-bold">ONLINE</span>
          </div>
          <div className="bg-[#07111F] px-3 py-2 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">RISK MODEL</span>
            <span className="text-[#22C55E] font-bold">ACTIVE (94% CONF)</span>
          </div>
          <div className={`px-3 py-2 rounded border font-bold ${
            isLeakActive
              ? 'bg-[#07111F] border-[#EF4444]/60 text-[#EF4444] animate-pulse'
              : isIsolated
              ? 'bg-[#07111F] border-[#22D3EE]/60 text-[#22D3EE]'
              : 'bg-[#07111F] border-[#22C55E]/60 text-[#22C55E]'
          }`}>
            <span className="text-[#94A3B8] text-[10px] block uppercase font-normal">NETWORK STATUS</span>
            <span>{isLeakActive ? 'ANOMALY DETECTED' : isIsolated ? 'ZONE ISOLATED' : 'NORMAL'}</span>
          </div>
        </div>
      </div>

      {/* PRIMARY RISK SUMMARY PANEL */}
      <div className={`p-6 rounded-lg border transition-all ${
        isLeakActive
          ? 'bg-[#0D1B2A] border-[#EF4444] shadow-lg shadow-[#EF4444]/10'
          : isIsolated
          ? 'bg-[#0D1B2A] border-[#22D3EE]'
          : 'bg-[#0D1B2A] border-[#243B53]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#243B53] pb-4">
          <div>
            <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">
              PRIMARY RISK DIAGNOSTIC SUMMARY
            </div>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`text-2xl font-mono font-bold ${
                isLeakActive ? 'text-[#EF4444]' : isIsolated ? 'text-[#22D3EE]' : 'text-[#22C55E]'
              }`}>
                {isLeakActive ? 'HIGH RISK' : isIsolated ? 'INCIDENT RESOLVED' : 'LOW RISK'}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                isLeakActive 
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 animate-pulse' 
                  : isIsolated
                  ? 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/40'
                  : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
              }`}>
                {isLeakActive ? 'Block B Utility Line' : isIsolated ? 'Zone Block B Isolated' : 'System Baseline Nominal'}
              </span>
            </div>
            <p className="text-xs font-sans text-[#94A3B8] mt-1">
              {isLeakActive
                ? 'Probable downstream water loss detected in Block B Floor 2. High differential flow imbalance observed.'
                : isIsolated
                ? 'Valve V-02 isolated. Zone contained with 18,360 L water loss prevented (₹826.20 cost saved).'
                : 'Network operating within expected parameters. Continuous sub-node monitoring active.'
              }
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            {onNavigate && (
              <button
                onClick={() => onNavigate('valves')}
                className={`px-4 py-2.5 rounded font-mono font-bold text-xs border transition-all flex items-center space-x-2 ${
                  isLeakActive
                    ? 'bg-[#EF4444] text-white border-[#EF4444] hover:bg-[#dc2626] shadow-md shadow-[#EF4444]/30 animate-bounce'
                    : 'bg-[#13263A] text-[#22D3EE] border-[#243B53] hover:bg-[#1f3650]'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>OPEN VALVE CONTROL CENTER</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Telemetry Risk Readout Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 font-mono text-xs">
          <div className="bg-[#07111F] p-3 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">Observed Flow</span>
            <span className={`text-base font-bold mt-0.5 block ${isLeakActive ? 'text-[#EF4444]' : 'text-[#F1F5F9]'}`}>
              {isIsolated ? '0 L/min' : isLeakActive ? '94 L/min' : '43 L/min'}
            </span>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">Expected Baseline</span>
            <span className="text-base font-bold text-[#22C55E] mt-0.5 block">43 L/min</span>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">Flow Deviation</span>
            <span className={`text-base font-bold mt-0.5 block ${isLeakActive ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
              {isLeakActive ? '+51 L/min' : '0 L/min'}
            </span>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">Pressure Variance</span>
            <span className={`text-base font-bold mt-0.5 block ${isLeakActive ? 'text-[#EF4444]' : 'text-[#F1F5F9]'}`}>
              {isLeakActive ? '+18.4% (Elevated)' : 'Nominal (0.0%)'}
            </span>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] col-span-2 md:col-span-1">
            <span className="text-[#94A3B8] text-[10px] block uppercase">Target Isolation</span>
            <span className="text-base font-bold text-[#22D3EE] mt-0.5 block">Valve V-02</span>
          </div>
        </div>
      </div>

      {/* CORE EVIDENCE PIPELINE */}
      <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-2 text-[#22D3EE] font-bold border-b border-[#243B53] pb-2">
          <Activity className="w-4 h-4 text-[#22D3EE]" />
          <span>EXPLAINABLE EVIDENCE PIPELINE (TELEMETRY TO RISK ACTION)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          
          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">01 · BASELINE</div>
            <div className="text-xs font-bold text-[#F1F5F9] mt-1">43 L/min</div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Expected Baseline</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">02 · OBSERVED</div>
            <div className={`text-xs font-bold mt-1 ${isLeakActive ? 'text-[#EF4444]' : 'text-[#F1F5F9]'}`}>
              {isIsolated ? '0 L/min' : isLeakActive ? '94 L/min' : '43 L/min'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Live Meter Flow</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">03 · DEVIATION</div>
            <div className={`text-xs font-bold mt-1 ${isLeakActive ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
              {isLeakActive ? '+51 L/min' : '0 L/min'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Unaccounted Flow</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">04 · PRESSURE</div>
            <div className={`text-xs font-bold mt-1 ${isLeakActive ? 'text-[#EF4444]' : 'text-[#F1F5F9]'}`}>
              {isLeakActive ? '+18.4%' : '0.0%'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Gradient Variance</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">05 · RISK ENGINE</div>
            <div className={`text-xs font-bold mt-1 ${isLeakActive ? 'text-[#EF4444]' : isIsolated ? 'text-[#22D3EE]' : 'text-[#22C55E]'}`}>
              {isLeakActive ? 'HIGH RISK' : isIsolated ? 'CONTAINED' : 'LOW RISK'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Classification</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">06 · DIAGNOSTIC</div>
            <div className="text-xs font-bold text-[#F1F5F9] mt-1">Isolate V-02</div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">AI Recommendation</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-1">
            <div className="text-[10px] text-[#22D3EE] font-bold">07 · RECOVERY</div>
            <div className={`text-xs font-bold mt-1 ${isIsolated ? 'text-[#22D3EE]' : 'text-[#22C55E]'}`}>
              {isIsolated ? '0 L/min' : '0 L/min'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Imbalance Verified</div>
          </div>

        </div>
      </div>

      {/* 2-COLUMN SPLIT: RISK FACTORS & DECISION TRACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* LEFT: RISK FACTOR BREAKDOWN */}
        <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-3">
          <div className="flex items-center space-x-2 text-[#22D3EE] font-bold border-b border-[#243B53] pb-2">
            <Gauge className="w-4 h-4 text-[#22D3EE]" />
            <span>RISK FACTOR MATRIX</span>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <div>
                <span className="text-[#F1F5F9] font-bold block">Flow Rate Deviation</span>
                <span className="text-[10px] text-[#94A3B8]">1.5x Anomaly Limit (64.5 L/min)</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                isLeakActive ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
              }`}>
                {isLeakActive ? '+51 L/min (CRITICAL)' : '0 L/min (NORMAL)'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <div>
                <span className="text-[#F1F5F9] font-bold block">Pressure Variance</span>
                <span className="text-[10px] text-[#94A3B8]">Micro-pressure drop gradient</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                isLeakActive ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
              }`}>
                {isLeakActive ? '+18.4% (ELEVATED)' : '0.0% (NOMINAL)'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <div>
                <span className="text-[#F1F5F9] font-bold block">Differential Balance</span>
                <span className="text-[10px] text-[#94A3B8]">Gateway inflow vs sub-outflows</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                isLeakActive ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
              }`}>
                {isLeakActive ? 'UNACCOUNTED FLOW' : 'BALANCED'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <div>
                <span className="text-[#F1F5F9] font-bold block">Affected Zone</span>
                <span className="text-[10px] text-[#94A3B8]">Sub-meter spatial mapping</span>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#13263A] text-[#22D3EE] border border-[#22D3EE]/40">
                {isLeakActive ? 'Block B Floor 2' : 'All Zones Safe'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <div>
                <span className="text-[#F1F5F9] font-bold block">Recommended Isolation</span>
                <span className="text-[10px] text-[#94A3B8]">Target solenoid valve</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                isIsolated ? 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/40' : isLeakActive ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
              }`}>
                {isIsolated ? 'V-02 ISOLATED' : isLeakActive ? 'V-02 (READY)' : 'V-02 (STANDBY)'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: DECISION TRACE ("WHY THIS ALERT FIRED") */}
        <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-3">
          <div className="flex items-center space-x-2 text-[#22D3EE] font-bold border-b border-[#243B53] pb-2">
            <Cpu className="w-4 h-4 text-[#22D3EE]" />
            <span>DECISION TRACE (WHY THIS ALERT FIRED)</span>
          </div>

          <div className="space-y-2 pt-1 font-sans text-xs">
            <div className="flex items-start space-x-2 bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <span className="font-mono font-bold text-[#22D3EE] text-xs mt-0.5">1.</span>
              <p className="text-[#F1F5F9] leading-relaxed">
                Flow rate exceeded configured 1.5x anomaly threshold (64.5 L/min).
              </p>
            </div>

            <div className="flex items-start space-x-2 bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <span className="font-mono font-bold text-[#22D3EE] text-xs mt-0.5">2.</span>
              <p className="text-[#F1F5F9] leading-relaxed">
                Supply/outflow differential audit confirmed unaccounted water loss (+51 L/min).
              </p>
            </div>

            <div className="flex items-start space-x-2 bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <span className="font-mono font-bold text-[#22D3EE] text-xs mt-0.5">3.</span>
              <p className="text-[#F1F5F9] leading-relaxed">
                Micro-pressure gradient model detected +18.4% pressure drop variance.
              </p>
            </div>

            <div className="flex items-start space-x-2 bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <span className="font-mono font-bold text-[#22D3EE] text-xs mt-0.5">4.</span>
              <p className="text-[#F1F5F9] leading-relaxed">
                Multiple telemetry streams converged on Block B Floor 2 utility line.
              </p>
            </div>

            <div className="flex items-start space-x-2 bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <span className="font-mono font-bold text-[#22D3EE] text-xs mt-0.5">5.</span>
              <p className="text-[#F1F5F9] leading-relaxed">
                Target isolation valve V-02 identified as the primary actuation point.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MICRO-PRESSURE WAVEFORM CHART */}
      <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#243B53] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Micro-Pressure Waveform & Early Warning Diagnostic</h3>
            <p className="text-xs text-[#94A3B8] font-sans">High-frequency pressure gradient model tracking pressure drops across Block B utility lines.</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#13263A] text-[#22D3EE] border border-[#243B53] rounded">
            HIGH-FREQUENCY SIMULATION
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pressurePoints} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isLeakActive ? '#EF4444' : '#22D3EE'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isLeakActive ? '#EF4444' : '#22D3EE'} stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis 
                domain={[2.0, 3.6]} 
                ticks={[2.2, 2.5, 2.8, 3.1, 3.4]} 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 10 }} 
                tickFormatter={(v) => `${v.toFixed(1)} bar`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#071421', borderColor: '#163B55', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px', fontFamily: 'monospace' }} 
                formatter={(val: any) => [`${val} bar`, 'Pressure']}
              />
              <ReferenceLine y={2.8} stroke="#22C55E" strokeDasharray="3 3" label={{ value: 'BASELINE — 2.8 bar', fill: '#22C55E', fontSize: 10, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="measuredPressure" name="Pressure" stroke={isLeakActive ? '#EF4444' : '#22D3EE'} strokeWidth={2.5} fillOpacity={1} fill="url(#pressureGrad)" dot={{ r: 2 }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
