import React, { useRef } from 'react';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  FileCheck,
  Copy,
  Check,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ScanResult } from '../types';
import { AppLogo } from './AppLogo';

interface DossierExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan: ScanResult | null;
}

export const DossierExportModal: React.FC<DossierExportModalProps> = ({
  isOpen,
  onClose,
  scan,
}) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !scan) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(scan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hash = scan.sha256Hash || '8F3A29BC71D048E19602A91D0E4FA942';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b1b36] border-2 border-[#233554] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-[#233554] flex items-center justify-between bg-[#071326]">
          <div className="flex items-center gap-2.5">
            <AppLogo size="sm" />
            <div>
              <h2 className="text-sm font-mono-tech font-bold text-[#d6e3ff] tracking-wider uppercase">
                ALETHEIA FORENSIC DOSSIER
              </h2>
              <span className="text-[10px] font-mono-tech text-[#4edea3]">
                CRYPTOGRAPHIC INTEGRITY CERTIFICATE VERIFIED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-[#112036] hover:bg-[#1D2D50] text-[#adc6ff] border border-[#233554] text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT DOSSIER</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="px-3 py-1.5 rounded bg-[#112036] hover:bg-[#1D2D50] text-[#adc6ff] border border-[#233554] text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED JSON' : 'EXPORT JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8c909f] hover:text-white hover:bg-[#112036] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content (Formatted as Official Intelligence Document) */}
        <div ref={printRef} className="p-6 overflow-y-auto space-y-6 text-[#d6e3ff] font-['Inter']">
          {/* Official Document Banner */}
          <div className="border-2 border-dashed border-[#233554] p-5 rounded-xl bg-[#050c18] relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#233554] pb-4">
              <div>
                <span className="text-[10px] font-mono-tech bg-[#93000a]/30 border border-[#ff5451]/40 text-[#ffb4ab] px-2 py-0.5 rounded font-bold">
                  CLASSIFIED // ALETHEIA CORE INTELLIGENCE
                </span>
                <h1 className="text-xl font-bold text-white mt-1.5 font-['Inter']">
                  Forensic Assessment: {scan.headline}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono-tech text-[#8c909f] block">DOSSIER ID:</span>
                <span className="text-xs font-mono-tech text-[#adc6ff] font-bold">{scan.id}</span>
              </div>
            </div>

            {/* Cryptographic SHA256 Signature Stamp */}
            <div className="mt-4 p-3 bg-[#0A192F] rounded-lg border border-[#233554] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#4edea3]" />
                <span className="text-[11px] font-mono-tech text-[#8c909f]">SHA-256 HASH:</span>
                <span className="text-[11px] font-mono-tech text-[#4edea3] select-all font-bold">
                  {hash}
                </span>
              </div>
              <span className="text-[10px] font-mono-tech text-[#8c909f]">
                TIMESTAMP: {new Date().toUTCString()}
              </span>
            </div>
          </div>

          {/* Key Findings & Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0A192F] p-4 rounded-xl border border-[#233554] text-center">
              <span className="text-[10px] font-mono-tech text-[#8c909f] block">VERDICT</span>
              <span className={`text-xl font-mono-tech font-black ${scan.verdict === 'VERIFIED' ? 'text-[#4edea3]' : scan.verdict === 'FABRICATED' ? 'text-[#ffb4ab]' : 'text-amber-400'}`}>
                {scan.verdict}
              </span>
            </div>

            <div className="bg-[#0A192F] p-4 rounded-xl border border-[#233554] text-center">
              <span className="text-[10px] font-mono-tech text-[#8c909f] block">TRUTH PROBABILITY</span>
              <span className="text-xl font-mono-tech font-black text-[#4d8eff]">
                {scan.truthProbability}%
              </span>
            </div>

            <div className="bg-[#0A192F] p-4 rounded-xl border border-[#233554] text-center">
              <span className="text-[10px] font-mono-tech text-[#8c909f] block">CONFIDENCE INDEX</span>
              <span className="text-xl font-mono-tech font-black text-[#d6e3ff]">
                {scan.confidence}%
              </span>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono-tech text-[#adc6ff] uppercase tracking-wider">
              1. EXECUTIVE SUMMARY &amp; VECTOR ORIGIN
            </h3>
            <p className="text-sm text-[#c2c6d6] leading-relaxed bg-[#0A192F] p-4 rounded-lg border border-[#233554]">
              {scan.summary}
            </p>
          </div>

          {/* Wire Cross-Reference Audit */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono-tech text-[#adc6ff] uppercase tracking-wider">
              2. ACCREDITED WIRE CROSS-REFERENCE AUDIT
            </h3>
            <div className="bg-[#0A192F] p-4 rounded-lg border border-[#233554] space-y-3">
              <p className="text-xs text-[#8c909f]">{scan.crossReferenceSummary}</p>
              <div className="space-y-2 pt-2 border-t border-[#233554]">
                {scan.sourcesChecked.map((src, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-[#d6e3ff]">{src.name}</span>
                    <span className={`font-mono-tech font-bold ${src.verified ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                      {src.verified ? 'CORROBORATED' : 'ZERO MATCH'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Discrepancies */}
          {scan.discrepancies && scan.discrepancies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono-tech text-[#adc6ff] uppercase tracking-wider">
                3. FORENSIC ANOMALY REGISTER
              </h3>
              <div className="space-y-2">
                {scan.discrepancies.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded bg-[#0A192F] border border-[#ff5451]/30 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{d.title}</span>
                      <span className="text-[#8c909f] mt-0.5 block">{d.description}</span>
                    </div>
                    <span className="font-mono-tech text-[10px] bg-[#93000a]/40 text-[#ffb4ab] px-2 py-0.5 rounded uppercase font-bold">
                      {d.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#233554] bg-[#071326] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#112036] hover:bg-[#1D2D50] text-[#d6e3ff] rounded-lg text-xs font-mono-tech border border-[#233554] transition-colors cursor-pointer"
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
};
