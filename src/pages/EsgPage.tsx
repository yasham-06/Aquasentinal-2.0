import React from 'react';
import { Leaf, Zap, DollarSign, Award, ShieldCheck, FileCheck } from 'lucide-react';
import { EsgMetrics } from '../types';

interface EsgPageProps {
  esgMetrics: EsgMetrics;
}

export const EsgPage: React.FC<EsgPageProps> = ({ esgMetrics }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Leaf className="w-4 h-4" />
          <span>AquaSentinel 2.0 · Executive ESG & Sustainability Module</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Avoided Carbon & Conservation Audit</h1>
        <p className="text-slate-400 text-sm mt-1">
          Translates prevented water losses into avoided pumping energy (kWh) and reduced corporate carbon footprint (kg CO2e).
        </p>
      </div>

      {/* 4 ESG Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Water Saved</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            {esgMetrics.totalWaterSavedLiters.toLocaleString()} <span className="text-xs text-slate-400">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cumulative loss prevention</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Avoided Energy</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">
            {esgMetrics.energySavedKwh} <span className="text-xs text-slate-400">kWh</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">0.85 kWh per 1,000 L pumped</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">CO2 Emissions Avoided</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            {esgMetrics.co2AvoidedKg} <span className="text-xs text-slate-400">kg CO2e</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">0.71 kg CO2e per kWh saved</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Financial ROI (INR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            ₹{esgMetrics.financialSavingsINR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">At ₹45.00 / kL tariff rate</div>
        </div>

      </div>

      {/* Compliance Box */}
      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">ESG Rating & Corporate Audit Compliance</h3>
              <p className="text-xs text-slate-400">Verified sustainability footprint metrics for annual compliance reporting.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full font-mono font-bold text-sm">
              GRADE {esgMetrics.esgScoreGrade}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-slate-300">
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Audit Compliance Score</div>
            <div className="text-lg font-bold text-emerald-400">{esgMetrics.auditCompliancePct}% Compliant</div>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Water Recycling Offset</div>
            <div className="text-lg font-bold text-cyan-400">Zero Unaccounted Water Losses</div>
          </div>
        </div>
      </div>
    </div>
  );
};
