import React from 'react';
import { Layers, ShieldCheck, ShieldAlert, Sliders, ArrowDown, Activity, Radio, Cpu } from 'lucide-react';
import { MeshNodeInfo, RemoteValve } from '../types';

interface TopologyPageProps {
  nodes: MeshNodeInfo[];
  valves: RemoteValve[];
  onToggleValve: (valveId: string) => void;
  differentialLeakFlow: number;
  hasDifferentialLeak: boolean;
}

export const TopologyPage: React.FC<TopologyPageProps> = ({
  nodes,
  valves,
  onToggleValve,
  differentialLeakFlow,
  hasDifferentialLeak,
}) => {
  const getNodeValve = (valveId?: string) => valves.find(v => v.id === valveId);

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>AquaSentinel 2.0 · Spatial Mesh Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Campus Water Network Topology</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time differential flow telemetry graph across 6 connected campus nodes & remote isolation valves.
          </p>
        </div>

        {/* Audit Status Badge */}
        <div className={`px-4 py-3 rounded-lg border flex items-center space-x-3 ${
          hasDifferentialLeak 
            ? 'bg-red-950/40 border-red-500/40 text-red-300' 
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
        }`}>
          {hasDifferentialLeak ? (
            <ShieldAlert className="w-6 h-6 text-red-400 animate-bounce" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          )}
          <div>
            <div className="text-xs font-mono uppercase font-semibold">Differential Audit</div>
            <div className="text-sm font-bold">
              {hasDifferentialLeak ? `+${differentialLeakFlow} L/min Line Loss Detected` : 'Line Balance Normal (0 L/min Variance)'}
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Topology Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Inflow Node Card */}
        <div className="lg:col-span-3 bg-slate-900/80 rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">ROOT INFLOW NODE</div>
                <h3 className="text-lg font-bold text-white">Main Campus Supply Inflow Meter</h3>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-2xl font-bold text-cyan-400">{nodes[0]?.flowRate} <span className="text-sm text-slate-400">L/min</span></div>
              <div className="text-xs text-slate-400">Target Baseline: 140 L/min</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Pressure:</span> <span className="text-white font-bold">{nodes[0]?.pressureBar} bar</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Node Status:</span> <span className="text-emerald-400 font-bold">{nodes[0]?.status}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400">Isolation Valve:</span> 
              <button 
                onClick={() => onToggleValve('v-main-01')}
                className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold hover:bg-cyan-900"
              >
                {getNodeValve('v-main-01')?.status === 'CLOSED' ? 'CLOSED' : 'OPEN'}
              </button>
            </div>
          </div>
        </div>

        {/* Downstream Sub-Nodes (3 Columns) */}
        {nodes.slice(1, 5).map((node) => {
          const valve = getNodeValve(node.connectedValveId);
          const isCritical = node.status === 'Critical';
          return (
            <div 
              key={node.id} 
              className={`bg-slate-900/80 rounded-xl border p-5 space-y-4 transition-all ${
                isCritical 
                  ? 'border-red-500/50 shadow-lg shadow-red-950/30' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{node.type}</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{node.name}</h4>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded ${
                  isCritical 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {node.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">Flow Telemetry:</span>
                <span className={`text-xl font-bold ${isCritical ? 'text-red-400' : 'text-slate-100'}`}>
                  {node.flowRate} <span className="text-xs font-normal text-slate-400">L/min</span>
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300">{valve?.valveTag || 'N/A'}</span>
                </div>
                <button
                  onClick={() => valve && onToggleValve(valve.id)}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    valve?.status === 'CLOSED'
                      ? 'bg-red-950 text-red-400 border border-red-500/40'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-900'
                  }`}
                >
                  {valve?.status === 'CLOSED' ? 'CLOSED (ISOLATED)' : 'SHUT OFF VALVE'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Central Reservoir Card */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">{nodes[5]?.type}</span>
            <h4 className="text-base font-bold text-white mt-0.5">{nodes[5]?.name}</h4>
          </div>
          <div className="flex items-baseline justify-between font-mono pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Outflow Rate:</span>
            <span className="text-xl font-bold text-cyan-400">
              {nodes[5]?.flowRate} <span className="text-xs font-normal text-slate-400">L/min</span>
            </span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Auto Float Isolation:</span>
            <span className="text-emerald-400 font-bold">READY (ONLINE)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
