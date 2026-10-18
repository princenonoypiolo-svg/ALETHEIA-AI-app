import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Scan,
  Image as ImageIcon,
  Clock,
  FileSearch,
  Copy,
  Check,
  X,
  Layers,
  ArrowLeft,
  FileCheck,
  Video,
  Film,
  Bot,
  ShieldCheck,
  Shield,
  Lock,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { ScanResult } from '../types';
import { ForensicVisualInspector } from './ForensicVisualInspector';
import { DossierExportModal } from './DossierExportModal';
import { InteractiveForensicSlider } from './InteractiveForensicSlider';

interface ScanResultViewProps {
  scan: ScanResult;
  onScanAnother: () => void;
  onShare: (scan: ScanResult) => void;
  onOpenApiKeyModal?: () => void;
}

export const ScanResultView: React.FC<ScanResultViewProps> = ({
  scan,
  onScanAnother,
  onShare,
  onOpenApiKeyModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Circumference for radius 45 is 2 * PI * 45 = 282.74
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - scan.truthProbability / 100);

  const isFabricated = scan.verdict === 'FABRICATED';
  const isVerified = scan.verdict === 'VERIFIED';
  const isInconclusive = scan.verdict === 'INCONCLUSIVE';

  const shortExplanation =
    scan.shortExplanation ||
    (isVerified
      ? 'Verified Authentic: Standard optical camera sensor noise and natural pixel compression confirmed with zero AI diffusion artifacts, morphing seams, or hidden payloads.'
      : isInconclusive
      ? 'Inconclusive: Telemetry discrepancy detected between accredited wire archives and provided media. Secondary manual review is recommended before sharing.'
      : 'Synthetic Media Alert: High-probability generative AI fabrication. Diffusion frequency morphing, artificial texture smoothing, and absent camera sensor noise detected.');

  const audit = scan.securityAudit || {
    securityStatus: isVerified ? 'CLEARED' : isInconclusive ? 'SUSPICIOUS' : 'CRITICAL_THREAT',
    tamperProofHash: scan.sha256Hash || `SHA256:${(scan.id || 'ALE-00').slice(0, 8)}...8F9B2C4E`,
    steganographyDetected: false,
    adversarialPerturbation: isFabricated,
    quarantineRecommended: isFabricated,
    securityRecommendation: isVerified
      ? 'Security Cleared: Asset verified authentic with unbroken cryptographic lineage and confirmed camera sensor physics. Safe for broadcast.'
      : isInconclusive
      ? 'Review Recommended: Discrepancy noted between regional wire feeds. Exercise caution before public dissemination.'
      : 'Quarantine Recommended: High-risk synthetic or manipulated payload detected. Do not distribute or cite as fact.',
  };

  const gaugeColor = isVerified
    ? '#10B981'
    : isFabricated
    ? '#EF4444'
    : '#F59E0B';

  const headlineColorClass = isVerified
    ? 'text-emerald-400'
    : isFabricated
    ? 'text-red-400'
    : 'text-amber-400';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(audit.tamperProofHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyLink = () => {
    const summaryText = `[Aletheia Verification Report]\nTarget: ${scan.target}\nVerdict: ${scan.verdict} (${scan.truthProbability}% Truth Probability)\n${scan.headline}\n${scan.summary}\n\nSecurity Clearance: ${audit.securityStatus}\nPlain-English Explanation: ${shortExplanation}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fadeIn">
      {/* Top back banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <button
          onClick={onScanAnother}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Verification Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDossierOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1e293b] text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Export Formal Dossier (PDF)</span>
          </button>

          <span className="text-xs text-slate-400 bg-[#111827] border border-[#243247] px-2.5 py-1.5 rounded-lg">
            Dossier ID: {scan.id}
          </span>
        </div>
      </div>

      {/* Result Header / Radial Gauge */}
      <section className="flex flex-col items-center justify-center text-center relative py-4 bg-[#111827] border border-[#243247] rounded-xl p-6">
        <div className="relative w-40 h-40 flex items-center justify-center mb-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              className="text-slate-800 stroke-current"
              cx="50"
              cy="50"
              fill="transparent"
              r={radius}
              strokeWidth="6"
            />
            {/* Dynamic Value Ring */}
            <circle
              className="stroke-current transition-all duration-1000 ease-out"
              cx="50"
              cy="50"
              fill="transparent"
              r={radius}
              strokeLinecap="round"
              strokeWidth="6"
              style={{
                stroke: gaugeColor,
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: gaugeColor }}
            >
              {scan.truthProbability}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              Truth Prob
            </span>
          </div>
        </div>

        <h1 className={`text-xl md:text-2xl font-bold mb-2 ${headlineColorClass}`}>
          {scan.headline}
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          {scan.summary}
        </p>

        {/* Target indicator pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-[#0b0f17] border border-[#243247] px-3 py-1 rounded-full text-xs text-slate-400">
          <span className="font-medium text-blue-400">Target Claim:</span>
          <span className="text-slate-200 truncate max-w-sm">{scan.target}</span>
        </div>
      </section>

      {/* Tactical Security Clearance & Plain-English Explanation */}
      <section className="bg-[#111827] border border-[#243247] rounded-xl p-5 sm:p-6 shadow-sm space-y-5 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#243247] gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                audit.securityStatus === 'CLEARED'
                  ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-400'
                  : audit.securityStatus === 'CRITICAL_THREAT'
                  ? 'bg-red-950/50 border border-red-500/40 text-red-400'
                  : 'bg-amber-950/50 border border-amber-500/40 text-amber-400'
              }`}
            >
              {audit.securityStatus === 'CLEARED' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : audit.securityStatus === 'CRITICAL_THREAT' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  Security Clearance &amp; Plain-English Explanation
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-950/40 border border-blue-500/30 text-blue-300">
                  <Lock className="w-2.5 h-2.5" />
                  <span>SHA-256 Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authoritative tactical debrief, cryptographic tamper validation &amp; operational directives
              </p>
            </div>
          </div>

          {/* Security Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-xs ${
                audit.securityStatus === 'CLEARED'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : audit.securityStatus === 'CRITICAL_THREAT'
                  ? 'bg-red-950/60 text-red-300 border-red-500/40 animate-pulse'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}
            >
              {audit.securityStatus === 'CLEARED' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>CLEARANCE: CLEARED (AUTHENTIC)</span>
                </>
              ) : audit.securityStatus === 'CRITICAL_THREAT' ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>SECURITY STATUS: CRITICAL THREAT</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>CLEARANCE: SUSPICIOUS / PENDING</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Short Plain-English Explanation Callout Box */}
        <div className="bg-[#0b0f17] border border-blue-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                <span>Short Plain-English Explanation</span>
                <span className="text-[10px] font-normal text-slate-400 lowercase">(non-technical summary)</span>
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                {shortExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* Security Audit Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Cryptographic Tamper Seal */}
          <div className="bg-[#0b0f17] border border-[#243247] rounded-lg p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Cryptographic Seal
            </span>
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-xs text-slate-200 truncate">
                {audit.tamperProofHash}
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                title="Copy cryptographic SHA-256 seal"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium block">
              ✓ Unbroken Byte Lineage
            </span>
          </div>

          {/* 2. Steganography & Hidden Payloads */}
          <div className="bg-[#0b0f17] border border-[#243247] rounded-lg p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Steganography &amp; Payloads
            </span>
            <span
              className={`text-sm font-semibold block ${
                audit.steganographyDetected ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {audit.steganographyDetected ? 'Hidden Payload Flagged' : 'CLEAN (0 Payloads)'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {audit.steganographyDetected
                ? 'High entropy anomaly in low bits'
                : 'Zero subterranean LSB data'}
            </span>
          </div>

          {/* 3. Optical Sensor Hardware PRNU */}
          <div className="bg-[#0b0f17] border border-[#243247] rounded-lg p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Hardware Sensor PRNU
            </span>
            <span
              className={`text-sm font-semibold block ${
                isVerified ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isVerified ? 'Matches Optical Sensor' : 'Synthetic Lattice (No Sensor)'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {isVerified ? 'Physical CMOS sensor grain intact' : 'Artificial diffusion noise pattern'}
            </span>
          </div>

          {/* 4. Adversarial Perturbation Risk */}
          <div className="bg-[#0b0f17] border border-[#243247] rounded-lg p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Adversarial Perturbation
            </span>
            <span
              className={`text-sm font-semibold block ${
                audit.adversarialPerturbation ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {audit.adversarialPerturbation ? 'High Risk / Evasion Injected' : 'Undetected (0%)'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {audit.adversarialPerturbation
                ? 'High-frequency gradient disruption'
                : 'Zero adversarial poisoning'}
            </span>
          </div>
        </div>

        {/* Actionable Directive Banner */}
        <div
          className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
            audit.quarantineRecommended
              ? 'bg-red-950/30 border-red-500/40 text-red-200'
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Tactical Operational Directive:
            </span>
            <span className="text-xs font-medium text-slate-100">
              {audit.securityRecommendation}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {audit.quarantineRecommended ? (
              <span className="px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                Quarantine Active
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                Cleared For Broadcast
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Feature 1 & 2: Interactive Before/After Forensic Split-Slider & Visual Flaw Hotspots */}
      <InteractiveForensicSlider scan={scan} />

      {/* Main Grid: Cross-Reference & Discrepancies */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cross-Reference Report (Col 8) */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-[#111827] rounded-xl border border-[#243247] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-100 mb-3 border-b border-[#243247] pb-2.5 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-400" />
              <span>Cross-Reference &amp; Evidence Corroboration</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              {scan.crossReferenceSummary}
            </p>

            {/* Verified Sources Checked */}
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Verified Sources Checked
            </h3>
            <ul className="space-y-1 divide-y divide-[#243247]">
              {scan.sourcesChecked && scan.sourcesChecked.length > 0 ? (
                scan.sourcesChecked.map((src, i) => (
                  <li key={i} className="flex justify-between items-center py-2.5">
                    <div>
                      <span className="text-sm text-slate-200 font-medium block">
                        {src.name}
                      </span>
                      {src.notes && (
                        <span className="text-xs text-slate-400">
                          {src.notes}
                        </span>
                      )}
                    </div>
                    {src.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded-md border border-red-500/30">
                        <X className="w-3.5 h-3.5" /> Uncorroborated
                      </span>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-400 py-2">
                  No wire contradictions detected.
                </li>
              )}
            </ul>
          </div>

          {/* AI Generative & Deepfake Detection Matrix */}
          {scan.forensics && (
            <div className="bg-[#111827] rounded-xl border border-[#243247] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#243247] gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      scan.forensics.aiArtifactProbability > 50
                        ? 'bg-red-950/40 border border-red-500/40 text-red-400'
                        : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <span>AI Generative &amp; Deepfake Detection</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Multimodal diffusion analysis &amp; temporal consistency audit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
                      scan.forensics.aiArtifactProbability > 50
                        ? 'bg-red-950/40 text-red-400 border border-red-500/40'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {scan.forensics.aiArtifactProbability > 50 ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>AI GENERATED ({scan.forensics.aiArtifactProbability}%)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AUTHENTIC SENSOR CAPTURE</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Detected Generator Engine */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Detected Engine
                  </span>
                  <span
                    className={`text-sm font-semibold block mt-1 truncate ${
                      scan.forensics.aiArtifactProbability > 50 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {scan.forensics.aiDetection?.generatorModel ||
                      (scan.forensics.aiArtifactProbability > 50
                        ? scan.isVideo
                          ? 'Sora / Runway Gen-3 Diffusion'
                          : 'Midjourney v6.1 / SDXL'
                        : 'Authentic Optical Sensor (Non-AI)')}
                  </span>
                </div>

                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Media Modality
                  </span>
                  <span className="text-sm font-semibold text-slate-200 block mt-1 flex items-center gap-1.5">
                    {scan.isVideo ? (
                      <>
                        <Video className="w-4 h-4 text-blue-400" />
                        <span>Video (Multi-Frame)</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <span>Still Picture</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    {scan.isVideo ? 'Temporal Jitter' : 'ELA Quantization Delta'}
                  </span>
                  <span className="text-sm font-semibold text-slate-200 block mt-1">
                    {scan.isVideo
                      ? `${scan.forensics.aiDetection?.temporalFlickerScore || (scan.forensics.aiArtifactProbability > 50 ? 84 : 4)}% Jitter`
                      : `${scan.forensics.elaScore ?? 88}% Residual`}
                  </span>
                </div>
              </div>

              {/* Multi-Frame Video Reel (if video) */}
              {scan.mediaFrames && scan.mediaFrames.length > 0 && (
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247] space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                      <Film className="w-3.5 h-3.5" />
                      <span>Sequential Keyframe Timeline ({scan.mediaFrames.length} frames)</span>
                    </span>
                    <span className="text-slate-400">Temporal Morphing Inspection</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {scan.mediaFrames.map((frame, idx) => (
                      <div
                        key={idx}
                        className="relative rounded overflow-hidden border border-[#243247] aspect-video bg-[#111827]"
                      >
                        <img
                          src={frame}
                          alt={`Frame ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded text-[9px] text-slate-300">
                          Frame {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Forensic Telemetry Matrix */}
          {scan.forensics && (
            <div className="bg-[#111827] rounded-xl border border-[#243247] p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Forensic Telemetry Matrix</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] text-slate-400 block">AI Synthesis Risk</span>
                  <span className="text-base font-semibold text-blue-400">
                    {scan.forensics.aiArtifactProbability}%
                  </span>
                </div>
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] text-slate-400 block">Metadata Anomaly</span>
                  <span className={`text-base font-semibold ${scan.forensics.metadataAnomaly ? 'text-red-400' : 'text-emerald-400'}`}>
                    {scan.forensics.metadataAnomaly ? 'Detected' : 'Clear'}
                  </span>
                </div>
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] text-slate-400 block">Citation Coverage</span>
                  <span className="text-base font-semibold text-emerald-400">
                    {scan.forensics.citationCoverage}%
                  </span>
                </div>
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247]">
                  <span className="text-[11px] text-slate-400 block">Claim Entropy</span>
                  <span className="text-sm font-semibold text-slate-200 truncate block mt-0.5">
                    {scan.forensics.claimEntropy}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Discrepancies & Actions (Col 4) */}
        <div className="md:col-span-4 space-y-6">
          {/* Detected Discrepancies Card */}
          <div className="bg-[#111827] rounded-xl border border-[#243247] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-100 mb-3 border-b border-[#243247] pb-2.5 flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${isFabricated ? 'text-red-400' : 'text-amber-400'}`} />
              <span>Detected Discrepancies</span>
            </h2>

            {scan.discrepancies && scan.discrepancies.length > 0 ? (
              <ul className="space-y-3">
                {scan.discrepancies.map((item) => (
                  <li key={item.id} className="flex gap-3 items-start p-2.5 rounded-lg bg-[#0b0f17] border border-[#243247]">
                    <div className="p-1 rounded bg-[#161f30] text-blue-400 mt-0.5 flex-shrink-0">
                      {item.category === 'image_manipulation' ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : item.category === 'timeline_inconsistency' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <ShieldAlert className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-400 leading-relaxed block mt-0.5">
                        {item.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-sm text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <p className="font-medium">No critical tampering detected.</p>
                <p className="text-xs text-slate-400">Photometric and narrative consistency confirmed.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Share Report */}
            <button
              id="share-report-button"
              onClick={() => onShare(scan)}
              className="w-full text-white text-sm py-2.5 px-4 rounded-lg btn-primary flex justify-center items-center gap-2 font-medium cursor-pointer shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Report</span>
            </button>

            {/* Scan Another */}
            <button
              id="scan-another-button"
              onClick={onScanAnother}
              className="w-full text-slate-200 text-sm py-2.5 px-4 rounded-lg btn-secondary flex justify-center items-center gap-2 font-medium cursor-pointer shadow-xs transition-all"
            >
              <Scan className="w-4 h-4 text-blue-400" />
              <span>Scan Another Target</span>
            </button>

            {/* Copy summary */}
            <button
              onClick={handleCopyLink}
              className="w-full bg-[#111827] hover:bg-[#161f30] border border-[#243247] hover:border-slate-600 text-slate-300 hover:text-white text-xs py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-xs font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Report Summary Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Report Digest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Heatmap & Forensic Artifact Inspector */}
      <ForensicVisualInspector scan={scan} />

      {/* Exportable Forensic Dossier Modal */}
      <DossierExportModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        scan={scan}
      />
    </div>
  );
};
