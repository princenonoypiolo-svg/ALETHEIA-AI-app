import React, { useState } from 'react';
import {
  User,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { AletheiaLoadingLogo } from './AletheiaLoadingLogo';
import { OperativeProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (operativeId: string, profile?: Partial<OperativeProfile>) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(() => {
    try {
      const saved = localStorage.getItem('aletheia_operative');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed.name !== 'Agent 01') return parsed.name;
      }
    } catch {}
    return '';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim() || 'Agent 01';

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(cleanUsername, {
        name: cleanUsername,
        operativeId: cleanUsername.toUpperCase().replace(/\s+/g, '-'),
      });
    }, 350);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#070b13] px-4 py-8">
      {/* Background Ambient Cyber Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.22),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-[420px] relative z-10 animate-fadeIn">
        <div className="bg-[#0e172a]/90 backdrop-blur-2xl border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden relative">
          
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          <div className="p-7 sm:p-9 flex flex-col items-center">
            {/* Holographic Cyber Shield Logo */}
            <div className="mb-4 flex items-center justify-center">
              <AletheiaLoadingLogo size="md" />
            </div>

            {/* Title & Brand with Welcome Header */}
            <div className="text-center space-y-1.5 mb-6">
              <p className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Welcome to
              </p>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Inter',sans-serif]">
                  Aletheia
                </h1>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <p className="text-xs text-blue-400/90 font-mono tracking-wider uppercase font-semibold">
                THREAT INTELLIGENCE & VERIFICATION
              </p>
            </div>

            {/* Username Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                  <span>Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoFocus
                    className="w-full bg-[#131d31] border border-slate-700/80 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-slate-100 placeholder-slate-500 font-medium rounded-xl pl-10 pr-4 py-3.5 text-sm shadow-inner transition-all outline-none font-['Inter',sans-serif]"
                  />
                </div>
              </div>

              {/* Proceed Button */}
              <button
                id="proceed-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-sm font-bold tracking-widest uppercase rounded-xl py-3.5 px-4 flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>ENTERING SYSTEM...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
};
