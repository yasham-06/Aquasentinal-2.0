import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  Ticket, 
  Settings, 
  Leaf, 
  Zap,
  Radio,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#0D1B2A] border-b border-[#243B53] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 rounded bg-[#13263A] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] group-hover:border-[#22D3EE] transition-colors">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-[#F1F5F9] font-sans">
                  Aqua<span className="text-[#22D3EE]">Sentinel</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#13263A] text-[#22D3EE] border border-[#243B53] rounded">
                  v2.0 Enterprise
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] font-mono tracking-widest uppercase">
                Smart Water Operations Center
              </p>
            </div>
          </div>

          {/* Nav Items (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#13263A] text-[#22D3EE] border border-[#22D3EE]/40'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#13263A]/60'
                  }`}
                >
                  <span className={isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold font-mono bg-[#EF4444] text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status Indicator & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 rounded bg-[#07111F] border border-[#243B53] text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${simulationMode === 'NORMAL' ? 'bg-[#22C55E]' : 'bg-[#EF4444] animate-ping'}`} />
              <span className={`text-[11px] font-bold ${simulationMode === 'NORMAL' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {simulationMode === 'NORMAL' ? 'SYSTEM NORMAL' : 'ANOMALY ALERT'}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#94A3B8] hover:text-white rounded bg-[#13263A] border border-[#243B53]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#243B53] space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#13263A] text-[#22D3EE] font-bold border border-[#22D3EE]/30'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#13263A]/40'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#EF4444] text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
