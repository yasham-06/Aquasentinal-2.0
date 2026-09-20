import React from 'react';
import { PageType } from '../types';
import { 
  Droplets, 
  Activity, 
  BrainCircuit, 
  TrendingDown, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Zap,
  Building2,
  ChevronRight,
  Server,
  Database,
  Cpu,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
  onSimulateLeak: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSimulateLeak }) => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-navy-900/60 via-navy-950 to-navy-950">
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tag Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-cyan-950/50">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI-Powered Water Intelligence for Buildings</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
              AquaSentinel
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-cyan-300/90 font-medium mb-6 leading-relaxed max-w-2xl mx-auto">
              Detect abnormal water consumption, understand why it is happening, predict its impact, and trigger maintenance before waste becomes expensive.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all text-base active:scale-95"
              >
                <span>View Live Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold px-7 py-3.5 rounded-xl border border-slate-700 transition-all text-base"
              >
                <span>See How It Works</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setTimeout(() => {
                    onSimulateLeak();
                  }, 200);
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-semibold px-6 py-3.5 rounded-xl transition-all text-base"
              >
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Simulate Live Leak</span>
              </button>
            </div>

            {/* Stats Summary Bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left sm:text-center">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-xl font-bold text-white font-mono">40-50 L/m</div>
                <div className="text-[11px] text-slate-400">Baseline Range</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-xl font-bold text-cyan-400 font-mono">&lt; 15 min</div>
                <div className="text-[11px] text-slate-400">Simulated Anomaly Window</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-xl font-bold text-emerald-400 font-mono">₹45 / kL</div>
                <div className="text-[11px] text-slate-400">Default Water Cost</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-xl font-bold text-purple-400 font-mono">1.5×</div>
                <div className="text-[11px] text-slate-400">Baseline Anomaly Threshold</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5-STEP CORE WORKFLOW LOOP */}
      <section id="how-it-works" className="py-16 bg-navy-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
              The 5-Step Intelligence Loop
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight">
              MONITOR → DETECT → EXPLAIN → PREDICT → ACT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Step 1 */}
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 relative">
              <div className="text-xs font-bold text-cyan-400 mb-2 uppercase">Step 01</div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-base mb-1">MONITOR</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Continuous telemetry sampling of flow rate (L/min), pressure (bar), and tank levels.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 relative">
              <div className="text-xs font-bold text-cyan-400 mb-2 uppercase">Step 02</div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-base mb-1">DETECT</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Deterministic threshold engine flags sustained flow spikes exceeding 1.5× baseline.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 relative">
              <div className="text-xs font-bold text-cyan-400 mb-2 uppercase">Step 03</div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-base mb-1">EXPLAIN</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generates natural language root cause reasoning with "Why Now?" evidence timeline.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 relative">
              <div className="text-xs font-bold text-cyan-400 mb-2 uppercase">Step 04</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-base mb-1">PREDICT</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Calculates projected water volume loss (1h/6h/24h) and financial impact in INR (₹).
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 relative">
              <div className="text-xs font-bold text-cyan-400 mb-2 uppercase">Step 05</div>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-base mb-1">ACT</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                One-click automated maintenance ticket creation with location, severity & assigned technician.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TECHNICAL ARCHITECTURE SECTION */}
      <section className="py-16 bg-navy-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
              System Architecture
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight">
              Production Stack & Data Flow
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Built with React, TypeScript, Tailwind CSS, Recharts, and Python FastAPI backend architecture.
            </p>
          </div>

          {/* Architecture Diagram Box */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl max-w-4xl mx-auto">
            
            {/* Flow Diagrams Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <Cpu className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <span className="font-bold text-slate-200 block mb-1">01. Sensors & Telemetry</span>
                <span className="text-[11px] text-slate-400 block">Modbus / ESP32 Simulator Telemetry Stream</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <Server className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <span className="font-bold text-slate-200 block mb-1">02. Anomaly Engine</span>
                <span className="text-[11px] text-slate-400 block">FastAPI / Deterministic Rules (&gt;1.5x Baseline)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <BrainCircuit className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <span className="font-bold text-slate-200 block mb-1">03. AI Reasoning</span>
                <span className="text-[11px] text-slate-400 block">Structured AI Insight + Evidence Timeline</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <Globe className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                <span className="font-bold text-slate-200 block mb-1">04. Dispatch & Action</span>
                <span className="text-[11px] text-slate-400 block">Real-time Dashboard & Ticket Dispatch</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-6 pt-4 border-t border-slate-800">
              * Note: Production architecture supports ESP32 / Modbus / MQTT hardware telemetry streams. Live hackathon demo operates using simulated real-time telemetry engine.
            </p>

          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-14 bg-gradient-to-b from-navy-950 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-3">
            Experience AquaSentinel Live Demo
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xl mx-auto">
            Test the live leak simulation environment with real-time dynamic flow charts and automated AI anomaly responses.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-sm"
          >
            <span>Launch Live Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-5 border-t border-slate-900 bg-navy-950 text-center text-xs text-slate-500">
        <p>© 2026 AquaSentinel — Open Innovation Hackathon Prototype. AI Water Intelligence for Smarter Buildings.</p>
      </footer>

    </div>
  );
};
