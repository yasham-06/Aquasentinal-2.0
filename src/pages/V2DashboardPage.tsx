import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  MapPin, 
  FileText, 
  Settings2, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle, 
  Droplets, 
  Sliders, 
  Leaf, 
  Coins, 
  Lightbulb, 
  ArrowRight, 
  ChevronDown, 
  Gauge, 
  ShieldAlert,
  Cpu,
  Radio,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Area,
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { 
  TelemetryPoint, 
  AIAnalysis, 
  SimulationMode, 
  MeshNodeInfo, 
  RemoteValve, 
  EsgMetrics,
  PageType 
} from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const observed = payload.find((p: any) => p.dataKey === 'ObservedFlow')?.value ?? 43;
    const expected = payload.find((p: any) => p.dataKey === 'ExpectedBaseline')?.value ?? 43;
    const unaccounted = payload.find((p: any) => p.dataKey === 'UnaccountedLoss')?.value ?? 0;
    
    return (
      <div className="bg-[#071421] border border-[#163B55] p-3 rounded-xl shadow-2xl font-mono text-xs z-50 space-y-1">
        <p className="text-[#94A3B8] font-sans font-semibold mb-1 text-[11px] border-b border-[#163B55] pb-1">{label}</p>
        <div className="flex items-center justify-between space-x-4 text-[#22D3EE]">
          <span>Observed:</span>
          <span className="font-bold">{observed} L/min</span>
        </div>
        <div className="flex items-center justify-between space-x-4 text-[#22C55E]">
          <span>Expected:</span>
          <span className="font-bold">{expected} L/min</span>
        </div>
        <div className="flex items-center justify-between space-x-4 text-[#EF4444]">
          <span>Unaccounted:</span>
          <span className="font-bold">{unaccounted > 0 ? `+${unaccounted}` : '0'} L/min</span>
        </div>
      </div>
    );
  }
  return null;
};

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
  detectTriggerCount?: number;
}

