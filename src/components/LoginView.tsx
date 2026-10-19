import React, { useState } from 'react';
import { Shield, User, Key, LogIn, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, UserPlus, Database, Sparkles, Lock } from 'lucide-react';
import { AletheiaLoadingLogo } from './AletheiaLoadingLogo';
import {
  loginOperativeWithFirebase,
  registerOperativeWithFirebase,
} from '../lib/authService';
import { OperativeProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (operativeId: string, profile?: Partial<OperativeProfile>) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [operativeId, setOperativeId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = operativeId.trim();
    if (!cleanId) {
      setErrorMsg('Operative identification string or email is required.');
      return;
    }

    if (!passphrase) {
      setErrorMsg('Passphrase is required to authenticate.');
      return;
    }

    // REGISTRATION FLOW (CREATE ACCOUNT)
    if (isRegisterMode) {
      if (passphrase.length < 6) {
        setErrorMsg('Passphrase must be at least 6 characters for Firebase cryptographic enclave.');
        return;
      }
      if (confirmPassphrase && passphrase !== confirmPassphrase) {
        setErrorMsg('Passphrases do not match. Please re-enter.');
        return;
      }

      setIsAuthenticating(true);
      try {
        const { user, profile } = await registerOperativeWithFirebase(cleanId, passphrase);
        setSuccessMsg('Account registered in Firebase Enclave! Initializing dashboard...');
        setTimeout(() => {
          setIsAuthenticating(false);
          onLoginSuccess(user.displayName || cleanId, profile);
        }, 800);
      } catch (err: any) {
        setIsAuthenticating(false);
        const code = err?.code || '';
        if (code === 'auth/email-already-in-use') {
          setErrorMsg('An operative account with this identification already exists. Please log in.');
        } else {
          setErrorMsg(err?.message || 'Failed to create operative account in Firebase.');
        }
      }
      return;
    }

    // LOGIN FLOW
    setIsAuthenticating(true);
    try {
      const { user, profile } = await loginOperativeWithFirebase(cleanId, passphrase);
      setSuccessMsg('Identity verified via Firebase Enclave. Access granted.');
      setTimeout(() => {
        setIsAuthenticating(false);
        onLoginSuccess(user.displayName || cleanId, profile);
      }, 600);
    } catch (err: any) {
      setIsAuthenticating(false);
      setErrorMsg(
        err?.message ||
          'ACCESS DENIED: Operative account not recognized. You must create an account first before logging in.'
      );
    }
  };

  const switchToRegister = () => {
    setIsRegisterMode(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const switchToLogin = () => {
    setIsRegisterMode(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#070b13] px-4 py-8">
      {/* Background Ambient Cyber Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.22),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Main Login / Register Container */}
      <main className="w-full max-w-[440px] relative z-10 animate-fadeIn">
        <div className="bg-[#0e172a]/90 backdrop-blur-2xl border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden relative">
          
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          <div className="p-7 sm:p-9 flex flex-col items-center">
            {/* Holographic Cyber Shield Logo from Loading Screen */}
            <div className="mb-4 flex items-center justify-center">
              <AletheiaLoadingLogo size="md" />
            </div>

            {/* Title & Brand */}
            <div className="text-center space-y-1 mb-6">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Inter',sans-serif]">
                  Aletheia
                </h1>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <p className="text-xs text-blue-400/90 font-mono tracking-wider uppercase font-semibold">
                {isRegisterMode ? 'CREATE OPERATIVE ID' : 'THREAT INTELLIGENCE & TRUTH VERIFICATION'}
              </p>
            </div>

            {/* Error Alert Box */}
            {errorMsg && (
              <div className="w-full mb-4 text-xs text-rose-200 bg-rose-950/70 border border-rose-500/50 p-3.5 rounded-xl flex flex-col gap-2 shadow-inner">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
                {!isRegisterMode && errorMsg.includes('create an account') && (
                  <button
                    type="button"
                    onClick={switchToRegister}
                    className="self-start text-[11px] font-bold text-amber-300 hover:text-white underline mt-1 flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Click here to Create Account now &rarr;</span>
                  </button>
                )}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="w-full mb-4 text-xs text-emerald-200 bg-emerald-950/70 border border-emerald-500/50 p-3.5 rounded-xl flex items-center gap-2.5 shadow-inner">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* OPERATIVE ID */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase tracking-wider flex items-center justify-between">
                  <span>Operative ID or Email</span>
                  {isRegisterMode && <span className="text-cyan-400 text-[10px]">*Required</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-operative-id"
                    type="text"
                    value={operativeId}
                    onChange={(e) => setOperativeId(e.target.value)}
                    placeholder={isRegisterMode ? "Choose Operative ID or email" : "Enter identification string or email"}
                    className="w-full bg-[#131d31] border border-slate-700/80 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-slate-100 placeholder-slate-500 font-medium rounded-xl pl-10 pr-4 py-3 text-sm shadow-inner transition-all outline-none font-['Inter',sans-serif]"
                    required
                  />
                </div>
              </div>

              {/* PASSPHRASE */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                    <span>Passphrase</span>
                    {isRegisterMode && <span className="text-cyan-400 text-[10px] ml-1.5">(min 6 chars)</span>}
                  </label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={() =>
                        alert('Passphrase recovery token dispatched to your Firebase enclave authorization channel.')
                      }
                      className="font-mono text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      Recover?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    id="login-passphrase"
                    type={showPassphrase ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#131d31] border border-slate-700/80 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-slate-100 placeholder-slate-500 font-medium rounded-xl pl-10 pr-11 py-3 text-sm shadow-inner transition-all outline-none font-['Inter',sans-serif]"
                    required
                  />
                  <button
                    type="button"
                    id="toggle-show-passphrase-button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
                  >
                    {showPassphrase ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Passphrase when in Register Mode */}
              {isRegisterMode && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase tracking-wider flex items-center justify-between">
                    <span>Confirm Passphrase</span>
                    <span className="text-cyan-400 text-[10px]">*Required</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-confirm-passphrase"
                      type={showPassphrase ? 'text' : 'password'}
                      value={confirmPassphrase}
                      onChange={(e) => setConfirmPassphrase(e.target.value)}
                      placeholder="Repeat passphrase"
                      className="w-full bg-[#131d31] border border-slate-700/80 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-slate-100 placeholder-slate-500 font-medium rounded-xl pl-10 pr-4 py-3 text-sm shadow-inner transition-all outline-none font-['Inter',sans-serif]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* ACTION Button */}
              <button
                id="login-submit-button"
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-sm font-bold tracking-widest uppercase rounded-xl py-3.5 px-4 flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] cursor-pointer mt-5"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{isRegisterMode ? 'CONNECTING FIREBASE...' : 'AUTHENTICATING...'}</span>
                  </>
                ) : isRegisterMode ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>CREATE ACCOUNT</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>LOG IN</span>
                  </>
                )}
              </button>
            </form>

            {/* Mode Switcher Footer */}
            <div className="w-full text-center mt-6">
              {isRegisterMode ? (
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="font-mono text-xs font-medium uppercase tracking-wider cursor-pointer"
                >
                  <span className="text-slate-400">Already registered? </span>
                  <span className="text-blue-400 hover:text-blue-300 font-bold underline ml-1">Log In</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="font-mono text-xs font-medium uppercase tracking-wider cursor-pointer"
                >
                  <span className="text-slate-400">New Operative? </span>
                  <span className="text-blue-400 hover:text-blue-300 font-bold underline ml-1">Create Account</span>
                </button>
              )}
            </div>

            {/* Live Firebase Enclave Status Tag */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 w-full flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Firebase Enclave: <strong className="text-slate-200">steel-camp-m1ttq</strong></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ml-0.5"></span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
