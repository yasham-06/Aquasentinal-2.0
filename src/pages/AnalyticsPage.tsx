import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart3, TrendingDown, IndianRupee, Award, ShieldCheck } from 'lucide-react';

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

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-cyan-400" />
          <span>Water Analytics & ROI Impact</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical efficiency insights, waste prevention stats, and before/after comparative modeling.
        </p>
      </div>

      {/* PROMINENT "BEFORE" VS "WITH AQUASENTINEL" COMPARISON CARD */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 rounded-2xl p-6 border-2 border-cyan-500/30 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                IMPACT MODELING: WASTE REDUCTION
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Comparative analysis of monthly unaddressed leak waste before and after AI deployment.
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 self-start md:self-center">
            SIMULATED / ESTIMATED PROTOTYPE DATA
          </span>
        </div>

        {/* COMPARISON METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          
          <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-900/50">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Before AquaSentinel</span>
            <div className="text-2xl font-extrabold text-slate-200 mt-1 font-mono">42,000 L</div>
            <span className="text-xs text-slate-400 mt-1 block">Estimated monthly leak waste</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">With AquaSentinel</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono">27,000 L</div>
            <span className="text-xs text-emerald-300 mt-1 block font-semibold">15,000 L monthly waste prevented</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/40">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">Efficiency Improvement</span>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1 font-mono">+35.7%</div>
            <span className="text-xs text-slate-400 mt-1 block">Reduction in unaddressed water loss</span>
          </div>

        </div>

      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Before vs After Weekly Bar Chart */}
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Waste Comparison (Liters)</h3>
              <p className="text-xs text-slate-400">Before AquaSentinel vs With AquaSentinel</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              SIMULATED PROJECTION
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="before" name="Before AquaSentinel" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="With AquaSentinel" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Building Water Usage breakdown */}
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white">Building Consumption & Prevention</h3>
              <p className="text-xs text-slate-400">Liters consumed vs liters saved per building</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              SIMULATED PROJECTION
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUILDING_USAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="building" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="usage" name="Today's Usage (L)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saved" name="Water Saved (L)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
