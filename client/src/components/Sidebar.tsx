import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  FolderGit2,
  BarChart3,
  HelpCircle,
  Settings,
  Activity,
  Sliders,
} from 'lucide-react';
import { Logo } from './Logo';
import { api } from '../services/api';

interface SidebarProps {
  scanlinesActive: boolean;
  onToggleScanlines: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
}) => {
  const [apiStatus, setApiStatus] = useState<{ mode: string; model?: string }>({
    mode: 'checking',
    model: 'DIAGNOSTIC BOOT...',
  });

  useEffect(() => {
    let mounted = true;
    api.checkHealth().then(status => {
      if (mounted) {
        setApiStatus({
          mode: status.mode,
          model: status.model || 'HEURISTIC ENGINE',
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Chat', icon: Zap, badge: 'READY' },
    { to: '/history', label: 'Archive', icon: FolderGit2 },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
    { to: '/how-it-works', label: 'Schematics', icon: HelpCircle },
    { to: '/settings', label: 'Calibrate', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#e0e5ec] border-r border-[#babecc] shadow-[1px_0_0_#ffffff] h-full flex flex-col justify-between select-none relative z-30 font-sans">
      {/* Top Section */}
      <div>
        <div className="p-5 border-b border-[#babecc] shadow-[0_1px_0_#ffffff] flex items-center justify-between">
          <Logo size="sm" showTagline={false} />
          {/* Mechanical Vent slots */}
          <div className="flex gap-1">
            <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),0_1px_0_#ffffff]" />
            <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),0_1px_0_#ffffff]" />
            <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),0_1px_0_#ffffff]" />
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3.5 space-y-2 mt-2">
          <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-[0.15em] text-[#4a5568] uppercase text-embossed">
            // MODULE NAVIGATION
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 text-xs font-mono font-bold uppercase rounded-lg transition-all duration-150 group active:translate-y-[1px] ${
                    isActive
                      ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff]'
                      : 'bg-[#e0e5ec] text-[#2d3436] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:text-[#ff4757]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="tracking-wider">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#d1d9e6] text-[#4a5568] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Mechanical Telemetry Module */}
      <div className="p-3.5 border-t border-[#babecc] shadow-[0_-1px_0_#ffffff] space-y-3 bg-[#e0e5ec]">
        {/* Recessed Engine Status Housing */}
        <div className="p-3 rounded-lg bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-[#4a5568] flex items-center gap-1.5 text-embossed">
              <Activity className="w-3.5 h-3.5 text-[#ff4757]" />
              AI ENGINE STATUS
            </span>
            {/* LED Status Indicator */}
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                apiStatus.mode === 'live_ai' || apiStatus.mode === 'standalone'
                  ? 'bg-[#22c55e] shadow-[0_0_8px_#22c55e]'
                  : apiStatus.mode === 'checking'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-[#ff4757]'
              }`} />
              <span className={`text-[9px] font-mono font-bold ${
                apiStatus.mode === 'live_ai'
                  ? 'text-[#22c55e]'
                  : apiStatus.mode === 'standalone'
                    ? 'text-[#22c55e]'
                    : apiStatus.mode === 'checking'
                      ? 'text-amber-600'
                      : 'text-accent'
              }`}>
                {apiStatus.mode === 'live_ai'
                  ? 'LIVE'
                  : apiStatus.mode === 'standalone'
                    ? 'STANDALONE'
                    : apiStatus.mode === 'checking'
                      ? 'CHECK'
                      : apiStatus.mode === 'unavailable'
                        ? 'OFFLINE'
                        : 'KEY REQUIRED'}
              </span>
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#2d3436] font-semibold truncate uppercase">
            {apiStatus.model}
          </div>
        </div>

        {/* Tactile Identity Plate */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-[#ffffff]/50">
          <div className="w-8 h-8 rounded-full bg-[#ff4757] shadow-[2px_2px_5px_rgba(166,50,60,0.4),-2px_-2px_5px_rgba(255,100,110,0.4)] flex items-center justify-center text-white text-[11px] font-mono font-bold">
            01
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-mono font-bold text-[#2d3436] truncate uppercase text-embossed">
              CONSOLE OPERATOR
            </span>
            <span className="text-[10px] font-mono text-[#4a5568] truncate">
              DIAGNOSTIC STATION
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
