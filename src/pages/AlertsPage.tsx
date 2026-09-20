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
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            CRITICAL LEAK
          </span>
        );
      case 'ELEVATED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ELEVATED FLOW
          </span>
        );
      case 'INFO':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            INFO / RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Bell className="w-7 h-7 text-rose-400" />
            <span>Anomaly Alert Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time and historic water anomaly alerts detected by the AI engine.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <span className="text-slate-400 font-semibold mr-1">Filter:</span>
          {(['ALL', 'CRITICAL', 'ELEVATED', 'INFO'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterSeverity === s
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ALERTS LOG LIST */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/60 rounded-xl p-12 text-center border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-200">No active anomalies detected</p>
            <p className="text-xs text-slate-500 mt-1">All monitored facility systems are operating within expected baseline range.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-950/40 border-rose-800/80 hover:border-rose-600'
                  : alert.severity === 'ELEVATED'
                  ? 'bg-amber-950/30 border-amber-800/60 hover:border-amber-600'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  alert.severity === 'ELEVATED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{alert.title}</h3>
                    {getSeverityBadge(alert.severity)}
                  </div>

                  <p className="text-xs text-slate-300 font-medium mt-1">
                    Location: <strong className="text-white">{alert.location}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                    <span>Flow: <strong className="text-rose-400">{alert.currentFlow} L/min</strong></span>
                    <span>Expected: <span className="text-slate-200">{alert.expectedFlow} L/min</span></span>
                    {alert.deviationPct > 0 && (
                      <span className="text-rose-300 font-bold">+{alert.deviationPct}% deviation</span>
                    )}
                    <span>Duration: 15 min simulated</span>
                    <span className="text-slate-500 font-sans">({alert.timestamp})</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center space-x-2 self-end md:self-center">
                <button
                  onClick={() => onNavigate('tickets')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all"
                >
                  <span>View Tickets</span>
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
