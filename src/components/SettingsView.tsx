import React from 'react';
import {
  Moon,
  Sun,
  Bell,
  FileText,
  ShieldAlert,
  ChevronRight,
  LogOut,
  Sliders,
  ArrowLeft,
} from 'lucide-react';
import { SystemConfig } from '../types';
import { AppLogo } from './AppLogo';

interface SettingsViewProps {
  config: SystemConfig;
  onUpdateConfig: (updated: Partial<SystemConfig>) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onTerminateSession: () => void;
  onBackToHome: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  onOpenTerms,
  onOpenPrivacy,
  onTerminateSession,
  onBackToHome,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 dark:text-[#8c909f] dark:hover:text-[#adc6ff] font-mono-tech transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&lt; RETURN TO ACTIVE SURVEILLANCE</span>
        </button>

        <span className="text-xs font-mono-tech font-bold text-blue-600 dark:text-[#adc6ff] bg-white dark:bg-[#112036] border border-slate-200 dark:border-[#233554] px-2.5 py-1 rounded-md shadow-xs">
          SYSTEM PREFERENCES
        </span>
      </div>

      {/* Header */}
      <header className="text-center flex flex-col items-center justify-center">
        <AppLogo size="lg" animated={true} className="mb-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-[#d6e3ff] mb-1.5 font-['Inter']">
          Configuration Protocol
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#c2c6d6] font-['Inter']">
          Adjust system parameters, AI sensitivity, and verification thresholds.
        </p>
      </header>

      {/* System Preferences Card */}
      <section className="bg-white dark:bg-[#112240] rounded-2xl border border-slate-200 dark:border-[#233554] p-6 flex flex-col gap-4 shadow-sm dark:shadow-xl transition-colors">
        <h3 className="font-mono-tech text-xs text-blue-600 dark:text-[#adc6ff] border-b border-slate-200 dark:border-[#233554] pb-2 uppercase tracking-wider font-semibold">
          SYSTEM PREFERENCES
        </h3>

        {/* Dark / Light Mode */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[#233554]">
          <div className="flex items-center gap-3">
            {!config.darkMode ? (
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-950/40 flex items-center justify-center text-blue-400">
                <Moon className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-[#d6e3ff] block font-['Inter']">
                {!config.darkMode ? 'Light Mode (Active)' : 'Dark Mode (Active)'}
              </span>
              <span className="text-xs text-slate-500 dark:text-[#8c909f] font-mono-tech">
                {!config.darkMode
                  ? 'Clean high-visibility daylight interface'
                  : 'High-contrast tactical dark HUD theme'}
              </span>
            </div>
          </div>
          <button
            id="settings-toggle-darkmode"
            onClick={() => onUpdateConfig({ darkMode: !config.darkMode })}
            className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shadow-inner ${
              !config.darkMode ? 'bg-slate-300 dark:bg-blue-600' : 'bg-blue-600'
            }`}
            title={!config.darkMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-md transition-all duration-200 ${
                !config.darkMode ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        {/* Real-time Alerts */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-[#8c909f]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-[#d6e3ff] block font-['Inter']">
                Real-time Alerts
              </span>
              <span className="text-xs text-slate-500 dark:text-[#8c909f] font-mono-tech">
                Immediate notifications on vector compromise
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateConfig({ realTimeAlerts: !config.realTimeAlerts })
            }
            className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shadow-inner ${
              config.realTimeAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-[#27354c]'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-md transition-transform ${
                config.realTimeAlerts ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>
      </section>

      {/* Cyber Defense Theme Switcher */}
      <section className="bg-white dark:bg-[#112240] rounded-2xl border border-slate-200/90 dark:border-[#233554] p-6 flex flex-col gap-3 shadow-sm dark:shadow-xl transition-colors">
        <h3 className="font-mono-tech text-xs text-blue-600 dark:text-[#adc6ff] border-b border-slate-100 dark:border-[#233554] pb-2 uppercase tracking-wider flex items-center justify-between font-semibold">
          <span>SURVEILLANCE INTERFACE THEME</span>
          <span className="text-[10px] text-emerald-600 dark:text-[#4edea3] font-bold">3 PRESETS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Preset 1: Midnight Blue */}
          <button
            type="button"
            onClick={() => onUpdateConfig({ theme: 'midnight' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              (config.theme || 'midnight') === 'midnight'
                ? 'border-2 border-blue-500 bg-white dark:bg-[#0A192F] shadow-sm'
                : 'border-transparent bg-[#536179] dark:bg-[#161f30] hover:bg-[#475569] dark:hover:bg-[#1e293b]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs"></span>
              <span
                className={`text-xs font-mono-tech font-bold ${
                  (config.theme || 'midnight') === 'midnight'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-white'
                }`}
              >
                Midnight Blue
              </span>
            </div>
            <span
              className={`text-[10px] font-mono-tech block ${
                (config.theme || 'midnight') === 'midnight'
                  ? 'text-slate-600 dark:text-[#8c909f]'
                  : 'text-slate-300'
              }`}
            >
              Aletheia Navy Core
            </span>
          </button>

          {/* Preset 2: Matrix Emerald */}
          <button
            type="button"
            onClick={() => onUpdateConfig({ theme: 'emerald' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              config.theme === 'emerald'
                ? 'border-2 border-emerald-400 bg-white dark:bg-[#0A192F] shadow-sm'
                : 'border-transparent bg-[#536179] dark:bg-[#161f30] hover:bg-[#475569] dark:hover:bg-[#1e293b]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-xs"></span>
              <span
                className={`text-xs font-mono-tech font-bold ${
                  config.theme === 'emerald'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-white'
                }`}
              >
                Matrix Emerald
              </span>
            </div>
            <span
              className={`text-[10px] font-mono-tech block ${
                config.theme === 'emerald'
                  ? 'text-slate-600 dark:text-[#8c909f]'
                  : 'text-slate-300'
              }`}
            >
              Cyber Terminal
            </span>
          </button>

          {/* Preset 3: Amber Recon */}
          <button
            type="button"
            onClick={() => onUpdateConfig({ theme: 'amber' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              config.theme === 'amber'
                ? 'border-2 border-amber-500 bg-white dark:bg-[#0A192F] shadow-sm'
                : 'border-transparent bg-[#536179] dark:bg-[#161f30] hover:bg-[#475569] dark:hover:bg-[#1e293b]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs"></span>
              <span
                className={`text-xs font-mono-tech font-bold ${
                  config.theme === 'amber'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-white'
                }`}
              >
                Amber Recon
              </span>
            </div>
            <span
              className={`text-[10px] font-mono-tech block ${
                config.theme === 'amber'
                  ? 'text-slate-600 dark:text-[#8c909f]'
                  : 'text-slate-300'
              }`}
            >
              Tactical Obsidian
            </span>
          </button>
        </div>
      </section>

      {/* AI Verification Sensitivity Card */}
      <section className="bg-white dark:bg-[#112240] rounded-2xl border border-slate-200/90 dark:border-[#233554] p-6 flex flex-col gap-3 shadow-sm dark:shadow-xl transition-colors">
        <h3 className="font-mono-tech text-xs text-blue-600 dark:text-[#adc6ff] border-b border-slate-100 dark:border-[#233554] pb-2 uppercase tracking-wider flex items-center justify-between font-semibold">
          <span>AI VERIFICATION SENSITIVITY</span>
          <Sliders className="w-4 h-4 text-blue-600 dark:text-[#4d8eff]" />
        </h3>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center w-full text-xs font-mono-tech">
            <span className="text-slate-500 dark:text-[#8c909f]">Permissive (50%)</span>
            <span className="font-bold text-emerald-600 dark:text-[#4edea3]">
              {config.aiSensitivity >= 80 ? 'Strict' : config.aiSensitivity >= 65 ? 'Balanced' : 'Permissive'} ({config.aiSensitivity}%)
            </span>
            <span className="text-slate-500 dark:text-[#8c909f]">Ultra-Strict (95%)</span>
          </div>

          {/* Interactive Range Slider */}
          <div className="py-2">
            <input
              id="ai-sensitivity-slider"
              type="range"
              min="50"
              max="95"
              step="5"
              value={config.aiSensitivity}
              onChange={(e) =>
                onUpdateConfig({ aiSensitivity: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-[#0f172a] rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          <p className="font-mono-tech text-xs text-slate-700 dark:text-[#c2c6d6] text-center bg-slate-50/80 dark:bg-[#0A192F] py-2.5 px-3 rounded-xl border border-slate-200 dark:border-[#233554]">
            Current Threshold: <span className="text-emerald-600 dark:text-[#4edea3] font-bold">{config.aiSensitivity}% Confidence</span> Required for Automated Verdict
          </p>
        </div>
      </section>

      {/* Legal & Compliance Card */}
      <section className="bg-white dark:bg-[#112240] rounded-2xl border border-slate-200 dark:border-[#233554] p-6 flex flex-col gap-2 shadow-sm dark:shadow-xl transition-colors">
        <h3 className="font-mono-tech text-xs text-blue-600 dark:text-[#adc6ff] border-b border-slate-200 dark:border-[#233554] pb-2 uppercase tracking-wider font-semibold">
          LEGAL &amp; COMPLIANCE
        </h3>

        {/* Terms of Service */}
        <button
          onClick={onOpenTerms}
          className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-[#1c2a41] transition-colors rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-[#233554] text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-slate-500 dark:text-[#8c909f]" />
            <span className="text-sm font-medium text-slate-900 dark:text-[#d6e3ff] font-['Inter']">
              Terms of Service
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[#8c909f]" />
        </button>

        {/* Privacy Policy */}
        <button
          onClick={onOpenPrivacy}
          className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-[#1c2a41] transition-colors rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-[#233554] text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-slate-500 dark:text-[#8c909f]" />
            <span className="text-sm font-medium text-slate-900 dark:text-[#d6e3ff] font-['Inter']">
              Privacy Policy &amp; Data Telemetry
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[#8c909f]" />
        </button>
      </section>

      {/* Terminate Session Action */}
      <div className="pt-2 pb-12 md:pb-6">
        <button
          id="settings-terminate-session-button"
          onClick={onTerminateSession}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white glossy-btn-red flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </div>
  );
};
