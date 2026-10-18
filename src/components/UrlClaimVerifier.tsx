import React, { useState } from 'react';
import {
  Globe,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Lock,
  Calendar,
  Layers,
  FileText,
  Loader2,
} from 'lucide-react';
import { UrlVerificationReport } from '../types';
import { playTacticalSound } from '../utils/soundFx';

interface UrlClaimVerifierProps {
  onBackToHome: () => void;
  soundEnabled?: boolean;
}

export const UrlClaimVerifier: React.FC<UrlClaimVerifierProps> = ({
  onBackToHome,
  soundEnabled = true,
}) => {
  const [urlInput, setUrlInput] = useState('https://reuters.com/world/breaking-energy-dispatch-2026');
  const [isVerifying, setIsVerifying] = useState(false);
  const [report, setReport] = useState<UrlVerificationReport | null>(null);

  const sampleUrls = [
    { label: 'Reuters Wire (Verified)', url: 'https://reuters.com/investigation/global-climate-accord-2026' },
    { label: 'Viral Blog (Suspicious)', url: 'https://viralpatriotnews24.org/breaking-leak-discovery' },
    { label: 'NASA Space Science', url: 'https://nasa.gov/mission/deep-space-telemetry-update' },
  ];

  const handleVerify = async (targetUrl: string = urlInput) => {
    if (!targetUrl) return;
    setIsVerifying(true);
    playTacticalSound('scan_start', soundEnabled);

    try {
      const res = await fetch('/api/verify-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!res.ok) throw new Error('URL verification failed');
      const data: UrlVerificationReport = await res.json();
      setReport(data);

      if (data.reputationScore < 50) {
        playTacticalSound('alert_fabricated', soundEnabled);
      } else {
        playTacticalSound('scan_success', soundEnabled);
      }
    } catch (err) {
      console.error('URL verify error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const isHighTrust = (report?.reputationScore || 0) >= 70;

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[#233554] pb-4">
        <button
          onClick={onBackToHome}
          className="text-xs font-mono-tech text-[#8c909f] hover:text-[#adc6ff] mb-2 inline-block cursor-pointer transition-colors"
        >
          &lt; RETURN TO ACTIVE SURVEILLANCE
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-[#d6e3ff] flex items-center gap-2.5 font-['Inter']">
          <Globe className="w-6 h-6 text-[#4d8eff]" />
          <span>Live Web URL &amp; Claim Deconstructor</span>
        </h1>
        <p className="text-xs font-mono-tech text-[#8c909f] mt-1">
          DOMAIN REPUTATION PROFILING &bull; FACTUAL CLAIM ISOLATION &bull; CORROBORATION MATRIX
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-[#112036] rounded-xl border border-[#233554] p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Globe className="w-5 h-5 text-[#8c909f] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste article URL, social media post, or domain vector..."
              className="w-full pl-11 pr-4 py-3 bg-[#0A192F] border border-[#233554] rounded-lg text-sm text-[#d6e3ff] font-['Inter'] placeholder-[#8c909f]/60 focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff]"
            />
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={isVerifying}
            className="px-6 py-3 bg-gradient-to-b from-[#4d8eff] via-[#2d6fe8] to-[#1253cf] text-white font-mono-tech text-xs font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(77,142,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>DECONSTRUCTING...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>VERIFY URL VECTOR</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Sample URLs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#233554]/50">
          <span className="text-xs font-mono-tech text-[#8c909f]">QUICK SAMPLES:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(s.url);
                handleVerify(s.url);
              }}
              className="text-xs font-mono-tech bg-[#0A192F] hover:bg-[#1D2D50] text-[#adc6ff] border border-[#233554] px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Report Section */}
      {report && (
        <div className="space-y-6 animate-fadeIn">
          {/* Domain Trust Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
              <span className="text-[11px] font-mono-tech text-[#8c909f] block">DOMAIN TRUST INDEX</span>
              <span className={`text-2xl font-mono-tech font-bold ${isHighTrust ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                {report.reputationScore}/100
              </span>
              <span className="text-[10px] font-mono-tech text-[#8c909f] block mt-1">
                {isHighTrust ? 'TIER 1 ACCREDITED' : 'SUSPICIOUS REPUTATION'}
              </span>
            </div>

            <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
              <span className="text-[11px] font-mono-tech text-[#8c909f] block">DOMAIN AGE</span>
              <span className="text-2xl font-mono-tech font-bold text-[#d6e3ff]">
                {report.domainAgeYears} {report.domainAgeYears === 1 ? 'Year' : 'Years'}
              </span>
              <span className="text-[10px] font-mono-tech text-[#8c909f] block mt-1">WHOIS REGISTRY</span>
            </div>

            <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
              <span className="text-[11px] font-mono-tech text-[#8c909f] block">SECURITY CERTIFICATE</span>
              <span className="text-2xl font-mono-tech font-bold text-[#4edea3] flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-[#4edea3]" />
                <span>HTTPS</span>
              </span>
              <span className="text-[10px] font-mono-tech text-[#8c909f] block mt-1">TLS 1.3 ENCRYPTED</span>
            </div>

            <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
              <span className="text-[11px] font-mono-tech text-[#8c909f] block">EDITORIAL TRANSPARENCY</span>
              <span className={`text-2xl font-mono-tech font-bold ${report.editorialTransparency === 'HIGH' ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                {report.editorialTransparency}
              </span>
              <span className="text-[10px] font-mono-tech text-[#8c909f] block mt-1">MASTHEAD &amp; BYLINES</span>
            </div>
          </div>

          {/* Extracted Claim-by-Claim Deconstruction */}
          <div className="bg-[#112036] rounded-xl border border-[#233554] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#233554] pb-3">
              <h3 className="text-base font-semibold text-[#d6e3ff] flex items-center gap-2 font-['Inter']">
                <FileText className="w-5 h-5 text-[#4d8eff]" />
                <span>Isolated Article Claims &amp; Wire Corroboration</span>
              </h3>
              <span className="text-xs font-mono-tech text-[#8c909f]">
                {report.claims.length} CLAIMS ANALYZED
              </span>
            </div>

            <div className="space-y-3">
              {report.claims.map((claim, idx) => (
                <div
                  key={idx}
                  className="bg-[#0A192F] p-4 rounded-lg border border-[#233554] space-y-2 hover:border-[#4d8eff]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-mono-tech text-[#8c909f] uppercase">CLAIM #{idx + 1}</span>
                      <p className="text-sm text-[#d6e3ff] font-['Inter'] font-medium">"{claim.statement}"</p>
                    </div>

                    <span
                      className={`text-xs font-mono-tech font-bold px-2.5 py-1 rounded flex items-center gap-1.5 flex-shrink-0 ${
                        claim.verdict === 'VERIFIED'
                          ? 'bg-[#4edea3]/20 border border-[#4edea3]/40 text-[#4edea3]'
                          : claim.verdict === 'FALSE'
                          ? 'bg-[#ff5451]/20 border border-[#ff5451]/40 text-[#ffb4ab]'
                          : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      }`}
                    >
                      {claim.verdict === 'VERIFIED' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : claim.verdict === 'FALSE' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>{claim.verdict}</span>
                    </span>
                  </div>

                  <div className="text-xs font-['Inter'] text-[#8c909f] pt-2 border-t border-[#233554]/60">
                    <span className="text-[#adc6ff] font-mono-tech mr-1">CORROBORATION NOTE:</span>
                    <span>{claim.corroboration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
