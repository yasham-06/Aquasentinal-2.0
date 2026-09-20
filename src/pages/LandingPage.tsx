import React from 'react';
import { PageType } from '../types';
import { 
  Activity, 
  BrainCircuit, 
  TrendingDown, 
  Wrench, 
  ArrowRight, 
  ShieldAlert, 
  Zap,
  ChevronRight,
  Server,
  Cpu,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
  onSimulateLeak: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSimulateLeak }) => {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] flex flex-col font-sans animate-fade-in">
      
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-16 border-b border-[#243B53] bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#13263A] border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-mono font-semibold uppercase mb-4">
              <Zap className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
              <span>Smart City Water Infrastructure & AI Operations</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F1F5F9] mb-4">
              Aqua<span className="text-[#22D3EE]">Sentinel</span> 2.0
            </h1>
            
            <p className="text-sm sm:text-base text-[#94A3B8] font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
              Detect abnormal water consumption, isolate spatial leak zones, execute sub-3s remote valve shutoff, and track ESG carbon savings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#13263A] hover:bg-[#1f3650] text-[#22D3EE] font-mono font-bold px-6 py-3 rounded border border-[#22D3EE]/40 transition-all text-xs"
              >
                <span>OPEN COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setTimeout(() => {
                    onSimulateLeak();
                  }, 200);
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#EF4444] hover:bg-[#dc2626] text-white font-mono font-bold px-6 py-3 rounded shadow-md shadow-[#EF4444]/20 transition-all text-xs"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>SIMULATE LIVE LEAK</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 text-left sm:text-center font-mono text-xs">
              <div className="p-3 rounded bg-[#07111F] border border-[#243B53]">
                <div className="font-bold text-[#F1F5F9]">40-50 L/m</div>
                <div className="text-[10px] text-[#94A3B8]">Baseline Range</div>
              </div>
              <div className="p-3 rounded bg-[#07111F] border border-[#243B53]">
                <div className="font-bold text-[#22D3EE]">1.5× Baseline</div>
                <div className="text-[10px] text-[#94A3B8]">Anomaly Threshold</div>
              </div>
              <div className="p-3 rounded bg-[#07111F] border border-[#243B53]">
                <div className="font-bold text-[#22C55E]">₹45 / kL</div>
                <div className="text-[10px] text-[#94A3B8]">Default Water Rate</div>
              </div>
              <div className="p-3 rounded bg-[#07111F] border border-[#243B53]">
                <div className="font-bold text-[#22D3EE]">Sub-3s</div>
                <div className="text-[10px] text-[#94A3B8]">Valve Isolation Latency</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5 Step Loop */}
      <section className="py-12 bg-[#07111F] border-b border-[#243B53]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs font-mono font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
              5-Step Closed-Loop Architecture
            </h2>
            <p className="text-xl font-bold text-[#F1F5F9] font-mono">
              MONITOR → DETECT → EXPLAIN → PREDICT → ACT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
            
            <div className="bg-[#0D1B2A] p-4 rounded border border-[#243B53]">
              <div className="text-[10px] font-bold text-[#22D3EE] mb-1">STEP 01</div>
              <Activity className="w-4 h-4 text-[#22D3EE] mb-2" />
              <h4 className="font-bold text-[#F1F5F9] mb-1">MONITOR</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">Continuous telemetry sampling of flow rate, pressure, and tank levels.</p>
            </div>

            <div className="bg-[#0D1B2A] p-4 rounded border border-[#243B53]">
              <div className="text-[10px] font-bold text-[#F59E0B] mb-1">STEP 02</div>
              <ShieldAlert className="w-4 h-4 text-[#F59E0B] mb-2" />
              <h4 className="font-bold text-[#F1F5F9] mb-1">DETECT</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">1.5× baseline anomaly threshold evaluation flags continuous spikes.</p>
            </div>

            <div className="bg-[#0D1B2A] p-4 rounded border border-[#243B53]">
              <div className="text-[10px] font-bold text-[#22D3EE] mb-1">STEP 03</div>
              <BrainCircuit className="w-4 h-4 text-[#22D3EE] mb-2" />
              <h4 className="font-bold text-[#F1F5F9] mb-1">EXPLAIN</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">Structured AI diagnostic report with "WHY NOW?" evidence timeline.</p>
            </div>

            <div className="bg-[#0D1B2A] p-4 rounded border border-[#243B53]">
              <div className="text-[10px] font-bold text-[#22C55E] mb-1">STEP 04</div>
              <TrendingDown className="w-4 h-4 text-[#22C55E] mb-2" />
              <h4 className="font-bold text-[#F1F5F9] mb-1">PREDICT</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">Mathematical volumetric loss & financial impact estimation (₹).</p>
            </div>

            <div className="bg-[#0D1B2A] p-4 rounded border border-[#243B53]">
              <div className="text-[10px] font-bold text-[#EF4444] mb-1">STEP 05</div>
              <Wrench className="w-4 h-4 text-[#EF4444] mb-2" />
              <h4 className="font-bold text-[#F1F5F9] mb-1">ACT</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">Automated work order creation & sub-3s remote valve shutoff.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-4 border-t border-[#243B53] bg-[#0D1B2A] text-center text-xs text-[#94A3B8] font-mono">
        <p>© 2026 AquaSentinel 2.0 Enterprise Control Center. Smart City Water Operations.</p>
      </footer>

    </div>
  );
};
