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
  const navItems: { id: PageType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'topology', label: 'Campus Mesh', icon: <Layers className="w-4 h-4" /> },
    { id: 'predictive', label: 'Predictive AI', icon: <Cpu className="w-4 h-4" /> },
    { id: 'valves', label: 'Valve Control', icon: <Sliders className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'esg', label: 'ESG Impact', icon: <Leaf className="w-4 h-4" /> },
    { id: 'tickets', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <ShieldAlert className="w-4 h-4" />, badge: activeAlertCount },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-48 md:w-52 bg-[#061421] border-r border-[#163B55] flex flex-col justify-between flex-shrink-0 select-none py-4 px-2 min-h-screen">
      <div className="space-y-6">
        
        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#0F2940] text-[#22D3EE] font-semibold shadow-sm border border-[#163B55]/60'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B2134]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#22D3EE] rounded-r-full shadow-[0_0_8px_#22D3EE]" />
                )}
                <span className={isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 text-[10px] font-bold bg-[#EF4444] text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Sidebar Tagline matching reference */}
      <div className="px-3 pt-6 border-t border-[#163B55]/50">
        <p className="text-[11px] text-[#64748B] font-sans leading-tight">
          Smart Water.<br />
          <span className="text-[#94A3B8]">Sustainable Tomorrow.</span>
        </p>
      </div>
    </aside>
  );
};
