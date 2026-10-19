import React from 'react';
import { Menu, History, Scan, Layers, Sun, Moon, User } from 'lucide-react';
import { ScreenView, OperativeProfile } from '../types';
import { AppLogo } from './AppLogo';

interface TopAppBarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  operative: OperativeProfile;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  geminiConfigured?: boolean | null;
  onOpenApiKeyModal?: () => void;
  onOpenBatchModal?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  onNavigate,
  operative,
  darkMode = true,
  onToggleDarkMode,
  geminiConfigured,
  onOpenApiKeyModal,
  onOpenBatchModal,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#1e2a3f] shadow-xs transition-colors duration-200">
      {/* Brand / Logo */}
      <button
        id="nav-brand-logo"
        onClick={() => onNavigate('dashboard')}
        className="flex items-center group text-left cursor-pointer focus:outline-none transition-transform active:scale-98"
      >
        <AppLogo size="md" showText={true} />
      </button>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-[#101726] border border-slate-200/80 dark:border-[#1f2b42] p-1 rounded-xl shadow-inner">
        <button
          id="desktop-nav-scan"
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            currentScreen === 'dashboard' || currentScreen === 'result'
              ? 'bg-white dark:bg-[#1a253a] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2d3d5c] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#162033]'
          }`}
        >
          <Scan className="w-3.5 h-3.5 text-blue-500" />
          <span>Verification</span>
        </button>

        <button
          id="desktop-nav-ela"
          onClick={() => onNavigate('forensic_inspector')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            currentScreen === 'forensic_inspector'
              ? 'bg-white dark:bg-[#1a253a] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2d3d5c] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#162033]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          <span>Visual ELA</span>
        </button>

        <button
          id="desktop-nav-history"
          onClick={() => onNavigate('history')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            currentScreen === 'history'
              ? 'bg-white dark:bg-[#1a253a] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2d3d5c] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#162033]'
          }`}
        >
          <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Audit Log</span>
        </button>

        <button
          id="desktop-nav-settings"
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            currentScreen === 'settings'
              ? 'bg-white dark:bg-[#1a253a] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2d3d5c] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#162033]'
          }`}
        >
          <Menu className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Dark / Light Mode Switcher */}
        {onToggleDarkMode && (
          <button
            type="button"
            id="toggle-dark-mode-header-btn"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#131b2a] dark:hover:bg-[#1c273c] border border-slate-200 dark:border-[#22314a] text-slate-600 dark:text-slate-300 transition-all cursor-pointer focus:outline-none"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        )}

        {/* Operative Profile Pill */}
        <button
          id="change-profile-button"
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#101726] dark:hover:bg-[#182338] border border-slate-200/90 dark:border-[#1e2a3f] transition-all cursor-pointer focus:outline-none"
          title={`Operative: ${operative.name} (${operative.clearance})`}
        >
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
            {operative.name || operative.operativeId}
          </span>
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-[#2a3a55] flex-shrink-0 bg-slate-200 dark:bg-[#162033]">
            {operative.avatarUrl ? (
              <img
                src={operative.avatarUrl}
                alt={operative.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-[#090d16]"></div>
          </div>
        </button>
      </div>
    </header>
  );
};
