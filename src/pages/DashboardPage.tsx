import React, { useState } from 'react';
import { 
  BuildingInfo, 
  TelemetryPoint, 
  AlertItem, 
  TicketItem, 
  SystemMetrics, 
  AIAnalysis, 
  SimulationMode,
  PageType
} from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { 
  Droplets, 
  AlertTriangle, 
  Activity, 
  Wrench, 
  Gauge, 
  Thermometer, 
  Building2, 
  IndianRupee, 
  Check,
  Radio,
  Sliders,
  BrainCircuit,
  TrendingDown
} from 'lucide-react';

import { TelemetryService } from '../services/telemetryService';

interface DashboardPageProps {
  metrics: SystemMetrics;
  buildings: BuildingInfo[];
  telemetryHistory: TelemetryPoint[];
  latestTelemetry: TelemetryPoint;
  aiAnalysis: AIAnalysis;
  simulationMode: SimulationMode;
  onNavigate: (page: PageType) => void;
  onCreateTicket: () => TicketItem;
  onSimulateLeak: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  buildings,
  telemetryHistory,
  latestTelemetry,
  aiAnalysis,
  simulationMode,
  onNavigate,
  onCreateTicket,
  onSimulateLeak,
}) => {
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [lastCreatedTicket, setLastCreatedTicket] = useState<TicketItem | null>(null);

  const activeChartData = timeframe === '1h' 
    ? telemetryHistory 
    : TelemetryService.getTelemetryHistoryForRange(timeframe);

  const samplingLabel = timeframe === '1h'
    ? 'Sampling: 1.0s real-time stream'
    : timeframe === '6h'
    ? 'Sampling: 15-min intervals (SIMULATED HISTORICAL TELEMETRY)'
    : timeframe === '24h'
    ? 'Sampling: 1-hour intervals (SIMULATED HISTORICAL TELEMETRY)'
    : 'Sampling: Daily averages (SIMULATED HISTORICAL TELEMETRY)';

  const chartSubtitle = timeframe === '1h'
    ? 'Live 1-second telemetry stream vs baseline and 1.5× anomaly threshold'
    : `Simulated historical telemetry dataset (${timeframe.toUpperCase()}) vs 1.5× anomaly threshold`;

  const handleCreateTicketClick = () => {
    const ticket = onCreateTicket();
    setLastCreatedTicket(ticket);
  };

  const getStatusBadge = (status: BuildingInfo['status']) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Normal</span>
          </span>
        );
      case 'Elevated':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Elevated</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Critical</span>
          </span>
        );
    }
  };

  const excessFlow = Math.max(0, latestTelemetry.actualFlow - latestTelemetry.expectedFlow);
  const loss15m = Math.round(excessFlow * 15);

  return (
    <div className="space-y-5 pb-12 font-sans text-slate-100">
      
      {/* CONTROL CENTER TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Facility Water Operations Control Center
            </h1>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Campus Main Feed · Zone B
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous hydraulic monitoring, anomaly baseline evaluation, and maintenance dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSimulateLeak}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
              simulationMode === 'LEAK' || aiAnalysis.isAnomaly
                ? 'bg-rose-600 text-white border border-rose-400 shadow-sm'
                : 'bg-rose-950/90 hover:bg-rose-900 text-rose-300 border border-rose-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-300" />
            <span>{simulationMode === 'LEAK' ? 'LEAK SIMULATION RUNNING' : 'SIMULATE LEAK'}</span>
          </button>

          <button
            onClick={() => onNavigate('monitoring')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Water Systems</span>
          </button>
        </div>
      </div>

      {/* TOP KEY METRICS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Today's Consumption</span>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {metrics.todayConsumptionL.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Aggregated campus meter</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Water Saved (Net)</span>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {metrics.waterSavedL.toLocaleString()} <span className="text-xs font-normal text-emerald-300">Liters</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Early anomaly intervention</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Active System Alarms</span>
          <div className="text-xl font-bold text-white mt-1 font-mono flex items-center justify-between">
            <span>{aiAnalysis.isAnomaly ? metrics.activeAlertsCount + 1 : metrics.activeAlertsCount}</span>
            {aiAnalysis.isAnomaly && (
              <span className="text-xs font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800">
                Critical Leak
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Block B (Floor 2) & Block D</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Sensor Network Health</span>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {metrics.systemEfficiencyPct}%
          </div>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">4 of 4 telemetry nodes online</span>
        </div>

      </div>

      {/* CRITICAL ALARM BANNER (WHEN ANOMALY IS ACTIVE) */}
      {(aiAnalysis.isAnomaly || simulationMode === 'LEAK') && (
        <div className="bg-rose-950/90 border border-rose-600 rounded-lg p-4 text-slate-100 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0 animate-pulse" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-rose-200">
                    CRITICAL WATER ANOMALY — BLOCK B (FLOOR 2 WASHROOMS & UTILITY LINE)
                  </h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-rose-700 text-white uppercase">
                    Active Leak
                  </span>
                </div>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  Flow rate is <strong>{(latestTelemetry.actualFlow / latestTelemetry.expectedFlow).toFixed(1)}× baseline</strong>. Sustained deviation: 15 min (simulated).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded border border-rose-900/60 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">CURRENT</span>
                <span className="font-bold text-rose-400">{latestTelemetry.actualFlow} L/m</span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <span className="text-slate-500 text-[10px] block">BASELINE</span>
                <span className="text-slate-300">{latestTelemetry.expectedFlow} L/m</span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <span className="text-slate-500 text-[10px] block">DEVIATION</span>
                <span className="text-rose-400">+{aiAnalysis.deviationPct}%</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CENTERPIECE: REAL-TIME FLOW CHART + CONTEXTUAL NODE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* DOMINANT WATER FLOW CHART (2 COLS) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-lg p-5 border border-slate-800 flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Real-time water consumption & anomaly threshold tracking</span>
              </h2>
              <p className="text-xs text-slate-400">{chartSubtitle}</p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
              {(['1h', '6h', '24h', '7d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    timeframe === t 
                      ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Main Flow Visualization */}
          <div className="h-80 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualFlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={latestTelemetry.actualFlow > 60 && timeframe === '1h' ? '#ef4444' : '#06b6d4'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={latestTelemetry.actualFlow > 60 && timeframe === '1h' ? '#ef4444' : '#06b6d4'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" L/m" domain={[30, 110]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                
                {/* 1.5x Baseline Anomaly Threshold Line */}
                <ReferenceLine 
                  y={64.5} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  label={{ value: 'Anomaly Threshold (64.5 L/m)', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} 
                />

                {/* Expected Baseline Line */}
                <Area 
                  type="monotone" 
                  dataKey="expectedFlow" 
                  name="Expected Baseline (43 L/min)" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="none" 
                />

                {/* Actual Measured Telemetry Line */}
                <Area 
                  type="monotone" 
                  dataKey="actualFlow" 
                  name="Measured Flow (L/min)" 
                  stroke={latestTelemetry.actualFlow > 60 && timeframe === '1h' ? '#ef4444' : '#06b6d4'} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#actualFlowGrad)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Baseline: 43 L/min</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400">Threshold: 64.5 L/min</span>
            </span>
            <span>{samplingLabel}</span>
          </div>

        </div>

        {/* CONTEXTUAL NODE & SENSOR DETAIL PANEL (1 COL) */}
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Target Sensor Node</h3>
                <p className="text-[11px] text-slate-400 font-mono">ID: SN-BLK-B-02</p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Block B · Floor 2
              </span>
            </div>

            <div className="space-y-3">
              
              {/* Flow Rate */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
                  <span>Current Flow Rate</span>
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold font-mono ${latestTelemetry.actualFlow > 60 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {latestTelemetry.actualFlow} <span className="text-xs font-normal text-slate-400">L/min</span>
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${latestTelemetry.actualFlow > 60 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'}`}>
                    {latestTelemetry.actualFlow > 60 ? 'HIGH FLOW' : 'NORMAL'}
                  </span>
                </div>
              </div>

              {/* Line Pressure */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
                  <span>Supply Pressure</span>
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-slate-100 font-mono">
                    {latestTelemetry.pressure} <span className="text-xs font-normal text-slate-400">bar</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Target: 2.8 bar</span>
                </div>
              </div>

              {/* Tank Level */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Overhead Tank Level</span>
                  <span className="text-xs font-bold text-slate-200 font-mono">{latestTelemetry.tankLevel}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${latestTelemetry.tankLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">Water Temp</span>
                </div>
                <span className="font-bold text-slate-100 font-mono">{latestTelemetry.temperature}°C</span>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-3 font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Node Status: ONLINE</span>
            </span>
            <span className="text-[11px] text-slate-500">Telemetry Valid</span>
          </div>

        </div>

      </div>

      {/* OPERATIONAL AI DIAGNOSTIC & EVIDENCE TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* OPERATIONAL AI RECOMMENDATION CARD */}
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Operational Diagnostic & Recommendation</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-300">
                Confidence: {aiAnalysis.confidence}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] font-semibold uppercase block mb-1">Diagnostic Summary</span>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-slate-200 leading-relaxed font-sans">
                  "{aiAnalysis.explanation}"
                </div>
              </div>

              {/* Evidence Timeline ("Why Now?") */}
              <div>
                <span className="text-slate-400 text-[11px] font-semibold uppercase block mb-1">
                  Evidence Progression (Magnitude + Duration)
                </span>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  {aiAnalysis.evidenceTimeline.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-900 last:border-0 pb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          step.status === 'CRITICAL' ? 'bg-rose-500' :
                          step.status === 'ELEVATED' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}></span>
                        <span className="font-bold text-slate-300">{step.stage}:</span>
                        <span className="text-slate-400 font-sans">{step.detail}</span>
                      </div>
                      <span className={`font-bold ${step.status === 'CRITICAL' ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {step.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Root Cause</span>
                  <span className="font-bold text-slate-100 text-xs">{aiAnalysis.cause}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Action Required</span>
                  <span className="font-medium text-cyan-300 text-xs">{aiAnalysis.recommendedAction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Dispatch Button */}
          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">Maintenance Dispatch</span>

            {lastCreatedTicket ? (
              <button 
                onClick={() => onNavigate('tickets')}
                className="flex items-center space-x-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 px-3.5 py-1.5 rounded text-xs font-bold"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>✓ {lastCreatedTicket.ticketNumber} Created — View Work Orders</span>
              </button>
            ) : (
              <button
                onClick={handleCreateTicketClick}
                className={`flex items-center space-x-1.5 font-bold px-4 py-2 rounded text-xs transition-colors ${
                  aiAnalysis.isAnomaly 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>CREATE WORK ORDER</span>
              </button>
            )}
          </div>

        </div>

        {/* LOSS PROJECTIONS & FINANCIAL IMPACT */}
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Loss Projections & Impact Forecast</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Formula: (Flow - Baseline) × Time
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Calculated Water Loss Projections:</span>
                <span className="text-cyan-400 font-mono font-bold">
                  15 min simulated: ~{loss15m.toLocaleString()} L
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">1 Hour Projected</span>
                  <span className="text-base font-bold text-cyan-400 block mt-0.5 font-mono">
                    ~{aiAnalysis.estimatedLoss1h.toLocaleString()} L
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-700">
                  <span className="text-[11px] text-slate-300 block font-bold">6 Hours Projected</span>
                  <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                    ~{aiAnalysis.estimatedLoss6h.toLocaleString()} L
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">24 Hours Projected</span>
                  <span className="text-base font-bold text-rose-400 block mt-0.5 font-mono">
                    ~{aiAnalysis.estimatedLoss24h.toLocaleString()} L
                  </span>
                </div>
              </div>

              {/* Financial Impact in INR */}
              <div className="bg-slate-950 p-3.5 rounded border border-slate-800 flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Financial Impact Projection (INR)</span>
                    <span className="text-[11px] text-slate-500">Rate assumption: ₹45.00 / kL</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-400 font-mono block">
                    ₹{aiAnalysis.estimatedFinancialLoss6h.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-slate-500 block">per 6 hours projected</span>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic mt-4">
            Estimate based on current excess flow and configured water cost.
          </div>

        </div>

      </div>

      {/* FACILITY BUILDING STATUS GRID */}
      <div className="bg-slate-900 rounded-lg p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Facility Building Nodes Overview</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            4 Monitored Zones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {buildings.map((building) => (
            <div 
              key={building.id}
              className={`p-3.5 rounded border transition-colors ${
                building.status === 'Critical'
                  ? 'bg-rose-950/40 border-rose-800'
                  : building.status === 'Elevated'
                  ? 'bg-amber-950/30 border-amber-800'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-xs">{building.name}</span>
                {getStatusBadge(building.status)}
              </div>

              <div className="text-[11px] text-slate-400 mb-2 truncate">{building.locationDescription}</div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Flow:</span>
                  <span className="font-bold">{building.flowRate} L/min</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Tank:</span>
                  <span>{building.tankLevel}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Today:</span>
                  <span>{building.todayUsage.toLocaleString()} L</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