type TimeframeOption = '1H' | '6H' | '24H' | '7D';
type MapMetricOption = 'flow' | 'pressure' | 'tank';

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
  detectTriggerCount,
}) => {
  const targetValve = valves.find(v => v.id === 'v-blk-b-02') || valves[1] || valves[0];
  const isTargetValveClosed = targetValve?.status === 'CLOSED';

  const rootNode = nodes[0] || { flowRate: 169 };
  const totalAccountedFlow = isTargetValveClosed ? (48 + 43 + 0 + 35) : (48 + 43 + 43 + 35);
  const unaccountedFlow = Math.max(0, rootNode.flowRate - totalAccountedFlow);
  
  const isLeakActive = (simulationMode === 'LEAK' || hasDifferentialLeak || aiAnalysis.isAnomaly || unaccountedFlow > 5) && !isTargetValveClosed;

  // Dropdown States
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('1H');
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);
  const [selectedMapMetric, setSelectedMapMetric] = useState<MapMetricOption>('flow');
  const [mapMetricDropdownOpen, setMapMetricDropdownOpen] = useState(false);

  const timeframeRef = useRef<HTMLDivElement>(null);
  const mapMetricRef = useRef<HTMLDivElement>(null);
  const verificationRef = useRef<HTMLDivElement>(null);

  // DETECT Focus Ref and Highlight state
  const telemetryRef = useRef<HTMLDivElement>(null);
  const [isDetectHighlighted, setIsDetectHighlighted] = useState(false);
  const prevDetectTriggerCount = useRef<number>(detectTriggerCount || 0);

  const triggerDetectFocus = () => {
    setIsDetectHighlighted(true);
    if (telemetryRef.current) {
      telemetryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const el = document.getElementById('live-telemetry');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setIsDetectHighlighted(false);
    }, 2500);
  };

  useEffect(() => {
    if (detectTriggerCount !== undefined && detectTriggerCount > 0 && detectTriggerCount !== prevDetectTriggerCount.current) {
      prevDetectTriggerCount.current = detectTriggerCount;
      triggerDetectFocus();
    }
  }, [detectTriggerCount]);

  const handleDetectCardClick = () => {
    onNavigate('dashboard');
    triggerDetectFocus();
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeframeRef.current && !timeframeRef.current.contains(event.target as Node)) {
        setTimeframeDropdownOpen(false);
      }
      if (mapMetricRef.current && !mapMetricRef.current.contains(event.target as Node)) {
        setMapMetricDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build LIVE chart data dynamically based on selectedTimeframe and real-time telemetry stream
  const getChartData = () => {
    const liveObserved = isTargetValveClosed 
      ? 43 
      : isLeakActive 
      ? rootNode.flowRate 
      : (latestTelemetry ? latestTelemetry.actualFlow : 43);

    const liveUnaccounted = isTargetValveClosed ? 0 : Math.max(0, liveObserved - 43);

    if (selectedTimeframe === '1H') {
      return telemetryHistory.map((pt, idx) => {
        const isLatest = idx === telemetryHistory.length - 1;
        const observed = isLatest ? liveObserved : pt.actualFlow;
        const unaccounted = isLatest ? liveUnaccounted : Math.max(0, pt.actualFlow - 43);
        return {
          time: pt.timestamp || `10:${15 + idx * 5}`,
          ObservedFlow: observed,
          ExpectedBaseline: 43,
          UnaccountedLoss: unaccounted,
        };
      });
    } else if (selectedTimeframe === '6H') {
      const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'];
      return times.map((t, idx) => {
        const isRecent = idx >= times.length - 2;
        const observed = isRecent ? liveObserved : (42 + (idx % 3));
        const unaccounted = isRecent ? liveUnaccounted : 0;
        return { time: t, ObservedFlow: observed, ExpectedBaseline: 43, UnaccountedLoss: unaccounted };
      });
    } else if (selectedTimeframe === '24H') {
      const times = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      return times.map((t, idx) => {
        const isRecent = idx >= times.length - 2;
        const observed = isRecent ? liveObserved : (43 + (idx % 2));
        const unaccounted = isRecent ? liveUnaccounted : 0;
        return { time: t, ObservedFlow: observed, ExpectedBaseline: 43, UnaccountedLoss: unaccounted };
      });
    } else {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
      return days.map((d, idx) => {
        const isToday = idx === days.length - 1;
        const observed = isToday ? liveObserved : (43 + (idx % 3) - 1);
        const unaccounted = isToday ? liveUnaccounted : 0;
        return { time: d, ObservedFlow: observed, ExpectedBaseline: 43, UnaccountedLoss: unaccounted };
      });
    }
  };

  const chartData = getChartData();

  // Workflow verify button action: scroll to audit/verification section
  const handleVerifyClick = () => {
    if (verificationRef.current) {
      verificationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Node display values based on selected map metric
  const getNodeValue = (nodeId: string) => {
    if (selectedMapMetric === 'flow') {
      if (nodeId === 'root') return `${rootNode.flowRate} L/min`;
      if (nodeId === 'blk-a') return '42 L/min';
      if (nodeId === 'blk-b') return isTargetValveClosed ? '0 L/min' : isLeakActive ? '94 L/min' : '43 L/min';
      if (nodeId === 'blk-c') return '38 L/min';
      if (nodeId === 'blk-d') return '26 L/min';
    } else if (selectedMapMetric === 'pressure') {
      if (nodeId === 'root') return '4.2 bar';
      if (nodeId === 'blk-a') return '4.0 bar';
      if (nodeId === 'blk-b') return isLeakActive ? '4.8 bar' : '3.9 bar';
      if (nodeId === 'blk-c') return '3.9 bar';
      if (nodeId === 'blk-d') return '3.8 bar';
    } else if (selectedMapMetric === 'tank') {
      if (nodeId === 'root') return '74%';
      if (nodeId === 'blk-a') return '100%';
      if (nodeId === 'blk-b') return isLeakActive ? '45%' : '100%';
      if (nodeId === 'blk-c') return '100%';
      if (nodeId === 'blk-d') return '100%';
    }
    return '';
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#F8FAFC]">
      
      {/* 1. HERO TITLE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1A28] border border-[#183C5A] p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#22D3EE] font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            <span>Water Network Control Operations</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            Predict the leak. <span className="text-[#22D3EE]">Protect the network.</span>
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm mt-1 font-sans">
            Real-time differential flow telemetry, AI diagnostic reasoning, and closed-loop isolation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onSimulateLeak}
            className={`px-4 py-2.5 rounded-xl font-display text-xs font-bold transition-all shadow-md flex items-center space-x-2 ${
              isLeakActive 
                ? 'bg-[#EF4444] text-white shadow-[#EF4444]/30 animate-pulse'
                : 'bg-[#22D3EE] text-[#06101E] hover:bg-[#06B6D4] shadow-[#22D3EE]/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isLeakActive ? 'Leak Active (Simulating)' : 'Simulate Leak'}</span>
          </button>
        </div>
      </div>

      {/* 2. WORKFLOW STRIP (6 FUNCTIONAL CARDS WITH CLICK HANDLERS) matching reference design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Step 1: DETECT */}
        <div 
          onClick={handleDetectCardClick}
          className={`bg-[#0D2032] border p-3.5 rounded-2xl flex items-center justify-between group hover:border-[#22D3EE] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md ${
            isDetectHighlighted ? 'border-[#22D3EE] ring-2 ring-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.35)]' : 'border-[#183C5A]'
          }`}
          title="Focus Live Detection Telemetry"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-[#06101E] transition-colors flex-shrink-0 font-mono text-xs font-bold">
              01
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-display font-bold text-[#22D3EE] uppercase tracking-wider">DETECT</div>
              <div className="text-[10px] text-[#94A3B8] truncate">Real-time flow</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#183C5A] group-hover:text-[#22D3EE] transition-colors hidden lg:block flex-shrink-0 ml-1" />
        </div>

        {/* Step 2: LOCATE */}
        <div 
          onClick={() => onNavigate('topology')}
          className="bg-[#0D2032] border border-[#183C5A] p-3.5 rounded-2xl flex items-center justify-between group hover:border-[#22D3EE] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md"
          title="Go to Campus Mesh Topology"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-[#06101E] transition-colors flex-shrink-0 font-mono text-xs font-bold">
              02
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-display font-bold text-[#22D3EE] uppercase tracking-wider">LOCATE</div>
              <div className="text-[10px] text-[#94A3B8] truncate">Block B zone</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#183C5A] group-hover:text-[#22D3EE] transition-colors hidden lg:block flex-shrink-0 ml-1" />
        </div>

        {/* Step 3: EXPLAIN */}
        <div 
          onClick={() => onNavigate('predictive')}
          className="bg-[#0D2032] border border-[#183C5A] p-3.5 rounded-2xl flex items-center justify-between group hover:border-[#22D3EE] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md"
          title="Go to Predictive AI Diagnostics"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-[#06101E] transition-colors flex-shrink-0 font-mono text-xs font-bold">
              03
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-display font-bold text-[#22D3EE] uppercase tracking-wider">EXPLAIN</div>
              <div className="text-[10px] text-[#94A3B8] truncate">AI explanation</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#183C5A] group-hover:text-[#22D3EE] transition-colors hidden lg:block flex-shrink-0 ml-1" />
        </div>

        {/* Step 4: ACTUATE */}
        <div 
          onClick={() => onNavigate('valves')}
          className="bg-[#0D2032] border border-[#183C5A] p-3.5 rounded-2xl flex items-center justify-between group hover:border-[#22D3EE] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md"
          title="Go to Remote Valve Control"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-[#06101E] transition-colors flex-shrink-0 font-mono text-xs font-bold">
              04
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-display font-bold text-[#22D3EE] uppercase tracking-wider">ACTUATE</div>
              <div className="text-[10px] text-[#94A3B8] truncate">Valve V-02</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#183C5A] group-hover:text-[#22D3EE] transition-colors hidden lg:block flex-shrink-0 ml-1" />
        </div>

        {/* Step 5: VERIFY */}
        <div 
          onClick={handleVerifyClick}
          className="bg-[#0D2032] border border-[#183C5A] p-3.5 rounded-2xl flex items-center justify-between group hover:border-[#22D3EE] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md"
          title="Verify Post-Isolation System Recovery"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22C55E] group-hover:bg-[#22C55E] group-hover:text-[#06101E] transition-colors flex-shrink-0 font-mono text-xs font-bold">
              05
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-display font-bold text-[#22C55E] uppercase tracking-wider">VERIFY</div>
              <div className="text-[10px] text-[#94A3B8] truncate">0 L/min audit</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#183C5A] group-hover:text-[#22D3EE] transition-colors hidden lg:block flex-shrink-0 ml-1" />
        </div>

        {/* Step 6: QUANTIFY */}
        <div 
          onClick={() => onNavigate('esg')}
          className="bg-[#0D2032] border border-[#183C5A] p-3.5 rounded-2xl flex items-center justify-between group hover:border-[#22D3EE] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md"
          title="Go to ESG Carbon & Financial Audit"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22C55E] group-hover:bg-[#22C55E] group-hover:text-[#06101E] transition-colors flex-shrink-0 font-mono text-xs font-bold">
              06
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-display font-bold text-[#22C55E] uppercase tracking-wider">QUANTIFY</div>
              <div className="text-[10px] text-[#94A3B8] truncate">18,360 L saved</div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. THREE-COLUMN COMMAND CENTER GRID matching reference layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: HERO INFORMATION CARD & METRIC BREAKDOWN (4 cols) matching reference "Overall Information" card */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* HERO FOCAL CARD (Reference Design "Overall Information" dark card) */}
          <div className="hero-dark-card p-6 rounded-3xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#183C5A]/60 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#22D3EE] font-bold uppercase tracking-wider">Telemetry Overview</span>
                <h2 className="font-display text-lg font-extrabold text-[#F8FAFC]">Differential Flow Balance</h2>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#0D2032] border border-[#183C5A] flex items-center justify-center text-[#22D3EE]">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            {/* Giant Hero Metric Numbers */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#94A3B8] uppercase">Current Main Flow Status</div>
              <div className="flex items-baseline space-x-3">
                <span className={`font-display text-4xl lg:text-5xl font-extrabold tracking-tight ${
                  isLeakActive ? 'text-[#EF4444]' : 'text-[#F8FAFC]'
                }`}>
                  {isLeakActive ? `+${unaccountedFlow}` : `${rootNode.flowRate}`}
                </span>
                <span className="text-sm font-mono text-[#94A3B8]">L/min</span>
                <span className={`ml-auto px-2.5 py-1 text-xs font-mono font-bold rounded-full border ${
                  isLeakActive
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 animate-pulse'
                    : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                }`}>
                  {isLeakActive ? 'LEAK BREACH' : 'BASELINE NORMAL'}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                {isLeakActive 
                  ? 'Differential breach detected above 64.5 L/min threshold in Block B.' 
                  : 'Main supply matches accounted building consumption (Baseline 43 L/min).'
                }
              </p>
            </div>

            {/* 3 NESTED SUB-WIDGET CARDS inside Hero Focal Card (matching reference inner pills) */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              
              {/* Mini Card 1: Inflow */}
              <div className="bg-[#0B1A28] border border-[#183C5A] p-3 rounded-2xl text-center space-y-1">
                <div className="w-6 h-6 mx-auto rounded-lg bg-[#15334E] flex items-center justify-center text-[#22D3EE]">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div className="font-display font-extrabold text-sm text-[#F8FAFC]">{rootNode.flowRate}</div>
                <div className="text-[10px] text-[#94A3B8] truncate">Main Inflow</div>
              </div>

              {/* Mini Card 2: Accounted */}
              <div className="bg-[#0B1A28] border border-[#183C5A] p-3 rounded-2xl text-center space-y-1">
                <div className="w-6 h-6 mx-auto rounded-lg bg-[#15334E] flex items-center justify-center text-[#22C55E]">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="font-display font-extrabold text-sm text-[#22C55E]">{totalAccountedFlow}</div>
                <div className="text-[10px] text-[#94A3B8] truncate">Accounted</div>
              </div>

              {/* Mini Card 3: Unaccounted */}
              <div className="bg-[#0B1A28] border border-[#183C5A] p-3 rounded-2xl text-center space-y-1">
                <div className="w-6 h-6 mx-auto rounded-lg bg-[#15334E] flex items-center justify-center text-[#EF4444]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className={`font-display font-extrabold text-sm ${isLeakActive ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                  {isLeakActive ? `+${unaccountedFlow}` : '0'}
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate">Unaccounted</div>
              </div>

            </div>

          </div>

          {/* SECONDARY IMPACT CARDS (2 Column Grid) */}
          <div className="grid grid-cols-2 gap-3.5">
            <div 
              onClick={() => onNavigate('esg')}
              className="bg-[#0D2032] border border-[#183C5A] p-4 rounded-3xl space-y-2 hover:border-[#22C55E]/60 transition-all cursor-pointer shadow-md group"
            >
              <div className="flex items-center justify-between">
                <Leaf className="w-5 h-5 text-[#22C55E]" />
                <span className="text-[10px] font-mono text-[#64748B]">ESG Impact</span>
              </div>
              <div className="font-display font-extrabold text-xl text-[#22C55E]">18,360 L</div>
              <div className="text-[11px] text-[#94A3B8] leading-tight">
                Water Loss Prevented <span className="text-[#64748B] block">(6h projected containment)</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('esg')}
              className="bg-[#0D2032] border border-[#183C5A] p-4 rounded-3xl space-y-2 hover:border-[#22D3EE]/60 transition-all cursor-pointer shadow-md group"
            >
              <div className="flex items-center justify-between">
                <Coins className="w-5 h-5 text-[#22D3EE]" />
                <span className="text-[10px] font-mono text-[#64748B]">Savings</span>
              </div>
              <div className="font-display font-extrabold text-xl text-[#22D3EE]">₹826.20</div>
              <div className="text-[11px] text-[#94A3B8] leading-tight">
                Financial Savings <span className="text-[#64748B] block">(₹45/kL municipal rate)</span>
              </div>
            </div>
          </div>

          {/* VALVE & ZONE STATUS CARD */}
          <div className="bg-[#0D2032] border border-[#183C5A] p-4 rounded-3xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#040D17] border border-[#183C5A] flex items-center justify-center text-[#22D3EE]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-extrabold text-base text-[#F8FAFC]">Solenoid Valve V-02</div>
                <div className="text-xs text-[#94A3B8]">
                  {isTargetValveClosed ? 'Zone Isolated · Closed' : 'Isolation Recommended · Block B'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('valves')}
              className="p-2.5 rounded-xl bg-[#040D17] hover:bg-[#22D3EE] text-[#22D3EE] hover:text-[#06101E] border border-[#183C5A] transition-colors"
              title="Go to Valve Control"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* CENTER COLUMN: CAMPUS NETWORK MAP & AI RECOMMENDATION (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* CAMPUS NETWORK MAP CARD matching reference */}
          <div className="bg-[#0D2032] border border-[#183C5A] p-5 rounded-3xl space-y-4 shadow-xl">
            
            {/* Header with Functional Metric Dropdown */}
            <div className="flex items-center justify-between border-b border-[#183C5A]/60 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#22D3EE]" />
                <div>
                  <h3 className="font-display font-bold text-sm text-[#F8FAFC]">Campus Network Map</h3>
                  <p className="text-[10px] text-[#94A3B8]">Sub-meter topology status</p>
                </div>
              </div>
              
              {/* FUNCTIONAL MAP METRIC DROPDOWN */}
              <div className="relative" ref={mapMetricRef}>
                <button 
                  onClick={() => setMapMetricDropdownOpen(!mapMetricDropdownOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#040D17] hover:bg-[#15334E] border border-[#183C5A] text-xs text-[#F8FAFC] font-mono transition-colors"
                >
                  <span>
                    {selectedMapMetric === 'flow' ? 'Flow Rate (L/min)' : selectedMapMetric === 'pressure' ? 'Pressure (bar)' : 'Tank Level (%)'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                </button>

                {mapMetricDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-[#040D17] border border-[#183C5A] rounded-2xl shadow-2xl z-30 py-1 text-xs font-mono">
                    <button
                      onClick={() => { setSelectedMapMetric('flow'); setMapMetricDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedMapMetric === 'flow' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>Flow Rate (L/min)</span>
                      {selectedMapMetric === 'flow' && <Check className="w-3.5 h-3.5 text-[#22D3EE]" />}
                    </button>
                    <button
                      onClick={() => { setSelectedMapMetric('pressure'); setMapMetricDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedMapMetric === 'pressure' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>Pressure (bar)</span>
                      {selectedMapMetric === 'pressure' && <Check className="w-3.5 h-3.5 text-[#22D3EE]" />}
                    </button>
                    <button
                      onClick={() => { setSelectedMapMetric('tank'); setMapMetricDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedMapMetric === 'tank' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>Tank Level (%)</span>
                      {selectedMapMetric === 'tank' && <Check className="w-3.5 h-3.5 text-[#22D3EE]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Spatial Network Topology Graphic */}
            <div className="bg-[#040D17] border border-[#183C5A] rounded-2xl p-5 relative overflow-hidden space-y-6">
              
              {/* Subtle background grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#183C5A_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

              {/* ROOT SUPPLY NODE */}
              <div className="flex justify-center relative z-10">
                <div className="bg-[#0D2032] border border-[#22D3EE]/50 px-4 py-2 rounded-xl flex items-center space-x-2.5 shadow-lg shadow-[#22D3EE]/10">
                  <div className="w-6 h-6 rounded-full bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Main Supply</div>
                    <div className="text-xs font-display font-bold text-[#22D3EE]">
                      {getNodeValue('root')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Splitter Tree Graphics */}
              <div className="relative h-8 max-w-sm mx-auto z-10">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 30">
                  {/* Vertical Trunk */}
                  <line x1="150" y1="0" x2="150" y2="12" stroke="#22D3EE" strokeWidth="2" />
                  {/* Horizontal Bar */}
                  <line x1="37" y1="12" x2="263" y2="12" stroke="#22D3EE" strokeWidth="2" />
                  {/* 4 Downward Lines */}
                  <line x1="37" y1="12" x2="37" y2="30" stroke="#22D3EE" strokeWidth="2" />
                  <line x1="112" y1="12" x2="112" y2="30" stroke={isLeakActive ? "#EF4444" : "#22D3EE"} strokeWidth={isLeakActive ? "3" : "2"} />
                  <line x1="187" y1="12" x2="187" y2="30" stroke="#22D3EE" strokeWidth="2" />
                  <line x1="263" y1="12" x2="263" y2="30" stroke="#22D3EE" strokeWidth="2" />
                </svg>
              </div>

              {/* 4 BRANCH BUILDINGS GRID */}
              <div className="grid grid-cols-4 gap-2 relative z-10 font-mono text-center">
                
                {/* Block A */}
                <div className="bg-[#0D2032] border border-[#183C5A] p-2.5 rounded-xl space-y-1">
                  <div className="w-5 h-5 mx-auto rounded-full bg-[#15334E] flex items-center justify-center text-[#22D3EE]">
                    <Droplets className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] font-bold text-[#F8FAFC]">Block A</div>
                  <div className="text-[10px] text-[#94A3B8]">{getNodeValue('blk-a')}</div>
                </div>

                {/* Block B (Target Anomaly Node) */}
                <div className={`p-2.5 rounded-xl space-y-1 border transition-all ${
                  isLeakActive
                    ? 'bg-[#0D2032] border-[#EF4444] shadow-lg shadow-[#EF4444]/20 animate-pulse'
                    : isTargetValveClosed
                    ? 'bg-[#0D2032] border-[#22D3EE]/60'
                    : 'bg-[#0D2032] border-[#183C5A]'
                }`}>
                  <div className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center ${
                    isLeakActive ? 'bg-[#EF4444] text-white' : 'bg-[#15334E] text-[#22D3EE]'
                  }`}>
                    {isLeakActive ? <AlertTriangle className="w-3 h-3" /> : <Droplets className="w-3 h-3" />}
                  </div>
                  <div className={`text-[11px] font-bold ${isLeakActive ? 'text-[#EF4444]' : 'text-[#F8FAFC]'}`}>Block B</div>
                  <div className={`text-[10px] font-bold ${isLeakActive ? 'text-[#EF4444]' : isTargetValveClosed ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`}>
                    {getNodeValue('blk-b')}
                  </div>
                </div>

                {/* Block C */}
                <div className="bg-[#0D2032] border border-[#183C5A] p-2.5 rounded-xl space-y-1">
                  <div className="w-5 h-5 mx-auto rounded-full bg-[#15334E] flex items-center justify-center text-[#22D3EE]">
                    <Droplets className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] font-bold text-[#F8FAFC]">Block C</div>
                  <div className="text-[10px] text-[#94A3B8]">{getNodeValue('blk-c')}</div>
                </div>

                {/* Block D / Tank */}
                <div className="bg-[#0D2032] border border-[#183C5A] p-2.5 rounded-xl space-y-1">
                  <div className="w-5 h-5 mx-auto rounded-full bg-[#15334E] flex items-center justify-center text-[#22D3EE]">
                    <Droplets className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] font-bold text-[#F8FAFC]">Block D</div>
                  <div className="text-[10px] text-[#94A3B8]">{getNodeValue('blk-d')}</div>
                </div>

              </div>

              {/* Legend Footer */}
              <div className="flex items-center justify-center space-x-4 text-[10px] font-mono text-[#94A3B8] pt-2 border-t border-[#183C5A]/60 relative z-10">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span>Normal Flow</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span>Anomaly</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-0.5 bg-[#22D3EE]" />
                  <span>Sub-Meter Mesh</span>
                </div>
              </div>

            </div>

          </div>

          {/* AI RECOMMENDATION CARD matching reference */}
          <div className="bg-[#0B1A28] border border-[#22D3EE]/40 p-4 rounded-3xl flex items-center justify-between space-x-4 shadow-xl">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] flex-shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs text-[#22D3EE] uppercase tracking-wider">AI Recommendation</div>
                <p className="text-xs text-[#F8FAFC] truncate mt-0.5">
                  {isLeakActive
                    ? 'Isolate Valve V-02 to stop the leak in Block B'
                    : isTargetValveClosed
                    ? 'Incident Resolved. Flow imbalance verified at 0 L/min'
                    : 'Network operating within expected flow range'
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('valves')}
              className="px-3.5 py-2 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#06101E] font-display font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 flex-shrink-0 shadow-md shadow-[#22D3EE]/20"
            >
              <span>Actuate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: ALERTS, TREND CHART & METRICS (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* ACTIVE ALERTS CARD matching reference */}
          <div className="bg-[#0D2032] border border-[#183C5A] p-4 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#183C5A]/60 pb-2">
              <h3 className="font-display font-bold text-sm text-[#F8FAFC]">Active Alerts</h3>
              <button onClick={() => onNavigate('alerts')} className="text-xs text-[#38BDF8] hover:underline">
                View All
              </button>
            </div>

            {isLeakActive ? (
              <div 
                onClick={() => onNavigate('alerts')}
                className="bg-[#040D17] border border-[#EF4444]/60 p-3.5 rounded-2xl space-y-2 hover:border-[#EF4444] cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] flex-shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs text-[#EF4444]">Leak Detected</span>
                      <span className="text-[10px] text-[#94A3B8]">2 min ago</span>
                    </div>
                    <div className="text-xs text-[#F8FAFC]">Block B – Floor 2</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#183C5A]/50 text-[11px] font-mono">
                  <div>
                    <span className="text-[#94A3B8]">Severity</span>
                    <div className="font-bold text-[#EF4444]">High</div>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">Deviation</span>
                    <div className="font-bold text-[#EF4444]">+51 L/min</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-[#040D17] border border-[#183C5A] rounded-2xl text-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-[#22C55E] mx-auto" />
                <div className="text-xs font-bold text-[#22C55E]">No Active Critical Alerts</div>
                <div className="text-[10px] text-[#94A3B8]">Network Operating Normally</div>
              </div>
            )}
          </div>

          {/* FLOW TREND (L/min) CHART CARD matching reference */}
          <div 
            id="live-telemetry"
            ref={telemetryRef}
            className={`bg-[#0D2032] border p-5 rounded-3xl space-y-3.5 transition-all duration-500 shadow-xl ${
              isDetectHighlighted 
                ? 'border-[#22D3EE] ring-2 ring-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.35)]' 
                : 'border-[#183C5A]'
            }`}
          >
            
            {/* Detection Active Status Banner */}
            {isDetectHighlighted && (
              <div className="bg-[#040D17] border border-[#22D3EE]/60 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fade-in text-xs font-mono">
                <div className="flex items-center space-x-2.5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] animate-ping absolute" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] relative" />
                  </div>
                  <div>
                    <span className="text-[#22D3EE] font-bold uppercase tracking-wider text-[11px]">
                      [DETECTION ACTIVE]
                    </span>
                    <span className="text-[#F8FAFC] ml-2 text-[11px]">
                      {isLeakActive ? 'ANOMALY DETECTED — High Risk Flow Imbalance' : 'Detection Status: Monitoring live telemetry...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Header with Functional Timeframe Dropdown */}
            <div className="flex items-center justify-between border-b border-[#183C5A]/60 pb-2">
              <div className="flex items-center space-x-3">
                <h3 className="font-display font-bold text-sm text-[#F8FAFC]">Flow Trend (L/min)</h3>
              </div>
              
              {/* TIMEFRAME DROPDOWN */}
              <div className="relative" ref={timeframeRef}>
                <button 
                  onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#040D17] hover:bg-[#15334E] border border-[#183C5A] text-[11px] text-[#F8FAFC] font-mono transition-colors"
                >
                  <span>
                    {selectedTimeframe === '1H' ? 'Last 1 Hour' : selectedTimeframe === '6H' ? 'Last 6 Hours' : selectedTimeframe === '24H' ? 'Last 24 Hours' : 'Last 7 Days'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                </button>

                {timeframeDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-[#040D17] border border-[#183C5A] rounded-2xl shadow-2xl z-30 py-1 text-xs font-mono">
                    <button
                      onClick={() => { setSelectedTimeframe('1H'); setTimeframeDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedTimeframe === '1H' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>1 Hour</span>
                      {selectedTimeframe === '1H' && <Check className="w-3 h-3 text-[#22D3EE]" />}
                    </button>
                    <button
                      onClick={() => { setSelectedTimeframe('6H'); setTimeframeDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedTimeframe === '6H' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>6 Hours</span>
                      {selectedTimeframe === '6H' && <Check className="w-3 h-3 text-[#22D3EE]" />}
                    </button>
                    <button
                      onClick={() => { setSelectedTimeframe('24H'); setTimeframeDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedTimeframe === '24H' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>24 Hours</span>
                      {selectedTimeframe === '24H' && <Check className="w-3 h-3 text-[#22D3EE]" />}
                    </button>
                    <button
                      onClick={() => { setSelectedTimeframe('7D'); setTimeframeDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#15334E] transition-colors ${selectedTimeframe === '7D' ? 'text-[#22D3EE] font-bold' : 'text-[#94A3B8]'}`}
                    >
                      <span>7 Days</span>
                      {selectedTimeframe === '7D' && <Check className="w-3 h-3 text-[#22D3EE]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS ROW ABOVE CHART (OUTSIDE PLOTTING AREA) */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span className="font-semibold">Baseline 43 L/min</span>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
                <span className="w-3 h-0 border-t-2 border-dashed border-[#EF4444]" />
                <span className="font-semibold">Threshold 64.5 L/min</span>
              </div>

              {isLeakActive ? (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                  <span className="font-bold">Anomaly · Block B</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                  <span>Normal</span>
                </div>
              )}
            </div>

            {/* Recharts Water Flow Composed Chart (ZERO TEXT LABELS INSIDE PLOT) */}
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorObserved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorUnaccounted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#183C5A" opacity={0.5} />
                  
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748B" 
                    tick={{ fill: '#94A3B8', fontSize: 9 }} 
                    interval={selectedTimeframe === '1H' ? 1 : selectedTimeframe === '6H' ? 1 : selectedTimeframe === '24H' ? 2 : 2}
                  />
                  <YAxis 
                    domain={[0, 110]} 
                    ticks={[0, 30, 60, 90, 110]}
                    stroke="#64748B" 
                    tick={{ fill: '#94A3B8', fontSize: 9 }} 
                    tickFormatter={(v) => `${v}`}
                  />
                  
                  {/* Clean Reference Lines (NO TEXT LABELS INSIDE PLOT AREA) */}
                  <ReferenceLine y={64.5} stroke="#EF4444" strokeDasharray="4 4" />
                  <ReferenceLine y={43} stroke="#22C55E" strokeDasharray="3 3" />

                  <Tooltip content={<CustomTooltip />} />

                  {/* Red Unaccounted Loss Translucent Area */}
                  <Area 
                    type="monotone" 
                    dataKey="UnaccountedLoss" 
                    name="Unaccounted Loss" 
                    stroke="#EF4444" 
                    strokeWidth={1.5} 
                    fill="url(#colorUnaccounted)" 
                    isAnimationActive={false} 
                  />

                  {/* Cyan Observed Flow Water Waveform Area */}
                  <Area 
                    type="monotone" 
                    dataKey="ObservedFlow" 
                    name="Observed Flow" 
                    stroke="#22D3EE" 
                    strokeWidth={2.5} 
                    fill="url(#colorObserved)" 
                    dot={{ r: 2.5, fill: '#22D3EE' }} 
                    isAnimationActive={false} 
                  />

                  {/* Green Expected Baseline Line */}
                  <Line 
                    type="monotone" 
                    dataKey="ExpectedBaseline" 
                    name="Expected / Accounted" 
                    stroke="#22C55E" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend Below Plot */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-[#94A3B8] pt-2 border-t border-[#183C5A]/50">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                <span className="text-[#F8FAFC]">Observed Flow</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span>Expected Baseline</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span>Unaccounted Loss</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. RECENT ACTIVITY & VERIFICATION AUDIT TABLE matching reference card layout */}
      <div className="bg-[#0D2032] border border-[#183C5A] p-5 rounded-3xl space-y-4 shadow-xl" ref={verificationRef}>
        <div className="flex items-center justify-between border-b border-[#183C5A]/60 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
            <h3 className="font-display font-bold text-sm text-[#F8FAFC]">Recent Activity & Post-Isolation Audit</h3>
          </div>
          <button onClick={() => onNavigate('tickets')} className="text-xs text-[#38BDF8] hover:underline">
            View All Reports
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#183C5A]/60 text-[11px] font-mono">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#183C5A]/40">
              {isTargetValveClosed && (
                <tr className="bg-[#22D3EE]/10 border-l-2 border-[#22D3EE] transition-colors">
                  <td className="py-3 px-3 text-[#22D3EE] font-mono text-[11px] font-bold">Just now</td>
                  <td className="py-3 px-3 text-[#F8FAFC] font-bold">Valve V-02 Closed. Zone Isolated & Flow Balanced (0 L/min)</td>
                  <td className="py-3 px-3 text-[#22D3EE] font-semibold">Block B – Floor 2</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              )}
              <tr className="hover:bg-[#15334E]/40 transition-colors">
                <td className="py-3 px-3 text-[#94A3B8] font-mono text-[11px]">10:28 AM</td>
                <td className="py-3 px-3 text-[#F8FAFC] font-medium">Leak detected (differential flow)</td>
                <td className="py-3 px-3 text-[#94A3B8]">Block B – Floor 2</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    <span>High</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#15334E]/40 transition-colors">
                <td className="py-3 px-3 text-[#94A3B8] font-mono text-[11px]">10:26 AM</td>
                <td className="py-3 px-3 text-[#F8FAFC] font-medium">Pressure variance +18.4%</td>
                <td className="py-3 px-3 text-[#94A3B8]">Block B – Floor 2</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    <span>High</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#15334E]/40 transition-colors">
                <td className="py-3 px-3 text-[#94A3B8] font-mono text-[11px]">10:25 AM</td>
                <td className="py-3 px-3 text-[#F8FAFC] font-medium">AI recommendation: Isolate V-02</td>
                <td className="py-3 px-3 text-[#94A3B8]">Block B</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    <span>Pending</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#15334E]/40 transition-colors">
                <td className="py-3 px-3 text-[#94A3B8] font-mono text-[11px]">10:20 AM</td>
                <td className="py-3 px-3 text-[#F8FAFC] font-medium">Flow normalized</td>
                <td className="py-3 px-3 text-[#94A3B8]">Block A</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>Stable</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
