import React from 'react';
import { PageType, SimulationMode } from '../types';
import { 
  Droplets, 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Wrench, 
  Settings, 
  Home
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  simulationMode: SimulationMode;
  activeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  simulationMode,
  activeAlertCount 
}) => {
  const navItems: { id: PageType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Control Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'monitoring', label: 'Water Systems', icon: <Activity className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: activeAlertCount },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tickets', label: 'Work Orders', icon: <Wrench className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Product Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 rounded-md bg-cyan-600 flex items-center justify-center text-white">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-white">
                AquaSentinel
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                v2.4 Operations
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors relative ${
                    isActive 
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Status Pill */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className={`w-2 h-2 rounded-full ${simulationMode === 'NORMAL' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
              <span className="uppercase text-[11px] text-slate-300">
                {simulationMode === 'NORMAL' ? 'System Normal' : `Mode: ${simulationMode}`}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-800 bg-slate-950 px-2 py-1 space-x-1 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md whitespace-nowrap ${
              currentPage === item.id ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
