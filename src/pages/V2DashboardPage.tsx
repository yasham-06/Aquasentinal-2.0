import React from 'react';
import { 
  Activity, 
  Layers, 
  Sliders, 
  Zap, 
  Leaf, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { 
  TelemetryPoint, 
  AIAnalysis, 
  SimulationMode, 
  MeshNodeInfo, 
  RemoteValve, 
  EsgMetrics,
  PageType 
} from '../types';

interface V2DashboardPageProps {
  telemetryHistory: TelemetryPoint[];
  latestTelemetry: TelemetryPoint;
  aiAnalysis: AIAnalysis;
  nodes: MeshNodeInfo[];
  valves: RemoteValve[];
  esgMetrics: EsgMetrics;
  differentialLeakFlow: number;
  hasDifferentialLeak: boolean;
  simulationMode: SimulationMode;
  onNavigate: (page: PageType) => void;
  onToggleValve: (valveId: string) => void;
  onSimulateLeak: () => void;
}

export const V2DashboardPage: React.FC<V2DashboardPageProps> = ({
  telemetryHistory,
  latestTelemetry,
  aiAnalysis,
  nodes,
  valves,
  esgMetrics,
  differentialLeakFlow,
  hasDifferentialLeak,
  simulationMode,
  onNavigate,
  onToggleValve,
  onSimulateLeak,
}) => {
  const isAnomaly = aiAnalysis.isAnomaly;
  const targetValve = valves.find(v => v.id === 'v-blk-b-02');

  return (
    <div className="space-y-6 pb-12">
      
      {/* 2.0 Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>AquaSentinel 2.0 Enterprise Control Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Multi-Node Mesh & Closed-Loop Actuation</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time differential flow telemetry, remote valve shutoff, micro-pressure fatigue AI, and ESG carbon tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('topology')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg font-mono text-xs font-bold transition-all flex items-center space-x-2"
          >
            <Layers className="w-4 h-4" />
            <span>VIEW CAMPUS MESH</span>
          </button>
          <button
            onClick={() => onNavigate('valves')}
            className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/40 rounded-lg font-mono text-xs font-bold transition-all flex items-center space-x-2"
          >
            <Sliders className="w-4 h-4" />
            <span>VALVES CONSOLE</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Main Flow Metric */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase">Live Flow Rate (Block B)</div>
          <div className={`text-3xl font-bold font-mono mt-1 ${isAnomaly ? 'text-red-400' : 'text-cyan-400'}`}>
            {latestTelemetry.actualFlow} <span className="text-xs font-normal text-slate-400">L/min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Baseline: 43 L/min · Threshold: 64.5 L/min</div>
        </div>

        {/* Differential Audit */}
        <div className={`p-5 rounded-xl border ${hasDifferentialLeak ? 'bg-red-950/30 border-red-500/40' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="text-xs font-mono text-slate-400 uppercase">Differential Flow Audit</div>
          <div className={`text-3xl font-bold font-mono mt-1 ${hasDifferentialLeak ? 'text-red-400' : 'text-emerald-400'}`}>
            {hasDifferentialLeak ? `+${differentialLeakFlow} L/m` : '0 L/m'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Inflow vs Sum(Outflows)</div>
        </div>

        {/* Remote Valve Isolation Status */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase">Block B Utility Valve</div>
          <div className={`text-xl font-bold font-mono mt-2 ${targetValve?.status === 'CLOSED' ? 'text-red-400' : 'text-emerald-400'}`}>
            {targetValve?.status === 'CLOSED' ? 'SHUT OFF (ISOLATED)' : 'OPEN (ONLINE)'}
          </div>
          <button
            onClick={() => targetValve && onToggleValve(targetValve.id)}
            className="mt-2 text-[11px] font-mono font-bold text-cyan-400 underline hover:text-cyan-300"
          >
            {targetValve?.status === 'CLOSED' ? 'Re-open Valve #V-02' : 'Remote Shutoff Valve #V-02'}
          </button>
        </div>

        {/* ESG Carbon Offset Widget */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/30">
          <div className="text-xs font-mono text-emerald-400 uppercase flex items-center justify-between">
            <span>ESG CO2 Avoided</span>
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
            {esgMetrics.co2AvoidedKg} <span className="text-xs font-normal text-slate-400">kg CO2e</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">{esgMetrics.totalWaterSavedLiters.toLocaleString()} Liters water saved</div>
        </div>

      </div>

      {/* Main Flow Chart & Emergency Actuation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Telemetry Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Real-Time Flow Telemetry & Anomaly Engine</h3>
              <p className="text-xs text-slate-400">Continuous 1.0s stream with 1.5× baseline anomaly threshold line.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded">
                Node: Block B Floor 2
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="v2FlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isAnomaly ? '#ef4444' : '#06b6d4'} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isAnomaly ? '#ef4444' : '#06b6d4'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[30, 110]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                <ReferenceLine y={64.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '1.5x Anomaly Threshold (64.5 L/min)', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={43} stroke="#22c55e" strokeDasharray="2 2" label={{ value: 'Baseline (43 L/min)', fill: '#22c55e', fontSize: 10 }} />
                <Area type="monotone" dataKey="actualFlow" stroke={isAnomaly ? '#ef4444' : '#06b6d4'} strokeWidth={2} fillOpacity={1} fill="url(#v2FlowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI & Closed Loop Control Box */}
        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
              <Zap className="w-4 h-4" />
              <span>AI Diagnostic & Actuation</span>
            </div>
            <h3 className="text-base font-bold text-white">Diagnostic Summary</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {aiAnalysis.explanation}
            </p>
          </div>

          {isAnomaly && (
            <div className="bg-red-950/40 p-4 rounded-lg border border-red-500/40 space-y-3">
              <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase font-mono">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>Immediate Actuation Recommended</span>
              </div>
              <button
                onClick={() => targetValve && onToggleValve(targetValve.id)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-red-900/40 transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>SUB-3S EMERGENCY SHUTOFF VALVE #V-02</span>
              </button>
            </div>
          )}

          {!isAnomaly && (
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-mono text-slate-300">All 6 Mesh Nodes Operating Normally</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
