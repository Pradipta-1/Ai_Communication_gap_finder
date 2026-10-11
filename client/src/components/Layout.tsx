import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { X } from 'lucide-react';

interface LayoutProps {
  scanlinesActive: boolean;
  onToggleScanlines: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  scanlinesActive,
  onToggleScanlines,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#2d3436] flex flex-col lg:flex-row relative font-sans app-shell">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0">
        <Sidebar
          scanlinesActive={scanlinesActive}
          onToggleScanlines={onToggleScanlines}
        />
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2d3436]/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-[#e0e5ec] z-10 border-r border-[#babecc] shadow-[8px_0_16px_rgba(0,0,0,0.15)] animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#2d3436] rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              scanlinesActive={scanlinesActive}
              onToggleScanlines={onToggleScanlines}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#e0e5ec] app-content">
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
