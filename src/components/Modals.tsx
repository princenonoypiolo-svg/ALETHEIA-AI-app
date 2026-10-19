import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Shield,
  Key,
  CheckCircle2,
  Share2,
  Copy,
  Download,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Cpu,
} from 'lucide-react';
import { OperativeProfile, ScanResult } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  operative: OperativeProfile;
  onSave: (updated: Partial<OperativeProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  operative,
  onSave,
}) => {
  const [name, setName] = useState(operative.name);
  const [operativeId, setOperativeId] = useState(operative.operativeId);
  const [clearance, setClearance] = useState(operative.clearance);
  const [bio, setBio] = useState(operative.bio);
  const [avatarUrl, setAvatarUrl] = useState(operative.avatarUrl || '');
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  ];

  if (!isOpen) return null;

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, operativeId, clearance, bio, avatarUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#112036] border border-[#233554] rounded-xl max-w-md w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8c909f] hover:text-[#d6e3ff] p-1 rounded hover:bg-[#1c2a41]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#adc6ff] mb-4 flex items-center gap-2 font-['Inter']">
          <User className="w-5 h-5 text-[#4d8eff]" />
          <span>Change Operative Profile</span>
        </h2>

        {/* Hidden device upload input */}
        <input
          ref={modalFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleDeviceUpload}
          className="hidden"
        />

        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-['Inter']">
          {/* Avatar Selection & Upload */}
          <div>
            <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1.5 flex items-center justify-between">
              <span>Avatar Identification</span>
              <span className="text-[10px] text-[#4d8eff]">LOCAL OR PRESET</span>
            </label>
            <div className="flex items-center gap-3 mb-2.5">
              <div
                onClick={() => modalFileInputRef.current?.click()}
                className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#4d8eff] flex-shrink-0 cursor-pointer group shadow-[0_0_12px_rgba(77,142,255,0.25)]"
                title="Click to choose image from your device"
              >
                <img
                  src={avatarUrl || AVATAR_PRESETS[0]}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  className="w-full py-1.5 px-3 rounded bg-[#1c2a41] hover:bg-[#273a5a] border border-[#233554] hover:border-[#4d8eff]/50 text-xs font-mono-tech text-[#adc6ff] hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#4d8eff]" />
                  <span>CHOOSE FROM DEVICE</span>
                </button>

                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] font-mono-tech text-[#8c909f]">PRESETS:</span>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`w-6 h-6 rounded-full overflow-hidden border transition-all cursor-pointer ${
                        avatarUrl === preset
                          ? 'border-[#4d8eff] scale-110 shadow-[0_0_6px_#4d8eff]'
                          : 'border-[#233554] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <input
              type="url"
              placeholder="Or enter direct image URL..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] placeholder-[#424754] text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          <div>
            <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1">
              Operative Codename
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] rounded px-3 py-2 focus:outline-none focus:border-[#4d8eff]"
              required
            />
          </div>

          <div>
            <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1">
              Badge ID
            </label>
            <input
              type="text"
              value={operativeId}
              onChange={(e) => setOperativeId(e.target.value)}
              className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] rounded px-3 py-2 focus:outline-none focus:border-[#4d8eff]"
              required
            />
          </div>

          <div>
            <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1">
              Clearance Level
            </label>
            <select
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] rounded px-3 py-2 focus:outline-none focus:border-[#4d8eff] font-mono-tech text-xs"
            >
              <option value="LEVEL 4 (SUPERVISOR)">LEVEL 4 (SUPERVISOR)</option>
              <option value="LEVEL 5 (DIRECTOR)">LEVEL 5 (DIRECTOR)</option>
              <option value="SPECIAL OPERATIVE">SPECIAL OPERATIVE</option>
              <option value="SECURITY RESEARCHER">SECURITY RESEARCHER</option>
            </select>
          </div>

          <div>
            <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1">
              Mission Directive / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] rounded px-3 py-2 focus:outline-none focus:border-[#4d8eff] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-mono-tech text-[#8c909f] hover:text-[#d6e3ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glossy-btn-blue text-white px-5 py-2 rounded text-xs font-mono-tech font-bold uppercase tracking-wider cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#112036] border border-[#233554] rounded-xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8c909f] hover:text-[#d6e3ff] p-1 rounded hover:bg-[#1c2a41]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#adc6ff] mb-4 flex items-center gap-2 font-['Inter']">
          <Key className="w-5 h-5 text-[#4d8eff]" />
          <span>Rotate Cryptographic Passphrase</span>
        </h2>

        {submitted ? (
          <div className="py-8 text-center text-[#4edea3] space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
            <p className="font-bold text-base">Key Rotation Complete</p>
            <p className="text-xs text-[#8c909f]">New cryptographic hash committed to security ring.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm font-['Inter']">
            <div>
              <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1">
                Current Passphrase
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] rounded pl-3 pr-10 py-2 focus:outline-none focus:border-[#4d8eff]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c909f] hover:text-[#adc6ff] cursor-pointer"
                  title={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono-tech text-xs text-[#8c909f] block uppercase mb-1">
                New Passphrase (Min 16 chars)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••••••••••"
                  required
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] rounded pl-3 pr-10 py-2 focus:outline-none focus:border-[#4d8eff]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c909f] hover:text-[#adc6ff] cursor-pointer"
                  title={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-mono-tech text-[#8c909f] hover:text-[#d6e3ff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glossy-btn-blue text-white px-5 py-2 rounded text-xs font-mono-tech font-bold uppercase tracking-wider"
              >
                Update Key
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#112036] border border-[#233554] rounded-xl max-w-xl w-full p-6 relative shadow-2xl max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8c909f] hover:text-[#d6e3ff] p-1 rounded hover:bg-[#1c2a41]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#adc6ff] mb-4 flex items-center gap-2 font-['Inter']">
          <FileText className="w-5 h-5 text-[#4d8eff]" />
          <span>{type === 'terms' ? 'Terms of Service & Rules of Engagement' : 'Data Privacy & Cryptographic Telemetry Policy'}</span>
        </h2>

        <div className="flex-1 overflow-y-auto space-y-3 text-xs font-['Inter'] text-[#c2c6d6] leading-relaxed pr-2">
          {type === 'terms' ? (
            <>
              <p className="font-semibold text-[#d6e3ff]">1. Authorization and Scope</p>
              <p>Operatives granted OMEGA or SIGMA credentials must strictly use Aletheia for defense analysis, fact corroboration, and media integrity auditing.</p>
              <p className="font-semibold text-[#d6e3ff]">2. Algorithmic Confidence &amp; Disclaimers</p>
              <p>Scores rendered reflect automated Bayesian multi-source evaluation, GAN noise decomposition, and registered news wire cross-checks. Field operatives maintain final human-in-the-loop responsibility.</p>
              <p className="font-semibold text-[#d6e3ff]">3. Confidentiality &amp; Leak Containment</p>
              <p>Classified documents parsed via the vector engine undergo client-side hash anonymization prior to cloud heuristic processing.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#d6e3ff]">1. Telemetry Privacy</p>
              <p>Scanning vectors are stripped of client IP addresses and user identifiable data before threat intelligence cross-indexing.</p>
              <p className="font-semibold text-[#d6e3ff]">2. Local Encrypted Cache</p>
              <p>All forensic dossiers, logs, and operative credentials reside within authenticated local storage layers unless explicit cloud synchronization is enabled.</p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-[#233554] flex justify-end">
          <button
            onClick={onClose}
            className="glossy-btn-blue text-white px-5 py-2 rounded text-xs font-mono-tech font-bold uppercase tracking-wider"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan: ScanResult | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, scan }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !scan) return null;

  const shareText = `[ALETHEIA INTELLIGENCE DOSSIER]\nTarget Vector: ${scan.target}\nVerdict: ${scan.verdict} (${scan.truthProbability}% Truth Probability)\nConfidence: ${scan.confidence}%\nHeadline: ${scan.headline}\nSummary: ${scan.summary}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aletheia-dossier-${scan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#112036] border border-[#233554] rounded-xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8c909f] hover:text-[#d6e3ff] p-1 rounded hover:bg-[#1c2a41]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#adc6ff] mb-3 flex items-center gap-2 font-['Inter']">
          <Share2 className="w-5 h-5 text-[#4d8eff]" />
          <span>Export Intelligence Dossier</span>
        </h2>

        <div className="bg-[#0A192F] p-3 rounded border border-[#233554] text-xs font-mono-tech text-[#c2c6d6] whitespace-pre-wrap max-h-48 overflow-y-auto mb-4">
          {shareText}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopy}
            className="w-full glossy-btn-blue text-white py-2.5 rounded text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Formatted Report'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="w-full bg-[#0A192F] hover:bg-[#1D2D50] border border-[#233554] text-[#adc6ff] py-2.5 rounded text-xs font-mono-tech flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Raw JSON Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyConfigured: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = apiKey.trim();
    if (!clean || clean.length < 8) {
      setError('Please provide a valid Groq API key (starts with gsk_...)');
      return;
    }

    if (!clean.startsWith('gsk_')) {
      setError("Please provide a valid Groq API key starting with 'gsk_...'. You can find yours at console.groq.com/keys.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: clean }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to configure Groq API key');
      }

      setSuccess('Groq Neural Vision Core successfully verified and armed!');
      onKeyConfigured();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Error configuring Groq API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Inter']">
      <div className="bg-[#112036] border border-[#233554] rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4d8eff]/15 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8c909f] hover:text-[#d6e3ff] p-1.5 rounded-lg hover:bg-[#1c2a41] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A192F] border border-[#4d8eff]/50 flex items-center justify-center text-[#4d8eff] shadow-[0_0_15px_rgba(77,142,255,0.3)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#adc6ff] tracking-tight font-['Inter']">
              Groq Neural Vision Core
            </h2>
            <p className="text-xs text-emerald-400 font-mono-tech flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              STATUS: PRE-CONFIGURED &amp; ARMED
            </p>
          </div>
        </div>

        {/* Active confirmation banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 mb-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 block mb-0.5">Groq API Key Active &amp; Ready</strong>
            Your app is permanently powered by Groq. You do not need to input any key to scan images, detect deepfakes, or verify intelligence.
          </div>
        </div>

        {error && (
          <div className="bg-[#ffb4ab]/15 border border-[#ff5451]/40 text-[#ffb4ab] text-xs p-3 rounded-lg mb-4 font-mono-tech">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#4edea3]/15 border border-[#4edea3]/40 text-[#4edea3] text-xs p-3 rounded-lg mb-4 font-mono-tech flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-[#8c909f] uppercase tracking-wider block">
              Override / Update Groq Key (<span className="text-[#4d8eff]">gsk_...</span>) [Optional]
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_... (leave empty to keep current key)"
                disabled={loading}
                className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] placeholder-[#424754] rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] pr-10 font-mono-tech shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#d6e3ff] cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-1 text-xs font-mono-tech">
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded bg-[#0A192F] border border-[#233554] text-[#4d8eff] hover:border-[#4d8eff] flex items-center justify-between"
            >
              <span>Groq API Console &amp; Keys</span>
              <span>&rarr;</span>
            </a>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 glossy-btn-blue text-white py-3 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>VALIDATING &amp; ARMING CORE...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>ARM INTELLIGENCE CORE</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-[#0A192F] hover:bg-[#1c2a41] border border-[#233554] text-[#8c909f] hover:text-white rounded-lg text-xs font-mono-tech transition-colors cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
