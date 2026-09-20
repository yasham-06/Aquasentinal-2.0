import React, { useState } from 'react';
import { AlertItem, AlertSeverity, PageType } from '../types';
import { AlertTriangle, ShieldAlert, CheckCircle2, Filter, Bell, ArrowRight } from 'lucide-react';

interface AlertsPageProps {
  alerts: AlertItem[];
  onNavigate: (page: PageType) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onNavigate }) => {
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'ALL'>('ALL');

  const filteredAlerts = filterSeverity === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filterSeverity);

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
            CRITICAL LEAK
          </span>
        );
      case 'ELEVATED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
            ELEVATED FLOW
          </span>
        );
      case 'INFO':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/40">
            INFO / RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53]">
        <div>
          <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-[#EF4444]" />
            <span>AI Diagnostic Engine · Anomaly Logs</span>
          </div>
          <h1 className="text-xl font-bold text-[#F1F5F9]">Anomaly Alert Log</h1>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            Real-time and historic water anomaly alerts evaluated against baseline telemetry.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-1 bg-[#07111F] p-1 rounded border border-[#243B53] text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8] ml-1.5" />
          <span className="text-[#94A3B8] font-semibold mr-1">Filter:</span>
          {(['ALL', 'CRITICAL', 'ELEVATED', 'INFO'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-2.5 py-1 rounded transition-all ${
                filterSeverity === s
                  ? 'bg-[#13263A] text-[#22D3EE] font-bold border border-[#22D3EE]/40'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Log List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#0D1B2A] rounded-lg p-10 text-center border border-[#243B53] text-[#94A3B8]">
            <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#F1F5F9]">No active anomalies detected</p>
            <p className="text-xs text-[#94A3B8] font-mono mt-1">All monitored facility systems operating within baseline parameters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-[#0D1B2A] border-[#EF4444]/60'
                  : alert.severity === 'ELEVATED'
                  ? 'bg-[#0D1B2A] border-[#F59E0B]/50'
                  : 'bg-[#0D1B2A] border-[#243B53]'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  alert.severity === 'CRITICAL' ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40' :
                  alert.severity === 'ELEVATED' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' :
                  'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/40'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-[#F1F5F9]">{alert.title}</h3>
                    {getSeverityBadge(alert.severity)}
                  </div>

                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Location: <strong className="text-[#F1F5F9]">{alert.location}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#94A3B8] font-mono">
                    <span>Flow: <strong className="text-[#EF4444]">{alert.currentFlow} L/min</strong></span>
                    <span>Baseline: <span className="text-[#F1F5F9]">{alert.expectedFlow} L/min</span></span>
                    {alert.deviationPct > 0 && (
                      <span className="text-[#EF4444] font-bold">+{alert.deviationPct}% deviation</span>
                    )}
                    <span>Timestamp: {alert.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => onNavigate('tickets')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-[#13263A] hover:bg-[#1f3650] text-[#22D3EE] border border-[#243B53] transition-all"
                >
                  <span>Work Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
