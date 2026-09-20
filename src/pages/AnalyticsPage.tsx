import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart3, Award, ShieldCheck } from 'lucide-react';
import { PageType } from '../types';

const COMPARISON_DATA = [
  { month: 'Week 1', before: 10500, after: 6800 },
  { month: 'Week 2', before: 11200, after: 7100 },
  { month: 'Week 3', before: 9800, after: 6400 },
  { month: 'Week 4', before: 10500, after: 6700 },
];

const BUILDING_USAGE_DATA = [
  { building: 'Block A', usage: 4850, saved: 320 },
  { building: 'Block B', usage: 6920, saved: 580 },
  { building: 'Block C', usage: 3980, saved: 140 },
  { building: 'Block D', usage: 2670, saved: 200 },
];

interface AnalyticsPageProps {
  onNavigate?: (page: PageType) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53]">
        <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Historical Operations & Conservation Audit</span>
        </div>
        <h1 className="text-xl font-bold text-[#F1F5F9]">Water Analytics & Impact Modeling</h1>
        <p className="text-[#94A3B8] text-xs mt-0.5">
          Historical telemetry trends, leak mitigation metrics, and before/after comparative data.
        </p>
      </div>

      {/* Before vs After Impact Card */}
      <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243B53] pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#22D3EE]" />
            <h2 className="text-base font-bold text-[#F1F5F9]">
              IMPACT MODELING: WASTE MITIGATION
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-[#13263A] text-[#22D3EE] border border-[#243B53]">
            TELEMETRY BASELINE
          </span>
        </div>

        {/* Comparison Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          
          <div className="bg-[#07111F] p-3.5 rounded border border-[#EF4444]/40">
            <span className="text-xs text-[#EF4444] uppercase tracking-wider block">Before AquaSentinel</span>
            <div className="text-xl font-bold text-[#F1F5F9] mt-1">42,000 L</div>
            <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Unmitigated monthly leak loss</span>
          </div>

          <div className="bg-[#07111F] p-3.5 rounded border border-[#22C55E]/40">
            <span className="text-xs text-[#22C55E] uppercase tracking-wider block">With AquaSentinel 2.0</span>
            <div className="text-xl font-bold text-[#F1F5F9] mt-1">27,000 L</div>
            <span className="text-[10px] text-[#22C55E] mt-0.5 block font-bold">15,000 L monthly waste prevented</span>
          </div>

          <div className="bg-[#07111F] p-3.5 rounded border border-[#22D3EE]/40">
            <span className="text-xs text-[#22D3EE] uppercase tracking-wider block">Efficiency Gain</span>
            <div className="text-xl font-bold text-[#22D3EE] mt-1">+35.7%</div>
            <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Reduction in unaddressed loss</span>
          </div>

        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Weekly Waste Comparison */}
        <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-3">
          <div className="flex items-center justify-between border-b border-[#243B53] pb-2">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Weekly Waste Comparison (Liters)</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#13263A] text-[#94A3B8]">
              HISTORICAL
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243B53" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1B2A', borderColor: '#243B53', borderRadius: '6px', fontSize: '12px', color: '#F1F5F9' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                <Bar dataKey="before" name="Before AquaSentinel" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="With AquaSentinel 2.0" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Building Consumption & Prevention */}
        <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-3">
          <div className="flex items-center justify-between border-b border-[#243B53] pb-2">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Sub-Node Usage vs Conservation</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#13263A] text-[#94A3B8]">
              SPATIAL
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUILDING_USAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243B53" />
                <XAxis dataKey="building" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1B2A', borderColor: '#243B53', borderRadius: '6px', fontSize: '12px', color: '#F1F5F9' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                <Bar dataKey="usage" name="Today's Flow (L)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saved" name="Water Saved (L)" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
