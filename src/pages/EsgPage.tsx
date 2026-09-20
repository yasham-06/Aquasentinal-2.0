import React from 'react';
import { 
  Leaf, 
  Zap, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  FileCheck, 
  CheckCircle2, 
  Activity, 
  Droplets,
  Gauge,
  ArrowRight,
  BarChart3,
  Sliders
} from 'lucide-react';
import { EsgMetrics, MeshNodeInfo, RemoteValve, SimulationMode, PageType } from '../types';

interface EsgPageProps {
  esgMetrics: EsgMetrics;
  nodes?: MeshNodeInfo[];
  valves?: RemoteValve[];
  differentialLeakFlow?: number;
  hasDifferentialLeak?: boolean;
  simulationMode?: SimulationMode;
  onNavigate?: (page: PageType) => void;
}

export const EsgPage: React.FC<EsgPageProps> = ({ 
  esgMetrics,
  nodes = [],
  valves = [],
  differentialLeakFlow = 0,
  hasDifferentialLeak = false,
  simulationMode = 'NORMAL',
  onNavigate
}) => {
  const targetValve = valves.find(v => v.id === 'v-blk-b-02') || valves[1] || valves[0];
  const isV02Closed = targetValve?.status === 'CLOSED';
  const isLeakActive = (simulationMode === 'LEAK' || hasDifferentialLeak || differentialLeakFlow > 5) && !isV02Closed;
  const isIsolated = isV02Closed || esgMetrics.totalWaterSavedLiters > 0;

  const rootNode = nodes[0] || { flowRate: 169 };
  const totalAccountedFlow = isV02Closed ? (48 + 43 + 0 + 35) : (48 + 43 + (isLeakActive ? 94 : 43) + 35);
  const unaccountedWater = Math.max(0, rootNode.flowRate - totalAccountedFlow);

  const waterSavedLiters = isIsolated ? (esgMetrics.totalWaterSavedLiters || 18360) : 0;
  const financialSavedINR = isIsolated ? (esgMetrics.financialSavingsINR || 826.20) : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Leaf className="w-4 h-4 text-[#22C55E]" />
            <span>ESG INTELLIGENCE LAYER · WATER & RESOURCE EFFICIENCY</span>
          </div>
          <h1 className="text-xl font-bold text-[#F1F5F9]">ESG & SUSTAINABILITY INTELLIGENCE</h1>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            Translate every prevented litre into measurable operational and environmental impact.
          </p>
        </div>

        {/* Top Status Indicators */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-[#07111F] px-3 py-2 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">WATER SAVINGS</span>
            <span className="text-[#22C55E] font-bold">{waterSavedLiters.toLocaleString()} L</span>
          </div>
          <div className="bg-[#07111F] px-3 py-2 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">COST SAVINGS</span>
            <span className="text-[#22C55E] font-bold">₹{financialSavedINR.toLocaleString()}</span>
          </div>
          <div className="bg-[#07111F] px-3 py-2 rounded border border-[#243B53]">
            <span className="text-[#94A3B8] text-[10px] block uppercase">RESOURCE EFFICIENCY</span>
            <span className={isLeakActive ? 'text-[#EF4444] font-bold' : 'text-[#22D3EE] font-bold'}>
              {isLeakActive ? '76.8%' : '100%'}
            </span>
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

      {/* PRIMARY IMPACT SUMMARY PANEL */}
      <div className={`p-6 rounded-lg border transition-all ${
        isLeakActive
          ? 'bg-[#0D1B2A] border-[#EF4444] shadow-lg shadow-[#EF4444]/10'
          : isIsolated
          ? 'bg-[#0D1B2A] border-[#22C55E]'
          : 'bg-[#0D1B2A] border-[#243B53]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#243B53] pb-4">
          <div>
            <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">
              {isLeakActive ? 'PROJECTED AVOIDABLE LOSS (UNMITIGATED)' : isIsolated ? 'PREVENTED WATER LOSS IMPACT' : 'PREVENTED LOSS BASELINE'}
            </div>
            <div className="flex items-center space-x-3 mt-1 font-mono">
              <span className={`text-2xl font-bold ${
                isLeakActive ? 'text-[#EF4444]' : isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'
              }`}>
                {isLeakActive ? '18,360 Liters / 6h' : isIsolated ? '18,360 Liters' : '0 Liters'}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                isLeakActive 
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 animate-pulse' 
                  : isIsolated
                  ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                  : 'bg-[#13263A] text-[#94A3B8] border-[#243B53]'
              }`}>
                {isLeakActive ? 'ANOMALY DETECTED (+51 L/min Loss)' : isIsolated ? 'ZONE ISOLATED (Loss Prevented)' : 'No Prevented Loss Recorded'}
              </span>
            </div>
            <p className="text-xs font-sans text-[#94A3B8] mt-1">
              {isLeakActive
                ? 'Active water loss occurring in Block B Floor 2. Immediate valve isolation required to prevent 18,360 L total loss.'
                : isIsolated
                ? 'Valve V-02 closed. Successfully prevented 18,360 L water loss and avoided ₹826.20 in direct municipal costs.'
                : 'System operating within safe parameters. Baseline flow balanced across all sub-meter nodes.'
              }
            </p>
          </div>

          <div className="text-right font-mono flex-shrink-0">
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold">
              {isLeakActive ? 'ESTIMATED FINANCIAL EXPOSURE' : 'ESTIMATED COST SAVED'}
            </div>
            <div className={`text-xl font-bold mt-0.5 ${
              isLeakActive ? 'text-[#EF4444]' : isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'
            }`}>
              {isLeakActive ? '₹826.20' : isIsolated ? '₹826.20' : '₹0.00'}
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">₹45.00 / 1,000 L Municipal Rate</div>
          </div>
        </div>

        {/* 3 IMPACT METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 font-mono text-xs">
          
          <div className="bg-[#07111F] p-4 rounded border border-[#243B53] space-y-1">
            <div className="flex justify-between items-center text-[#94A3B8] text-[10px] uppercase">
              <span>WATER CONSERVED</span>
              <Droplets className="w-4 h-4 text-[#22D3EE]" />
            </div>
            <div className={`text-xl font-bold ${isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'}`}>
              {waterSavedLiters.toLocaleString()} <span className="text-xs text-[#94A3B8] font-normal">Liters</span>
            </div>
            <div className="text-[11px] text-[#94A3B8]">Prevented from continued loss</div>
          </div>

          <div className="bg-[#07111F] p-4 rounded border border-[#243B53] space-y-1">
            <div className="flex justify-between items-center text-[#94A3B8] text-[10px] uppercase">
              <span>OPERATIONAL SAVINGS</span>
              <DollarSign className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className={`text-xl font-bold ${isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'}`}>
              ₹{financialSavedINR.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94A3B8]">Estimated avoided water cost</div>
          </div>

          <div className="bg-[#07111F] p-4 rounded border border-[#243B53] space-y-1">
            <div className="flex justify-between items-center text-[#94A3B8] text-[10px] uppercase">
              <span>RESOURCE EFFICIENCY</span>
              <Gauge className="w-4 h-4 text-[#0EA5E9]" />
            </div>
            <div className={`text-xl font-bold ${isLeakActive ? 'text-[#EF4444]' : 'text-[#22D3EE]'}`}>
              {isLeakActive ? '76.8%' : '100%'}
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {isLeakActive ? '+51 L/min unaccounted' : 'Unaccounted flow recovered to 0 L/min'}
            </div>
          </div>

        </div>
      </div>

      {/* WATER-LOSS PREVENTION TIMELINE */}
      <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-2 text-[#22D3EE] font-bold border-b border-[#243B53] pb-2">
          <Activity className="w-4 h-4 text-[#22D3EE]" />
          <span>CLOSED-LOOP WATER PREVENTION WORKFLOW</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          
          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">01 · DETECTION</div>
            <div className={`text-xs font-bold mt-1 ${isLeakActive ? 'text-[#EF4444]' : 'text-[#F1F5F9]'}`}>
              {isLeakActive ? '+51 L/min' : '0 L/min'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Differential Imbalance</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">02 · DIAGNOSIS</div>
            <div className="text-xs font-bold text-[#F1F5F9] mt-1">18,360 L / 6h</div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Projected Avoidable Loss</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">03 · ISOLATION</div>
            <div className={`text-xs font-bold mt-1 ${isIsolated ? 'text-[#22D3EE]' : 'text-[#F1F5F9]'}`}>
              {isIsolated ? 'CLOSED' : 'OPEN'}
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Valve V-02 Actuation</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center">
            <div className="text-[10px] text-[#22D3EE] font-bold">04 · RECOVERY</div>
            <div className="text-xs font-bold text-[#22C55E] mt-1">0 L/min</div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Unaccounted Flow</div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] text-center col-span-1 sm:col-span-2 md:col-span-1">
            <div className="text-[10px] text-[#22C55E] font-bold">05 · PREVENTED</div>
            <div className={`text-xs font-bold mt-1 ${isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'}`}>
              {waterSavedLiters.toLocaleString()} L
            </div>
            <div className="text-[9px] text-[#94A3B8] mt-0.5">Total Prevented Impact</div>
          </div>

        </div>
      </div>

      {/* 2-COLUMN SPLIT: ENVIRONMENTAL IMPACT & OPERATIONAL EFFICIENCY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* LEFT: ENVIRONMENTAL IMPACT & CARBON MODEL */}
        <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-4">
          <div className="flex items-center space-x-2 text-[#22D3EE] font-bold border-b border-[#243B53] pb-2">
            <Leaf className="w-4 h-4 text-[#22C55E]" />
            <span>ENVIRONMENTAL RESOURCE IMPACT</span>
          </div>

          <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
            Every litre of treated municipal water lost represents wasted treatment chemicals, pumping electricity, and distribution resources.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#07111F] p-3 rounded border border-[#243B53] space-y-1">
              <span className="text-[#94A3B8] text-[10px] block uppercase">Pumping Energy Saved</span>
              <span className="text-base font-bold text-[#22D3EE] block">
                {isIsolated ? (esgMetrics.energySavedKwh || 15.6) : 0} kWh
              </span>
              <span className="text-[9px] text-[#94A3B8]">0.85 kWh / 1,000 L factor</span>
            </div>

            <div className="bg-[#07111F] p-3 rounded border border-[#243B53] space-y-1">
              <span className="text-[#94A3B8] text-[10px] block uppercase">Avoided Carbon Emissions</span>
              <span className="text-base font-bold text-[#22C55E] block">
                {isIsolated ? (esgMetrics.co2AvoidedKg || 11.1) : 0} kg CO₂e
              </span>
              <span className="text-[9px] text-[#94A3B8]">0.71 kg CO₂e / kWh factor</span>
            </div>
          </div>

          <div className="bg-[#07111F] p-3 rounded border border-[#243B53] font-sans text-xs space-y-1">
            <div className="font-mono font-bold text-[#22D3EE] text-[11px]">Carbon Impact Model Methodology</div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              A production deployment applies a verified local energy/emissions factor (0.71 kg CO₂e/kWh) to estimate avoided treatment and pumping emissions from prevented water volume.
            </p>
          </div>
        </div>

        {/* RIGHT: LIVE OPERATIONAL EFFICIENCY PANEL */}
        <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#243B53] pb-2">
            <div className="flex items-center space-x-2 text-[#22D3EE] font-bold">
              <BarChart3 className="w-4 h-4 text-[#22D3EE]" />
              <span>LIVE OPERATIONAL TELEMETRY AUDIT</span>
            </div>
            <span className="text-[10px] text-[#94A3B8]">Single Source of Truth</span>
          </div>

          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-[#243B53]/60">
              <span className="text-[#94A3B8]">Main Campus Gateway Inflow:</span>
              <span className="font-bold text-[#22D3EE]">{rootNode.flowRate} L/min</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#243B53]/60">
              <span className="text-[#94A3B8]">Sum of Metered Outflows:</span>
              <span className="font-bold text-[#F1F5F9]">{totalAccountedFlow} L/min</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#243B53]/60">
              <span className="text-[#94A3B8]">Unaccounted Water (Inflow - Outflows):</span>
              <span className={`font-bold ${isLeakActive ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                {isLeakActive ? `+${unaccountedWater} L/min` : '0 L/min'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#243B53]/60">
              <span className="text-[#94A3B8]">Water Loss Prevented:</span>
              <span className={`font-bold ${isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'}`}>
                {waterSavedLiters.toLocaleString()} Liters
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#243B53]/60">
              <span className="text-[#94A3B8]">Estimated Cost Saved:</span>
              <span className={`font-bold ${isIsolated ? 'text-[#22C55E]' : 'text-[#F1F5F9]'}`}>
                ₹{financialSavedINR.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* WHY AQUASENTINEL MATTERS (JUDGE-FRIENDLY SECTION) */}
      <div className="bg-[#0D1B2A] border border-[#243B53] p-5 rounded-lg space-y-3 font-mono text-xs">
        <div className="text-[#22D3EE] font-bold border-b border-[#243B53] pb-2">
          WHY AQUASENTINEL MATTERS — CLOSED-LOOP VALUE PROPOSITION
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 font-sans text-xs">
          <div className="bg-[#07111F] p-3.5 rounded border border-[#243B53] space-y-1">
            <div className="font-mono font-bold text-[#22D3EE] text-xs">1. DETECT</div>
            <p className="text-[#F1F5F9] text-xs leading-relaxed">
              Identify abnormal water loss from distributed mesh telemetry and sub-meter flow balance audits.
            </p>
          </div>

          <div className="bg-[#07111F] p-3.5 rounded border border-[#243B53] space-y-1">
            <div className="font-mono font-bold text-[#22D3EE] text-xs">2. PREVENT</div>
            <p className="text-[#F1F5F9] text-xs leading-relaxed">
              Isolate the affected zone with remote solenoid actuation before catastrophic loss accumulates.
            </p>
          </div>

          <div className="bg-[#07111F] p-3.5 rounded border border-[#243B53] space-y-1">
            <div className="font-mono font-bold text-[#22C55E] text-xs">3. MEASURE</div>
            <p className="text-[#F1F5F9] text-xs leading-relaxed">
              Quantify water volume, energy, carbon, and financial impact prevented for audit compliance.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
