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
    <div className="space-y-6 pb-12 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53]">
        <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>System Parameters & Threshold Matrix</span>
        </div>
        <h1 className="text-xl font-bold text-[#F1F5F9]">System Configuration</h1>
        <p className="text-[#94A3B8] text-xs mt-0.5">
          Configure detection sensitivity thresholds, financial rate constants (INR ₹), and AI diagnostic fallback modes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Anomaly Thresholds */}
        <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-3">
          <div className="flex items-center space-x-2 text-[#F1F5F9] font-bold text-sm border-b border-[#243B53] pb-2">
            <Sliders className="w-4 h-4 text-[#22D3EE]" />
            <span>Anomaly Detection Threshold</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <label className="block text-[#94A3B8]">
              Flow Multiplier Threshold: <strong className="text-[#22D3EE]">{threshold}× Baseline</strong>
            </label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#07111F] rounded appearance-none cursor-pointer accent-[#22D3EE]"
            />
            <p className="text-[10px] text-[#94A3B8]">
              Anomalies are flagged when flow rate exceeds {threshold}× the expected baseline (64.5 L/min for 43 L/min baseline).
            </p>
          </div>
        </div>

        {/* Cost Assumptions */}
        <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-3">
          <div className="flex items-center space-x-2 text-[#F1F5F9] font-bold text-sm border-b border-[#243B53] pb-2">
            <IndianRupee className="w-4 h-4 text-[#22C55E]" />
            <span>Water Tariff Rate (INR ₹)</span>
          </div>

          <div className="font-mono text-xs space-y-1">
            <label className="block text-[#94A3B8]">
              Municipal Water Utility Cost Rate (₹ per 1,000 Liters / kL)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8] font-bold">₹</span>
              <input
                type="number"
                step="1.00"
                value={waterRate}
                onChange={(e) => setWaterRate(parseFloat(e.target.value))}
                className="w-full bg-[#07111F] border border-[#243B53] rounded pl-8 pr-3 py-1.5 text-[#F1F5F9] text-xs font-mono focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
            <p className="text-[10px] text-[#94A3B8]">
              Used by the forecasting model to project financial loss in Indian Rupees (₹).
            </p>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-3">
          <div className="flex items-center space-x-2 text-[#F1F5F9] font-bold text-sm border-b border-[#243B53] pb-2">
            <Key className="w-4 h-4 text-[#22D3EE]" />
            <span>AI Reasoning & Diagnostic Engine</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[#94A3B8] mb-1">
                OpenAI API Key (Optional Override)
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#07111F] border border-[#243B53] rounded p-2 text-[#F1F5F9] text-xs font-mono focus:outline-none focus:border-[#22D3EE]"
              />
            </div>

            <div className="flex items-center space-x-2 bg-[#07111F] p-2.5 rounded border border-[#243B53]">
              <input
                type="checkbox"
                id="fallback"
                checked={useFallback}
                onChange={(e) => setUseFallback(e.target.checked)}
                className="w-4 h-4 rounded accent-[#22D3EE] bg-[#0D1B2A] border-[#243B53]"
              />
              <label htmlFor="fallback" className="text-xs text-[#F1F5F9] cursor-pointer">
                <strong>Enable Deterministic Fallback Engine</strong> (Guarantees zero demo failures)
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-[#22C55E] font-mono font-bold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Configuration Saved!</span>
            </span>
          ) : (
            <span className="text-xs text-[#94A3B8] font-mono">Configuration persists across sessions</span>
          )}

          <button
            type="submit"
            className="px-5 py-2 rounded text-xs font-mono font-bold bg-[#13263A] hover:bg-[#1f3650] text-[#22D3EE] border border-[#22D3EE]/40 transition-all"
          >
            Save Configuration
          </button>
        </div>

      </form>

    </div>
  );
};
