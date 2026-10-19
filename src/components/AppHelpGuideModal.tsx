import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Link2,
  Upload,
  Scan,
  ShieldCheck,
  Layers,
  FileText,
  ArrowRight,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { AiSmileyBot } from './AiSmileyBot';

interface AppHelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleClaim?: (claim: string) => void;
}

export const AppHelpGuideModal: React.FC<AppHelpGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSampleClaim,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      icon: Link2,
      title: 'Enter a Claim, Headline, or URL',
      desc: 'Type or paste any breaking news headline, claim statement, or social media link. Aletheia cross-references verified sources and threat intelligence.',
      tip: 'Tip: You can test text claims alone or pair them with images.',
    },
    {
      num: '02',
      icon: Upload,
      title: 'Upload or Capture Media',
      desc: 'Drag and drop any photo (JPEG, PNG, WebP) or video. You can also snap an authentic photo with the live camera capture.',
      tip: 'Tip: Multi-frame video extraction analyzes sequential keyframes.',
    },
    {
      num: '03',
      icon: Scan,
      title: 'Run AI & Deepfake Detection',
      desc: 'Click "Detect AI & Verify Now". Our neural models inspect diffusion textures, facial blending artifacts, and synthetic generation markers.',
      tip: 'Tip: Groq Vision Core analyzes visual artifacts in seconds.',
    },
    {
      num: '04',
      icon: Layers,
      title: 'Inspect Forensic Visual ELA',
      desc: 'Switch to the Visual ELA studio tab to examine compression differences and tamper heatmaps where pixels were modified or spliced.',
      tip: 'Tip: Altered regions glow bright white/yellow in ELA mode.',
    },
    {
      num: '05',
      icon: FileText,
      title: 'Review Audit Score & Dossiers',
      desc: 'Examine the overall Trust Score (0–100%), evidence breakdown, and download a verifiable forensic PDF or JSON dossier.',
      tip: 'Tip: Every scan is cryptographically signed and locally archived.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-[#0b1322] border border-blue-500/40 rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden my-auto z-10"
        >
          {/* Top Decorative Header Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-blue-950/70 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                    How to Use Aletheia
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950/80 text-blue-400 border border-blue-500/40">
                    GUIDE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Step-by-step walkthrough to detect deepfakes and verify truth
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Friendly Bot Greeting Banner */}
          <div className="mx-5 sm:mx-6 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/50 via-[#101b33] to-blue-950/40 border border-blue-500/30 flex items-center gap-3.5">
            <div className="flex-shrink-0">
              <AiSmileyBot size="sm" />
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-blue-400">Aletheia Robot Assistant:</span>{' '}
              Welcome! Follow these simple steps below to verify whether news or media is genuine or AI-manipulated.
            </div>
          </div>

          {/* Scrollable Guide Steps */}
          <div className="p-5 sm:p-6 space-y-3 max-h-[58vh] overflow-y-auto custom-scrollbar">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="p-3.5 rounded-xl bg-[#0e172a]/70 border border-slate-800/80 hover:border-blue-500/40 transition-colors group flex items-start gap-3.5"
                >
                  <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-500/30 mb-1.5">
                      {s.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-cyan-400/90 font-mono">
                      <Lightbulb className="w-3 h-3 flex-shrink-0" />
                      <span>{s.tip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-blue-950/80 bg-[#080d18] flex flex-col sm:flex-row items-center justify-between gap-3">
            {onSelectSampleClaim ? (
              <button
                type="button"
                onClick={() => {
                  onSelectSampleClaim('Breaking: Unverified viral video circulating on social media claiming unexpected seismic event.');
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Sample Claim</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Engine Ready for Analysis</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <span>Got it, Let's Start!</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
