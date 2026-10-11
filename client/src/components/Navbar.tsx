import React from 'react';
import { Menu, Moon, Plus, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, theme, onToggleTheme }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'CONSOLE OVERVIEW';
    if (path.startsWith('/dashboard')) return 'TELEMETRY DASHBOARD';
    if (path.startsWith('/analyze')) return 'DATA INGESTION PIPELINE';
    if (path.startsWith('/results')) return 'ANALYSIS INSPECTION';
    if (path.startsWith('/history')) return 'TRANSCRIPT ARCHIVE';
    if (path.startsWith('/insights')) return 'COMMUNICATION TELEMETRY';
    if (path.startsWith('/how-it-works')) return 'SYSTEM SCHEMATICS';
    if (path.startsWith('/settings')) return 'HARDWARE CALIBRATION';
    if (path.startsWith('/privacy')) return 'SECURITY SPECIFICATION';
    return 'DIAGNOSTIC SYSTEM';
  };

  return (
    <header className="h-16 border-b border-[#babecc] shadow-[0_1px_0_#ffffff] bg-[#e0e5ec] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 font-sans select-none">
      {/* Mobile Menu Button + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#2d3436] rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <Logo size="sm" showTagline={false} />
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff4757] shadow-[0_0_8px_rgba(255,71,87,0.7)] mr-1" />
          <h1 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 text-[#2d3436] rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* LED Stamped Tag */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] border border-[#ffffff]/40 text-[10px] font-mono font-bold uppercase text-[#4a5568]">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]" />
          <span>SERVER-SIDE AI CONFIG</span>
        </div>

        {/* Safety Orange Tactile Push Button */}
        <Link
          to="/analyze"
          className="btn-tactile-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg active:translate-y-[2px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>NEW SCAN</span>
        </Link>
      </div>
    </header>
  );
};
