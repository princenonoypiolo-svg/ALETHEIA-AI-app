import React from 'react';
import { Home, Menu, Layers, History } from 'lucide-react';
import { ScreenView } from '../types';

interface BottomNavBarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#243247] flex justify-around items-center px-2 py-2 transition-colors">
      {/* Home / Scan */}
      <button
        id="mobile-nav-home"
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-colors cursor-pointer ${
          currentScreen === 'dashboard' || currentScreen === 'result'
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span className="text-[11px]">Home</span>
      </button>

      {/* Visual ELA */}
      <button
        id="mobile-nav-ela"
        onClick={() => onNavigate('forensic_inspector')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-colors cursor-pointer ${
          currentScreen === 'forensic_inspector'
            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Layers className="w-4 h-4 mb-0.5" />
        <span className="text-[11px]">Visual ELA</span>
      </button>

      {/* History Log */}
      <button
        id="mobile-nav-history"
        onClick={() => onNavigate('history')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-colors cursor-pointer ${
          currentScreen === 'history'
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <History className="w-4 h-4 mb-0.5" />
        <span className="text-[11px]">Audit Log</span>
      </button>

      {/* Settings */}
      <button
        id="mobile-nav-settings"
        onClick={() => onNavigate('settings')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-colors cursor-pointer ${
          currentScreen === 'settings'
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span className="text-[11px]">Settings</span>
      </button>
    </nav>
  );
};
