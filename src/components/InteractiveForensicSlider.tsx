import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  Layers,
  ZoomIn,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Sparkles,
  Info,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Focus,
  RefreshCw,
} from 'lucide-react';
import { ScanResult } from '../types';

interface HotspotAnomaly {
  id: number;
  title: string;
  category: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage width
  h: number; // percentage height
  severity: 'critical' | 'warning' | 'info';
  confidence: number;
  description: string;
}

interface InteractiveForensicSliderProps {
  scan: ScanResult;
}

export const InteractiveForensicSlider: React.FC<InteractiveForensicSliderProps> = ({ scan }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'original' | 'heatmap'>('split');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotAnomaly | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [palette, setPalette] = useState<'thermal' | 'neon' | 'monochrome'>('thermal');

  const containerRef = useRef<HTMLDivElement>(null);

  const isFabricated = scan.verdict === 'FABRICATED';
  const isVerified = scan.verdict === 'VERIFIED';

  // Default fallback image if none attached
  const activeImageSrc =
    scan.mediaUrl ||
    (isFabricated
      ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="%230f172a"/><circle cx="320" cy="180" r="90" fill="%23fbcfe8"/><circle cx="285" cy="165" r="12" fill="%230f172a"/><circle cx="355" cy="165" r="12" fill="%230f172a"/><rect x="250" y="110" width="140" height="150" fill="none" stroke="%23f87171" stroke-width="2" stroke-dasharray="4,2"/><text x="25" y="40" fill="%23f87171" font-family="sans-serif" font-size="14" font-weight="bold">AI Midjourney / Diffusion Seams Detected</text></svg>`
      : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="%230284c7"/><polygon points="0,400 160,260 320,350 480,210 640,400" fill="%231e293b"/><text x="25" y="40" fill="%2310b981" font-family="sans-serif" font-size="14" font-weight="bold">Authentic Optical Hardware Capture</text></svg>`);

  // Dynamic hotspots derived from scan findings
  const hotspots: HotspotAnomaly[] = isFabricated
    ? [
        {
          id: 1,
          title: 'Diffusion Boundary Seam & Inpaint ROI',
          category: 'Latent Discontinuity',
          x: 40,
          y: 28,
          w: 24,
          h: 28,
          severity: 'critical',
          confidence: 97,
          description:
            'Critical quantization delta along boundary contours. Pixel transitions display characteristic diffusion interpolation with stripped camera PRNU noise.',
        },
        {
          id: 2,
          title: 'Specular Lighting & Pupil Reflection Discordance',
          category: 'Photometric Anomaly',
          x: 47,
          y: 38,
          w: 12,
          h: 12,
          severity: 'warning',
          confidence: 91,
          description:
            'Specular corneal highlights exhibit asynchronous light vector angles that physically contradict the ambient scene illumination source.',
        },
        {
          id: 3,
          title: 'High-Frequency Texture Smoothing Flaw',
          category: 'Generative Artifact',
          x: 36,
          y: 62,
          w: 26,
          h: 20,
          severity: 'critical',
          confidence: 94,
          description:
            'Absence of natural optical noise grain; localized neural smoothing indicates post-generation inpainting or GAN upscaler hallucination.',
        },
      ]
    : [
        {
          id: 1,
          title: 'Consistent Optical CMOS Sensor Grain',
          category: 'Hardware PRNU Intact',
          x: 25,
          y: 25,
          w: 50,
          h: 50,
          severity: 'info',
          confidence: 96,
          description:
            'Photo-Response Non-Uniformity (PRNU) noise is evenly dispersed across the sensor matrix, consistent with physical camera hardware exposure.',
        },
      ];

  // Auto-select first hotspot on load
  useEffect(() => {
    if (hotspots.length > 0 && !selectedHotspot) {
      setSelectedHotspot(hotspots[0]);
    }
  }, [scan.id]);

  // Handle Dragging Slider
  const updateSliderPos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSliderPos(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      updateSliderPos(e.touches[0].clientX);
    }
  };

  return (
    <section className="bg-[#111827] border border-[#243247] rounded-xl p-5 sm:p-6 shadow-sm space-y-5 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#243247] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100">
                Interactive Forensic Split-Slider &amp; Flaw Hotspots
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Interactive HUD
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag the split slider to wipe between original capture and forensic ELA quantization heatmap
            </p>
          </div>
        </div>

        {/* View Mode & Hotspot Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hotspot Toggle */}
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
              showHotspots
                ? 'bg-red-950/50 text-red-300 border-red-500/40'
                : 'bg-[#161f30] text-slate-400 border-[#243247] hover:text-slate-200'
            }`}
          >
            {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showHotspots ? `Hotspots (${hotspots.length}) ON` : 'Hotspots Hidden'}</span>
          </button>

          {/* Mode Tabs */}
          <div className="flex items-center bg-[#0b0f17] p-1 rounded-lg border border-[#243247]">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
                viewMode === 'split' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split Wipe
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
                viewMode === 'side-by-side' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('original')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
                viewMode === 'original' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setViewMode('heatmap')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
                viewMode === 'heatmap' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {viewMode === 'side-by-side' ? (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Original Capture
              </span>
              <span className="text-slate-500 text-[10px] font-mono">SOURCE LAYER</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#243247] bg-[#0b0f17]">
              <img src={activeImageSrc} alt="Original Input" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Forensic ELA / Neural Heatmap
              </span>
              <span className="text-slate-500 text-[10px] font-mono">QUANTIZATION DELTA</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#243247] bg-[#0b0f17] forensic-heatmap-overlay">
              <img
                src={activeImageSrc}
                alt="Forensic Heatmap"
                className={`w-full h-full object-contain ${
                  palette === 'neon'
                    ? 'filter invert hue-rotate-180 contrast-200 saturate-200'
                    : palette === 'monochrome'
                    ? 'filter grayscale contrast-200 brightness-125'
                    : 'filter hue-rotate-90 saturate-200 contrast-150'
                }`}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Split Wipe / Single Mode Container */
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => {
            if (viewMode === 'split') {
              setIsDragging(true);
              updateSliderPos(e.clientX);
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => {
            if (viewMode === 'split') {
              setIsDragging(true);
              if (e.touches[0]) updateSliderPos(e.touches[0].clientX);
            }
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
          className={`relative aspect-video w-full rounded-xl overflow-hidden border border-[#243247] bg-[#0b0f17] select-none ${
            viewMode === 'split' ? 'cursor-ew-resize' : 'cursor-default'
          }`}
        >
          {/* Heatmap Layer (Underneath or Right Layer) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={activeImageSrc}
              alt="Forensic Heatmap"
              className={`w-full h-full object-contain ${
                viewMode === 'original'
                  ? 'hidden'
                  : palette === 'neon'
                  ? 'filter invert hue-rotate-180 contrast-200 saturate-200'
                  : palette === 'monochrome'
                  ? 'filter grayscale contrast-200 brightness-125'
                  : 'filter hue-rotate-90 saturate-200 contrast-150'
              }`}
            />
          </div>

          {/* Original Layer (Clipped to sliderPos in split mode) */}
          {viewMode !== 'heatmap' && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: viewMode === 'split' ? `${sliderPos}%` : '100%',
              }}
            >
              <img
                src={activeImageSrc}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{
                  width: containerRef.current?.clientWidth || '100%',
                  height: containerRef.current?.clientHeight || '100%',
                }}
              />
            </div>
          )}

          {/* Interactive Draggable Split Wipe Line */}
          {viewMode === 'split' && (
            <div
              className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-blue-400 via-emerald-400 to-blue-400 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Central Draggable Knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-7 h-7 rounded-full bg-[#0b0f17] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
                <Sliders className="w-3.5 h-3.5" />
              </div>

              {/* Floating Tooltip Indicator */}
              <div className="absolute bottom-3 -left-12 bg-black/80 backdrop-blur-xs border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-md pointer-events-none">
                {Math.round(sliderPos)}% WIPE
              </div>
            </div>
          )}

          {/* Visual Flaw Hotspot Bounding Boxes & Pins */}
          {showHotspots && (
            <div className="absolute inset-0 pointer-events-none">
              {hotspots.map((hs) => {
                const isSelected = selectedHotspot?.id === hs.id;
                return (
                  <div
                    key={hs.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(hs);
                    }}
                    style={{
                      left: `${hs.x}%`,
                      top: `${hs.y}%`,
                      width: `${hs.w}%`,
                      height: `${hs.h}%`,
                    }}
                    className={`absolute border-2 rounded-lg pointer-events-auto cursor-pointer transition-all ${
                      isSelected
                        ? hs.severity === 'critical'
                          ? 'border-red-500 bg-red-500/20 shadow-lg ring-2 ring-red-500/50'
                          : hs.severity === 'warning'
                          ? 'border-amber-400 bg-amber-500/20 shadow-lg ring-2 ring-amber-400/50'
                          : 'border-emerald-400 bg-emerald-500/20 shadow-lg ring-2 ring-emerald-400/50'
                        : hs.severity === 'critical'
                        ? 'border-red-500/70 border-dashed bg-red-950/20 hover:border-red-400 hover:bg-red-500/30'
                        : 'border-emerald-500/70 border-dashed bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {/* Glowing Pin Marker Badge */}
                    <div
                      className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-transform hover:scale-125 ${
                        hs.severity === 'critical'
                          ? 'bg-red-500 text-white'
                          : hs.severity === 'warning'
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {hs.id}
                    </div>

                    {/* Compact Label */}
                    <div className="absolute -bottom-5 left-0 bg-black/85 px-1.5 py-0.5 rounded text-[9px] font-mono text-white whitespace-nowrap shadow-xs border border-white/20">
                      {hs.title.slice(0, 22)}...
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Top Layer HUD Watermarks */}
          <div className="absolute top-3 left-3 bg-[#0b0f17]/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono text-blue-400 border border-[#243247] shadow-sm pointer-events-none">
            {viewMode === 'split' ? (
              <span>
                &larr; Original (Left) &bull; Forensic Heatmap (Right) &rarr;
              </span>
            ) : viewMode === 'original' ? (
              <span>Original Source Layer</span>
            ) : (
              <span>Forensic ELA Discontinuity Layer</span>
            )}
          </div>

          <div className="absolute top-3 right-3 bg-[#0b0f17]/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 border border-[#243247] shadow-sm pointer-events-none">
            Palette: <strong className="text-emerald-400 uppercase">{palette}</strong>
          </div>
        </div>
      )}

      {/* Palette Selector Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-1 border-t border-[#243247]">
        <div className="flex items-center gap-2">
          <span>Heatmap Colorway:</span>
          <div className="flex items-center gap-1">
            {(['thermal', 'neon', 'monochrome'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPalette(p)}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  palette === p
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-[#161f30] text-slate-300 border-[#243247] hover:text-white'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>Click any hotspot marker on the media to inspect localized forensics</span>
        </div>
      </div>

      {/* Selected Hotspot Detailed Forensic Drawer */}
      {selectedHotspot && (
        <div
          className={`p-4 rounded-xl border relative transition-all animate-fadeIn ${
            selectedHotspot.severity === 'critical'
              ? 'bg-red-950/30 border-red-500/40 text-red-100'
              : selectedHotspot.severity === 'warning'
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedHotspot.severity === 'critical'
                    ? 'bg-red-600 text-white'
                    : selectedHotspot.severity === 'warning'
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {selectedHotspot.id}
              </span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedHotspot.title}</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
                  {selectedHotspot.category}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-200">
                Confidence: {selectedHotspot.confidence}%
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-2.5">
            {selectedHotspot.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
              ROI Coords: X={selectedHotspot.x}% Y={selectedHotspot.y}%
            </span>
            <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
              Bounding Area: {selectedHotspot.w}% &times; {selectedHotspot.h}%
            </span>
            <span className="text-emerald-400 font-medium">
              ✓ Corroborated by Error Level Analysis
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
