import React, { useState } from 'react';
import { 
  Sliders, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  Clock,
  Radio,
  RotateCcw
} from 'lucide-react';
import { RemoteValve, MeshNodeInfo, EsgMetrics, SimulationMode, PageType } from '../types';

interface ValvesPageProps {
  valves: RemoteValve[];
  nodes: MeshNodeInfo[];
  esgMetrics?: EsgMetrics;
  differentialLeakFlow: number;
  hasDifferentialLeak: boolean;
  simulationMode?: SimulationMode;
  onToggleValve: (valveId: string) => void;
  onNavigate?: (page: PageType) => void;
}

export const ValvesPage: React.FC<ValvesPageProps> = ({ 
  valves,
  nodes = [],
  esgMetrics,
  differentialLeakFlow = 0,
  hasDifferentialLeak = false,
  simulationMode = 'NORMAL',
  onToggleValve 
}) => {
  const [selectedValveId, setSelectedValveId] = useState<string>('v-blk-b-02');
  const [isActuatingId, setIsActuatingId] = useState<string | null>(null);

  const targetValve = valves.find(v => v.id === 'v-blk-b-02') || valves[1] || valves[0];
  const isV02Closed = targetValve?.status === 'CLOSED';
  const isLeakActive = (simulationMode === 'LEAK' || hasDifferentialLeak || differentialLeakFlow > 5) && !isV02Closed;

  // Selected valve object
  const selectedValve = valves.find(v => v.id === selectedValveId) || targetValve;

  // Counts
  const onlineValvesCount = valves.length;
  const activeIsolationCount = valves.filter(v => v.status === 'CLOSED').length;

  // Handle valve actuation click with progress state
  const handleActuate = (valveId: string) => {
    if (isActuatingId) return;
    setIsActuatingId(valveId);
    
    // Perform actual valve actuation
    onToggleValve(valveId);

    setTimeout(() => {
      setIsActuatingId(null);
    }, 600);
  };

  // Primary valve mapping data derived directly from telemetry state
  const primaryValves = [
    {
      id: 'v-blk-a',
      tag: 'V-01',
      fullTag: 'VALVE-BLK-A',
      zone: 'Block A Academic Building',
      nodeId: 'node-blk-a',
      currentFlow: 48,
      expectedFlow: 48,
      variance: 0,
      valve: valves.find(v => v.id === 'v-blk-a') || valves[0]
    },
    {
      id: 'v-blk-b-02',
      tag: 'V-02',
      fullTag: 'VALVE-BLK-B2',
      zone: 'Block B Floor 2 Utility Line',
      nodeId: 'node-blk-b-02',
      currentFlow: isV02Closed ? 0 : isLeakActive ? 94 : 43,
      expectedFlow: 43,
      variance: isLeakActive ? 51 : 0,
      valve: targetValve
    },
    {
      id: 'v-blk-c',
      tag: 'V-03',
      fullTag: 'VALVE-BLK-C',
      zone: 'Block C Hostel Complex',
      nodeId: 'node-blk-c',
      currentFlow: 35,
      expectedFlow: 35,
      variance: 0,
      valve: valves.find(v => v.id === 'v-blk-c') || valves[2]
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="bg-[#0B1A28] p-6 rounded-3xl border border-[#183C5A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-[#22D3EE]" />
            <span>Industrial Actuation Layer · Solenoid Control Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#F8FAFC]">REMOTE VALVE CONTROL CENTER</h1>
          <p className="text-[#94A3B8] text-xs mt-1">
            Remote isolation and water-loss prevention with sub-second solenoid trip rules.
          </p>
        </div>

        {/* Small Status Indicators */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-[#040D17] px-3.5 py-2 rounded-xl border border-[#183C5A]">
            <span className="text-[#94A3B8] text-[10px] block uppercase font-mono">VALVES ONLINE</span>
            <span className="text-[#22D3EE] font-bold">{onlineValvesCount} / {onlineValvesCount}</span>
          </div>
          <div className="bg-[#040D17] px-3.5 py-2 rounded-xl border border-[#183C5A]">
            <span className="text-[#94A3B8] text-[10px] block uppercase font-mono">ACTIVE ISOLATION</span>
            <span className={activeIsolationCount > 0 ? 'text-[#22D3EE] font-bold' : 'text-[#F8FAFC]'}>
              {activeIsolationCount} {activeIsolationCount === 1 ? 'Zone' : 'Zones'}
            </span>
          </div>
          <div className={`px-3.5 py-2 rounded-xl border font-bold ${
            isLeakActive
              ? 'bg-[#040D17] border-[#EF4444]/60 text-[#EF4444] animate-pulse'
              : isV02Closed
              ? 'bg-[#040D17] border-[#22D3EE]/60 text-[#22D3EE]'
              : 'bg-[#040D17] border-[#22C55E]/60 text-[#22C55E]'
          }`}>
            <span className="text-[#94A3B8] text-[10px] block uppercase font-mono font-normal">NETWORK STATUS</span>
            <span>{isLeakActive ? 'ANOMALY DETECTED' : isV02Closed ? 'ZONE ISOLATED' : 'NORMAL'}</span>
          </div>
        </div>
      </div>

      {/* ANOMALY ALERT BANNER (WHEN SIMULATE LEAK IS ACTIVE) */}
      {isLeakActive && (
        <div className="bg-[#0B2134] border-2 border-[#EF4444] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-[#EF4444]/10">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-[#EF4444] mt-0.5 animate-pulse flex-shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-[#F8FAFC] font-mono">
                  ANOMALY DETECTED — TARGET ISOLATION VALVE: V-02 (Block B Utility Line)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                  HIGH RISK
                </span>
              </div>
              <p className="text-xs font-mono text-[#94A3B8] mt-1">
                Observed: <strong className="text-[#EF4444]">94 L/min</strong> | Baseline: <strong>43 L/min</strong> | Variance: <strong className="text-[#EF4444]">+51 L/min Unexplained Loss</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleActuate('v-blk-b-02')}
            disabled={isActuatingId !== null}
            className="px-5 py-2.5 bg-[#EF4444] hover:bg-[#dc2626] text-white font-mono font-bold text-xs rounded-xl border border-[#EF4444] transition-all flex items-center justify-center space-x-2 shadow-md shadow-[#EF4444]/30 animate-bounce flex-shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>{isActuatingId === 'v-blk-b-02' ? 'ISOLATING...' : '⚡ ISOLATE V-02'}</span>
          </button>
        </div>
      )}

      {/* ISOLATION VERIFIED CONFIRMATION BANNER (AFTER V-02 IS ISOLATED) */}
      {isV02Closed && (
        <div className="bg-[#0B2134] border border-[#22D3EE]/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[#22D3EE] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#22D3EE] font-mono">
                ISOLATION VERIFIED — VALVE V-02 ISOLATED
              </h3>
              <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
                Block B utility line shut off. Flow imbalance resolved (0 L/min variance). Prevented 18,360 L loss (Est. ₹826.20).
              </p>
            </div>
          </div>

          <button
            onClick={() => handleActuate('v-blk-b-02')}
            disabled={isActuatingId !== null}
            className="px-4 py-2 bg-[#0F2940] hover:bg-[#0F2940]/80 text-[#22D3EE] border border-[#22D3EE]/50 font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isActuatingId === 'v-blk-b-02' ? 'ACTUATING...' : 'RE-OPEN V-02'}</span>
          </button>
        </div>
      )}

      {/* MAIN LAYOUT: 2-COLUMN SPLIT (CONTROL GRID & OPERATIONAL DETAIL PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: MAIN CONTROL TABLE / GRID (2 COLS) */}
        <div className="lg:col-span-2 bg-[#0B2134] border border-[#163B55] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#163B55] pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#22D3EE]" />
              <h3 className="text-sm font-display font-bold text-[#F8FAFC]">Primary Solenoid Actuation Matrix</h3>
            </div>
            <span className="text-xs font-mono text-[#94A3B8]">Modbus Address: 0x4010 - 0x4015</span>
          </div>

          {/* Table / Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#163B55] text-[#94A3B8] uppercase text-[10px]">
                  <th className="pb-3 pt-1 font-semibold">VALVE</th>
                  <th className="pb-3 pt-1 font-semibold">ZONE</th>
                  <th className="pb-3 pt-1 font-semibold">CURRENT FLOW</th>
                  <th className="pb-3 pt-1 font-semibold">EXPECTED</th>
                  <th className="pb-3 pt-1 font-semibold">VARIANCE</th>
                  <th className="pb-3 pt-1 font-semibold">STATUS</th>
                  <th className="pb-3 pt-1 font-semibold text-right">CONTROL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#163B55]/60">
                {primaryValves.map((pv) => {
                  const valveStatus = pv.valve?.status || 'OPEN';
                  const isActuating = isActuatingId === pv.id;
                  const isTargetAndLeak = pv.id === 'v-blk-b-02' && isLeakActive;
                  const isTargetAndClosed = pv.id === 'v-blk-b-02' && isV02Closed;

                  return (
                    <tr 
                      key={pv.id}
                      onClick={() => setSelectedValveId(pv.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedValveId === pv.id 
                          ? 'bg-[#0F2940]' 
                          : isTargetAndLeak
                          ? 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20'
                          : 'hover:bg-[#0F2940]/50'
                      }`}
                    >
                      <td className="py-3.5 pr-2">
                        <div className={`font-bold ${isTargetAndLeak ? 'text-[#EF4444]' : 'text-[#22D3EE]'}`}>
                          {pv.tag}
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">{pv.fullTag}</div>
                      </td>
                      
                      <td className="py-3.5 pr-2 font-sans font-semibold text-[#F8FAFC]">
                        {pv.zone}
                      </td>

                      <td className="py-3.5 pr-2">
                        <span className={`font-bold ${
                          isTargetAndLeak ? 'text-[#EF4444]' : isTargetAndClosed ? 'text-[#22D3EE]' : 'text-[#F8FAFC]'
                        }`}>
                          {pv.currentFlow} L/min
                        </span>
                      </td>

                      <td className="py-3.5 pr-2 text-[#94A3B8]">
                        {pv.expectedFlow} L/min
                      </td>

                      <td className="py-3.5 pr-2">
                        <span className={`font-bold ${pv.variance > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                          {pv.variance > 0 ? `+${pv.variance} L/min` : '0 L/min'}
                        </span>
                      </td>

                      <td className="py-3.5 pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isActuating 
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 animate-pulse'
                            : valveStatus === 'CLOSED'
                            ? 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/40'
                            : isTargetAndLeak
                            ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 animate-pulse'
                            : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                        }`}>
                          {isActuating ? 'ISOLATING...' : valveStatus === 'CLOSED' ? 'CLOSED / ISOLATED' : isTargetAndLeak ? 'ANOMALY DETECTED' : 'OPEN'}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActuate(pv.id);
                          }}
                          disabled={isActuating}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                            valveStatus === 'CLOSED'
                              ? 'bg-[#0F2940] text-[#22D3EE] border-[#22D3EE]/40 hover:bg-[#0F2940]/80'
                              : isTargetAndLeak
                              ? 'bg-[#EF4444] text-white border-[#EF4444] hover:bg-[#dc2626] shadow-md shadow-[#EF4444]/30'
                              : 'bg-[#0F2940] text-[#F8FAFC] border-[#163B55] hover:bg-[#0F2940]/80'
                          }`}
                        >
                          {isActuating ? 'ACTUATING...' : valveStatus === 'CLOSED' ? 'RE-OPEN' : 'ISOLATE'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Infrastructure Valves Section */}
          <div className="pt-3 border-t border-[#163B55]">
            <div className="text-[11px] font-mono text-[#94A3B8] uppercase mb-2">Main Supply & Storage Manifold Valves</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {valves.filter(v => ['v-main-01', 'v-blk-b-01', 'v-tank-01'].includes(v.id)).map(v => (
                <div key={v.id} className="bg-[#081A2B] p-3 rounded-xl border border-[#163B55] flex items-center justify-between">
                  <div>
                    <div className="text-[#22D3EE] font-bold">{v.valveTag}</div>
                    <div className="text-[10px] text-[#94A3B8] truncate">{v.location}</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30">
                    {v.status || 'OPEN'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OPERATIONAL DETAIL PANEL (1 COL) */}
        <div className="bg-[#0B2134] border border-[#163B55] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#163B55] pb-2">
              <Zap className="w-4 h-4 text-[#22D3EE]" />
              <span>VALVE OPERATIONAL DIAGNOSTIC</span>
            </div>

            {/* Selected Valve Summary Header */}
            <div className={`p-3 rounded-xl border font-mono text-xs mb-4 ${
              selectedValveId === 'v-blk-b-02' && isLeakActive
                ? 'bg-[#081A2B] border-[#EF4444]'
                : selectedValveId === 'v-blk-b-02' && isV02Closed
                ? 'bg-[#081A2B] border-[#22D3EE]'
                : 'bg-[#0F2940] border-[#163B55]'
            }`}>
              <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">SELECTED ACTUATOR</div>
              <div className="text-base font-bold text-[#F8FAFC] mt-0.5">
                {selectedValve?.valveTag || 'V-02'} — {selectedValve?.location || 'Block B Utility Line'}
              </div>
              <div className="text-[11px] mt-1 flex items-center space-x-2">
                <span className="text-[#94A3B8]">Status:</span>
                <span className={`font-bold ${
                  selectedValve?.status === 'CLOSED' ? 'text-[#22D3EE]' : isLeakActive && selectedValveId === 'v-blk-b-02' ? 'text-[#EF4444]' : 'text-[#22C55E]'
                }`}>
                  {selectedValve?.status === 'CLOSED' ? 'CLOSED / ISOLATED' : isLeakActive && selectedValveId === 'v-blk-b-02' ? 'ANOMALY DETECTED' : 'OPEN (NOMINAL)'}
                </span>
              </div>
            </div>

            {/* Detailed Metric Readouts */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#163B55]/60">
                <span className="text-[#94A3B8]">Current Line Flow:</span>
                <span className={`font-bold ${isLeakActive && selectedValveId === 'v-blk-b-02' ? 'text-[#EF4444]' : 'text-[#F8FAFC]'}`}>
                  {selectedValveId === 'v-blk-b-02' ? (isV02Closed ? '0 L/min' : isLeakActive ? '94 L/min' : '43 L/min') : '48 L/min'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#163B55]/60">
                <span className="text-[#94A3B8]">Expected Baseline:</span>
                <span className="text-[#F8FAFC] font-bold">43 L/min</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#163B55]/60">
                <span className="text-[#94A3B8]">Differential Variance:</span>
                <span className={`font-bold ${isLeakActive && selectedValveId === 'v-blk-b-02' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                  {isLeakActive && selectedValveId === 'v-blk-b-02' ? '+51 L/min' : '0 L/min'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#163B55]/60">
                <span className="text-[#94A3B8]">Risk Level:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isLeakActive && selectedValveId === 'v-blk-b-02'
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                    : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                }`}>
                  {isLeakActive && selectedValveId === 'v-blk-b-02' ? 'HIGH RISK' : 'LOW RISK'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#163B55]/60">
                <span className="text-[#94A3B8]">Actuation Latency:</span>
                <span className="text-[#22D3EE] font-bold">{selectedValve?.responseLatencyMs || 120} ms</span>
              </div>

              {/* AI Recommendation Context */}
              <div className="pt-2">
                <span className="text-[#94A3B8] block mb-1">AI Recommendation:</span>
                <p className="text-[#F8FAFC] font-sans text-xs bg-[#0F2940] p-2.5 rounded-xl border border-[#163B55] leading-relaxed">
                  {isLeakActive && selectedValveId === 'v-blk-b-02'
                    ? 'Immediate isolation recommended. Unaccounted +51 L/min differential detected.'
                    : isV02Closed && selectedValveId === 'v-blk-b-02'
                    ? 'Valve V-02 isolated. Zone contained with 18,360 L loss prevented.'
                    : 'Nominal operating parameters. Solenoid ready for manual or automatic trip.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actuation Action Button in Detail Panel */}
          <button
            onClick={() => handleActuate(selectedValveId)}
            disabled={isActuatingId !== null}
            className={`w-full py-2.5 font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 ${
              selectedValve?.status === 'CLOSED'
                ? 'bg-[#0F2940] text-[#22D3EE] border border-[#22D3EE]/60 hover:bg-[#0F2940]/80'
                : isLeakActive && selectedValveId === 'v-blk-b-02'
                ? 'bg-[#EF4444] text-white border border-[#EF4444] hover:bg-[#dc2626] shadow-md shadow-[#EF4444]/30'
                : 'bg-[#0F2940] text-[#F8FAFC] border border-[#163B55] hover:bg-[#0F2940]/80'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>
              {isActuatingId === selectedValveId
                ? 'ACTUATING...'
                : selectedValve?.status === 'CLOSED'
                ? `RE-OPEN VALVE (${selectedValve?.valveTag || 'V-02'})`
                : `ISOLATE VALVE (${selectedValve?.valveTag || 'V-02'})`
              }
            </span>
          </button>
        </div>

      </div>

      {/* FOOTER: RECOVERY VERIFICATION PANEL (WHEN V-02 IS ISOLATED) */}
      {isV02Closed && (
        <div className="bg-[#0B2134] border border-[#22D3EE]/60 p-4 rounded-2xl space-y-3 font-mono text-xs animate-fade-in">
          <div className="flex items-center space-x-2 text-[#22D3EE] font-bold border-b border-[#163B55] pb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>ISOLATION VERIFICATION & SAVED LOSS SUMMARY</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#081A2B] p-3 rounded-xl border border-[#163B55]">
              <span className="text-[#94A3B8] text-[10px] block uppercase">Unaccounted Water</span>
              <span className="text-base font-bold text-[#22C55E]">0 L/min</span>
            </div>
            <div className="bg-[#081A2B] p-3 rounded-xl border border-[#163B55]">
              <span className="text-[#94A3B8] text-[10px] block uppercase">Flow Imbalance</span>
              <span className="text-base font-bold text-[#22C55E]">0 L/min</span>
            </div>
            <div className="bg-[#081A2B] p-3 rounded-xl border border-[#163B55]">
              <span className="text-[#94A3B8] text-[10px] block uppercase">Water Loss Prevented</span>
              <span className="text-base font-bold text-[#22D3EE]">18,360 Liters</span>
            </div>
            <div className="bg-[#081A2B] p-3 rounded-xl border border-[#163B55]">
              <span className="text-[#94A3B8] text-[10px] block uppercase">Financial Impact Prevented</span>
              <span className="text-base font-bold text-[#22C55E]">₹826.20</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
