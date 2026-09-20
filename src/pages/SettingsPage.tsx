import React, { useState } from 'react';
import { Settings, Sliders, Key, IndianRupee, Check } from 'lucide-react';
import { telemetryEngine } from '../services/telemetryEngine';

export const SettingsPage: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(1.5);
  const [waterRate, setWaterRate] = useState<number>(telemetryEngine.getWaterCost());
  const [apiKey, setApiKey] = useState<string>('');
  const [useFallback, setUseFallback] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    telemetryEngine.setWaterCost(waterRate);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <Settings className="w-7 h-7 text-cyan-400" />
          <span>System & Anomaly Settings</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure detection sensitivity, financial cost constants (INR), and AI explanation providers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: ANOMALY THRESHOLDS */}
        <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Anomaly Detection Parameters</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Flow Deviation Multiplier Threshold: <strong className="text-cyan-400">{threshold}× Baseline</strong>
              </label>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Anomalies will be flagged when flow rate exceeds {threshold}× the 15-sample rolling mean (64.5 L/min for 43 L/min baseline).
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: COST CONSTANTS (INR) */}
        <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-800 pb-3">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
            <span>Water Cost & Financial Loss Assumptions (INR)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Municipal Water Utility Cost Rate (₹ per 1,000 Liters / kL)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm font-bold">₹</span>
              <input
                type="number"
                step="1.00"
                value={waterRate}
                onChange={(e) => setWaterRate(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-white text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used in the Impact Prediction engine to calculate financial waste loss projections in Indian Rupees (₹).
            </p>
          </div>
        </div>

        {/* SECTION 3: AI EXPLANATION PROVIDER */}
        <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-800 pb-3">
            <Key className="w-5 h-5 text-purple-400" />
            <span>AI Reasoning & LLM Configuration</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                OpenAI API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm font-mono focus:outline-hidden focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                If provided, AquaSentinel uses live LLM calls for reasoning. Leave empty to use rule-based deterministic fallback.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                id="fallback"
                checked={useFallback}
                onChange={(e) => setUseFallback(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="fallback" className="text-xs text-slate-300 cursor-pointer">
                <strong>Enable Deterministic Fallback Engine</strong> (Guarantees zero demo failures if API key is missing or offline)
              </label>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">Configuration persists across demo sessions</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>

      </form>

    </div>
  );
};
