import React, { useState } from 'react';
import { Shield, User, Key, LogIn, Fingerprint, Sparkles, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (operativeId: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [operativeId, setOperativeId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operativeId.trim()) {
      setErrorMsg('Operative identification string is required.');
      return;
    }
    setErrorMsg('');
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(operativeId);
    }, 600);
  };

  const handleBiometricAuth = () => {
    setBiometricScanning(true);
    setErrorMsg('');
    setTimeout(() => {
      setBiometricScanning(false);
      onLoginSuccess('Agent 01 (Biometric FIDO2)');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#041329] px-4 py-8">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0"></div>

      {/* Ambient Glowing Orb */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      ></div>

      {/* Login Card */}
      <main className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="bg-[#112240]/80 backdrop-blur-xl border border-[#233554] rounded-xl p-6 md:p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
          {/* Scanning Line Animation Effect */}
          <div className="scan-line"></div>

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6 w-full border-b border-[#233554] pb-4">
            <div className="w-16 h-16 rounded-full bg-[#112036] flex items-center justify-center mb-3 border border-[#3B82F6]/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Shield className="w-8 h-8 text-[#adc6ff]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#adc6ff] text-center tracking-tight font-['Inter']">
              Aletheia
            </h1>
            <p className="font-mono-tech text-xs text-[#8c909f] uppercase mt-1 tracking-widest">
              {isRegisterMode ? 'CREATE OPERATIVE ID' : 'SECURE ACCESS'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Operative ID */}
            <div className="space-y-1.5">
              <label className="font-mono-tech text-xs text-[#8c909f] block uppercase tracking-wider">
                Operative ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c909f]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-operative-id"
                  type="text"
                  value={operativeId}
                  onChange={(e) => setOperativeId(e.target.value)}
                  placeholder="Enter identification string"
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] placeholder-[#424754] rounded pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                  required
                />
              </div>
            </div>

            {/* Passphrase */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-mono-tech text-xs text-[#8c909f] block uppercase tracking-wider">
                  Passphrase
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() =>
                      alert('Passphrase recovery token dispatched to military clearance gateway.')
                    }
                    className="font-mono-tech text-xs text-[#adc6ff] hover:text-white transition-colors"
                  >
                    Recover?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c909f]">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="login-passphrase"
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] placeholder-[#424754] rounded pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                  required
                />
                <button
                  type="button"
                  id="toggle-show-passphrase-button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c909f] hover:text-[#adc6ff] transition-colors cursor-pointer"
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

            {errorMsg && (
              <div className="text-xs text-[#ffb4ab] bg-[#93000a]/20 border border-[#ff5451]/30 p-2 rounded flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded py-2.5 font-mono-tech text-xs uppercase tracking-widest flex items-center justify-center gap-2 mt-2 text-white font-bold glossy-btn-blue cursor-pointer active:scale-98"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING CIPHER...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isRegisterMode ? 'INITIALIZE CREDENTIAL' : 'LOG IN'}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center my-5">
            <div className="flex-grow border-t border-[#233554]"></div>
            <span className="mx-3 font-mono-tech text-[11px] text-[#8c909f] uppercase tracking-wider">
              OR VERIFY VIA
            </span>
            <div className="flex-grow border-t border-[#233554]"></div>
          </div>

          {/* Biometric Button */}
          <div className="w-full flex justify-center">
            <button
              id="biometric-login-button"
              type="button"
              onClick={handleBiometricAuth}
              disabled={biometricScanning}
              className="w-full glossy-btn-dark py-2.5 rounded flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {biometricScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#4edea3]" />
                  <span className="font-mono-tech text-xs text-[#4edea3]">
                    SCANNING FINGERPRINT...
                  </span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-[#adc6ff]" />
                  <span className="font-mono-tech text-xs text-[#d6e3ff]">
                    BIOMETRIC
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Mode toggle */}
          <div className="w-full text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
              }}
              className="font-mono-tech text-xs text-[#8c909f] hover:text-[#adc6ff] transition-colors uppercase tracking-wider cursor-pointer"
            >
              {isRegisterMode ? (
                <>
                  Already registered? <span className="text-[#adc6ff] underline">Log In</span>
                </>
              ) : (
                <>
                  New Operative? <span className="text-[#adc6ff] underline">Create Account</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className="mt-4 text-center flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></div>
          <span className="font-mono-tech text-xs text-[#8c909f]">
            System Status: Nominal | Node Relay Armed
          </span>
        </div>
      </main>
    </div>
  );
};
