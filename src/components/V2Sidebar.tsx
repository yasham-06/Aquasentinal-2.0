import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  Sliders, 
  BarChart3, 
  Leaf, 
  FileText, 
  Settings,
  ShieldAlert
} from 'lucide-react';
import { PageType } from '../types';

interface V2SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  activeAlertCount?: number;
}

export const V2Sidebar: React.FC<V2SidebarProps> = ({
  currentPage,
  onNavigate,
  activeAlertCount = 0,
}) => {
  const mainNav: { id: PageType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'topology', label: 'Campus Mesh', icon: <Layers className="w-4 h-4" /> },
    { id: 'predictive', label: 'Predictive AI', icon: <Cpu className="w-4 h-4" /> },
    { id: 'valves', label: 'Valve Control', icon: <Sliders className="w-4 h-4" /> },
  ];

  const analyticsNav: { id: PageType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'esg', label: 'ESG Impact', icon: <Leaf className="w-4 h-4" /> },
    { id: 'tickets', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <ShieldAlert className="w-4 h-4" />, badge: activeAlertCount },
  ];

  const settingsNav: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const renderNavGroup = (title: string, items: typeof mainNav) => (
    <div className="space-y-1.5">
      <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B]">
        {title}
      </div>
      {items.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[#22D3EE] text-[#06101E] font-bold shadow-md shadow-[#22D3EE]/20'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D2032]'
            }`}
          >
            <span className={isActive ? 'text-[#06101E]' : 'text-[#94A3B8]'}>{item.icon}</span>
            <span className="truncate">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isActive ? 'bg-[#06101E] text-[#EF4444]' : 'bg-[#EF4444] text-white'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-52 md:w-56 bg-[#0B1A28] border border-[#183C5A] rounded-3xl m-3 flex flex-col justify-between flex-shrink-0 select-none py-5 px-3 shadow-2xl min-h-[calc(100vh-2rem)]">
      <div className="space-y-6">
        
        {/* Sidebar Brand Header */}
        <div className="px-3 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#22D3EE] text-[#06101E] flex items-center justify-center font-bold shadow-md shadow-[#22D3EE]/20">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display text-sm font-extrabold text-[#F8FAFC] tracking-tight">
              Aqua<span className="text-[#22D3EE]">Sentinel</span>
            </div>
            <div className="text-[10px] font-mono text-[#64748B]">v2.0 Control Platform</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#183C5A]/50 mx-2" />

        {/* Navigation Groups */}
        <nav className="space-y-5">
          {renderNavGroup('Operations', mainNav)}
          {renderNavGroup('Intelligence', analyticsNav)}
          {renderNavGroup('System', settingsNav)}
        </nav>

      </div>

      {/* Bottom Footer Widget */}
      <div className="px-3 pt-4 border-t border-[#183C5A]/50">
        <div className="bg-[#040D17] border border-[#183C5A] rounded-2xl p-3 space-y-1">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-[#22D3EE]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>Water Mesh Active</span>
          </div>
          <p className="text-[10px] text-[#64748B] leading-tight">
            Campus Sub-Metering Node Security
          </p>
        </div>
      </div>
    </aside>
  );
};
