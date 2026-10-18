import React from 'react';
import { Menu, History, Scan, User, Layers, Key, ShieldCheck } from 'lucide-react';
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
  geminiConfigured,
  onOpenApiKeyModal,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#243247] transition-colors">
      {/* Brand / Logo */}
      <button
        id="nav-brand-logo"
        onClick={() => onNavigate('dashboard')}
        className="flex items-center group text-left cursor-pointer focus:outline-none"
      >
        <AppLogo size="md" showText={true} />
      </button>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#243247] p-1 rounded-lg">
        <button
          id="desktop-nav-scan"
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            currentScreen === 'dashboard' || currentScreen === 'result'
              ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-white border border-slate-200 dark:border-[#334155] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#161f30]'
          }`}
        >
          <Scan className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>Verification</span>
        </button>

        <button
          id="desktop-nav-ela"
          onClick={() => onNavigate('forensic_inspector')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            currentScreen === 'forensic_inspector'
              ? 'bg-white dark:bg-[#1e293b] text-emerald-600 dark:text-white border border-slate-200 dark:border-[#334155] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#161f30]'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Visual ELA</span>
        </button>

        <button
          id="desktop-nav-history"
          onClick={() => onNavigate('history')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            currentScreen === 'history'
              ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-white border border-slate-200 dark:border-[#334155] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#161f30]'
          }`}
        >
          <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Audit Log</span>
        </button>

        <button
          id="desktop-nav-settings"
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            currentScreen === 'settings'
              ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-white border border-slate-200 dark:border-[#334155] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#161f30]'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Network Status */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#243247] px-3 py-1 rounded-full text-xs text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
          <span>1,204 Nodes Online</span>
        </div>

        {/* Gemini API Key Status */}
        {onOpenApiKeyModal && (
          <button
            id="top-nav-apikey-btn"
            onClick={onOpenApiKeyModal}
            title={
              geminiConfigured
                ? 'Neural AI Vision Core: Connected and active'
                : 'Local Heuristic Engine Active (Click to connect Groq or Google Gemini API Key for live multimodal detection)'
            }
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer shadow-xs ${
              geminiConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                geminiConfigured ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-amber-500 dark:bg-amber-400'
              }`}
            ></span>
            {geminiConfigured ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Key className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            )}
            <span>{geminiConfigured ? 'AI Vision: Connected' : 'Connect AI Key'}</span>
          </button>
        )}

        {/* Change Profile Avatar Button */}
        {currentScreen !== 'profile' && (
          <button
            id="change-profile-button"
            onClick={() => onNavigate('profile')}
            className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-[#111827] hover:bg-slate-200 dark:hover:bg-[#1e293b] border border-slate-200 dark:border-[#243247] hover:border-slate-400 transition-colors cursor-pointer focus:outline-none"
            title={`Account Profile: ${operative.name} (${operative.clearance})`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-[#243247] flex-shrink-0">
              {operative.avatarUrl ? (
                <img
                  src={operative.avatarUrl}
                  alt={operative.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-[#161f30] flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0b0f17]"></div>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};
