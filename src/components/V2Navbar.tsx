import React from 'react';
import { 
  Activity, 
  Layers, 
  GitCommit, 
  ShieldAlert, 
  Sliders, 
  BarChart3, 
  Ticket, 
  Settings, 
  Leaf, 
  Zap,
  Radio
} from 'lucide-react';
import { PageType, SimulationMode } from '../types';

interface V2NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  simulationMode: SimulationMode;
  activeAlertCount: number;
}

export const V2Navbar: React.FC<V2NavbarProps> = ({
  currentPage,
  onNavigate,
  simulationMode,
  activeAlertCount,
}) => {
  const navItems: { id: PageType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'topology', label: 'Campus Mesh', icon: <Layers className="w-4 h-4" /> },
    { id: 'valves', label: 'Remote Valves', icon: <Sliders className="w-4 h-4" /> },
    { id: 'predictive', label: 'Predictive AI', icon: <Zap className="w-4 h-4" /> },
    { id: 'esg', label: 'ESG Carbon', icon: <Leaf className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <ShieldAlert className="w-4 h-4" />, badge: activeAlertCount },
    { id: 'tickets', label: 'Work Orders', icon: <Ticket className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-cyan-500/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Aqua<span className="text-cyan-400">Sentinel</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded-full">
                  v2.0 Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                MULTI-NODE MESH · CLOSED-LOOP ACTUATION
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-red-500/90 text-white rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status Pill */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${simulationMode === 'NORMAL' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-500 shadow-red-500/50'} animate-ping`} />
              <span className="text-slate-300 text-[11px]">
                {simulationMode === 'NORMAL' ? 'MESH NORMAL' : 'ANOMALY DETECTED'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
