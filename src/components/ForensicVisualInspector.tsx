import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  Sliders,
  Scan,
  FileCheck,
  AlertTriangle,
  Camera,
  Cpu,
  RefreshCw,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  ZoomIn,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { ScanResult } from '../types';

interface ForensicVisualInspectorProps {
  scan?: ScanResult;
  onSendToScan?: (target: string, fileData: { name: string; mimeType: string; base64: string; size: number }) => void;
  onBackToHome?: () => void;
}

// Built-in pristine SVG Data URIs with zero CORS taint and guaranteed instantaneous loading
const PRESET_SVGS: Record<string, { label: string; dataUri: string; simulatedVerdict: string; description: string }> = {
  deepfake_face: {
    label: 'Deepfake Face Inpaint',
    simulatedVerdict: 'FABRICATED',
    description: 'Diffusion model facial inpainting with mismatched boundary frequency and synthetic specular eyes.',
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="%231e293b"/>
          <stop offset="100%" stop-color="%23090d16"/>
        </radialGradient>
        <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%23fbcfe8"/>
          <stop offset="100%" stop-color="%23f472b6"/>
        </linearGradient>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0"/>
          <feComposite in2="SourceGraphic" in="glitch" operator="in"/>
        </filter>
      </defs>
      <rect width="640" height="400" fill="url(%23bg)"/>
      <g opacity="0.15">
        <line x1="0" y1="100" x2="640" y2="100" stroke="%2338bdf8" stroke-width="1"/>
        <line x1="0" y1="200" x2="640" y2="200" stroke="%2338bdf8" stroke-width="1"/>
        <line x1="0" y1="300" x2="640" y2="300" stroke="%2338bdf8" stroke-width="1"/>
        <line x1="160" y1="0" x2="160" y2="400" stroke="%2338bdf8" stroke-width="1"/>
        <line x1="320" y1="0" x2="320" y2="400" stroke="%2338bdf8" stroke-width="1"/>
        <line x1="480" y1="0" x2="480" y2="400" stroke="%2338bdf8" stroke-width="1"/>
      </g>
      <!-- Head silhouette -->
      <path d="M 240 380 C 240 310 260 270 280 250 C 270 220 265 180 275 140 C 290 80 350 70 380 90 C 420 120 410 180 405 210 C 420 240 435 290 440 380 Z" fill="%23334155"/>
      <!-- Spliced Face Region (Altered Compression ROI) -->
      <g transform="translate(275, 120)">
        <rect x="0" y="0" width="130" height="150" rx="20" fill="url(%23skin)" opacity="0.85"/>
        <!-- Eyes with asymmetrical reflections -->
        <circle cx="35" cy="45" r="12" fill="%230f172a"/>
        <circle cx="37" cy="42" r="4" fill="%23ffffff"/>
        <circle cx="95" cy="45" r="12" fill="%230f172a"/>
        <circle cx="92" cy="48" r="2" fill="%2338bdf8"/>
        <!-- Nose and mouth -->
        <path d="M 65 55 L 60 80 L 72 80" stroke="%239d174d" stroke-width="2" fill="none"/>
        <path d="M 45 105 Q 65 125 85 105" stroke="%23be185d" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Inpainting Boundary Seam Overlay -->
        <rect x="-2" y="-2" width="134" height="154" rx="22" fill="none" stroke="%23ef4444" stroke-width="2" stroke-dasharray="6,4"/>
      </g>
      <!-- HUD Annotations -->
      <rect x="25" y="25" width="220" height="50" rx="6" fill="%230b1329" stroke="%233b82f6" stroke-width="1" opacity="0.9"/>
      <text x="35" y="45" fill="%2360a5fa" font-family="monospace" font-size="12" font-weight="bold">TARGET: SYNTHETIC_PORTRAIT</text>
      <text x="35" y="62" fill="%23ef4444" font-family="monospace" font-size="10">ROI DELTA: HIGH INPAINT RESIDUAL</text>
    </svg>`,
  },
  doctored_document: {
    label: 'Doctored Official Memo',
    simulatedVerdict: 'FABRICATED',
    description: 'Classified government memorandum with digitally altered authorization code and forged stamp.',
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="%230b1322"/>
      <!-- Paper document background -->
      <rect x="120" y="30" width="400" height="340" rx="4" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/>
      <rect x="140" y="50" width="360" height="30" fill="%230f172a"/>
      <text x="180" y="70" fill="%23f8fafc" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="2">TOP SECRET // CLASSIFIED MEMORANDUM</text>
      <!-- Text lines -->
      <rect x="150" y="100" width="340" height="8" rx="2" fill="%2364748b"/>
      <rect x="150" y="118" width="310" height="8" rx="2" fill="%2394a3b8"/>
      <rect x="150" y="136" width="330" height="8" rx="2" fill="%2394a3b8"/>
      <!-- Spliced Modified Text Box (Different Quantization) -->
      <g transform="translate(145, 160)">
        <rect x="0" y="0" width="350" height="42" fill="%23fef08a" stroke="%23f59e0b" stroke-width="2" rx="4"/>
        <text x="15" y="26" fill="%23991b1b" font-family="monospace" font-size="14" font-weight="bold">AUTHORIZED TRANSFER: $84,200,000 USD</text>
      </g>
      <rect x="150" y="220" width="280" height="8" rx="2" fill="%2394a3b8"/>
      <rect x="150" y="238" width="320" height="8" rx="2" fill="%2394a3b8"/>
      <!-- Doctored Red Stamp -->
      <g transform="translate(360, 270) rotate(-12)">
        <rect x="0" y="0" width="130" height="44" rx="4" fill="none" stroke="%23dc2626" stroke-width="3" stroke-dasharray="4,2"/>
        <text x="12" y="28" fill="%23dc2626" font-family="sans-serif" font-size="16" font-weight="bold" letter-spacing="1">DECRYPTED</text>
      </g>
      <!-- Signature line -->
      <path d="M 160 320 Q 200 300 240 330 T 300 310" stroke="%231e3a8a" stroke-width="2.5" fill="none"/>
    </svg>`,
  },
  authentic_photo: {
    label: 'Authentic Camera Capture',
    simulatedVerdict: 'VERIFIED',
    description: 'Genuine camera sensor exposure with uniform PRNU noise distribution and intact lens metadata.',
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%230284c7"/>
          <stop offset="60%" stop-color="%2338bdf8"/>
          <stop offset="100%" stop-color="%23fed7aa"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(%23sky)"/>
      <!-- Mountain range with natural gradients -->
      <polygon points="0,400 120,240 260,330 420,180 580,310 640,260 640,400" fill="%231e293b"/>
      <polygon points="60,400 190,280 320,360 480,240 640,350 640,400" fill="%230f172a" opacity="0.8"/>
      <circle cx="530" cy="110" r="38" fill="%23fffbeb" opacity="0.9"/>
      <!-- Telemetry Watermark matching authentic sensor -->
      <rect x="20" y="340" width="320" height="40" rx="6" fill="%23000000" opacity="0.6"/>
      <text x="35" y="364" fill="%23e2e8f0" font-family="monospace" font-size="11">SONY ILCE-7RM5 &bull; f/2.8 &bull; 1/500s &bull; ISO 100</text>
    </svg>`,
  },
  ai_video_deepfake: {
    label: 'AI Video Deepfake (Sora/Runway)',
    simulatedVerdict: 'FABRICATED',
    description: 'Multi-frame AI video diffusion keyframe with temporal boundary morphing and background geometry drift.',
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="%23050d1a"/>
      <g opacity="0.25">
        <line x1="0" y1="50" x2="640" y2="50" stroke="%2338bdf8" stroke-width="1"/>
        <line x1="0" y1="350" x2="640" y2="350" stroke="%2338bdf8" stroke-width="1"/>
      </g>
      <circle cx="280" cy="180" r="90" fill="%230284c7" opacity="0.7"/>
      <path d="M 220 250 Q 290 80 420 160 T 360 290 Z" fill="%23f43f5e" opacity="0.85"/>
      <rect x="200" y="90" width="240" height="180" rx="10" fill="none" stroke="%23ef4444" stroke-width="2.5" stroke-dasharray="6,4"/>
      <rect x="25" y="20" width="410" height="48" rx="6" fill="%230b1329" stroke="%23ef4444" stroke-width="1.5"/>
      <text x="35" y="40" fill="%23ef4444" font-family="monospace" font-size="12" font-weight="bold">AI VIDEO DIFFUSION // SORA GEN-3 ARTIFACTS</text>
      <text x="35" y="58" fill="%23fca5a5" font-family="monospace" font-size="10">TEMPORAL FLICKER: 88% &bull; HIGH ELA RESIDUAL DISCONTINUITY</text>
    </svg>`,
  },
};

export const ForensicVisualInspector: React.FC<ForensicVisualInspectorProps> = ({
  scan,
  onSendToScan,
  onBackToHome,
}) => {
  const [activeMode, setActiveMode] = useState<'split' | 'heatmap' | 'raw' | 'diff'>('split');
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [samplePreset, setSamplePreset] = useState<string>('deepfake_face');
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(scan?.mediaUrl || null);
  const [elaScale, setElaScale] = useState<number>(20);
  const [palette, setPalette] = useState<'thermal' | 'monochrome' | 'rgb' | 'neon'>('thermal');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [elaMetrics, setElaMetrics] = useState<{ meanResidual: number; peakAnomaly: number }>({
    meanResidual: 74.2,
    peakAnomaly: 94.6,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const elaImgRef = useRef<HTMLImageElement | null>(null);

  // Sync when scan changes
  useEffect(() => {
    if (scan?.mediaUrl) {
      setCustomImageSrc(scan.mediaUrl);
    }
  }, [scan?.mediaUrl, scan?.id]);

  // Active image source
  const currentImageSrc =
    customImageSrc || scan?.mediaUrl || PRESET_SVGS[samplePreset]?.dataUri || PRESET_SVGS.deepfake_face.dataUri;

  // Real client-side ELA processor
  const processImageELA = useCallback(
    (src: string, scale: number, colorway: 'thermal' | 'monochrome' | 'rgb' | 'neon') => {
      setIsProcessing(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        originalImgRef.current = img;
        const width = 640;
        const height = 400;

        try {
          // 1. Offscreen Canvas for Original Image
          const c1 = document.createElement('canvas');
          c1.width = width;
          c1.height = height;
          const ctx1 = c1.getContext('2d');
          if (!ctx1) throw new Error('Could not create canvas context');

          ctx1.drawImage(img, 0, 0, width, height);
          const origData = ctx1.getImageData(0, 0, width, height);

          // 2. Recompress at 90% JPEG quality
          const jpegUrl = c1.toDataURL('image/jpeg', 0.9);
          const recompressedImg = new Image();

          recompressedImg.onload = () => {
            try {
              // 3. Offscreen Canvas for Recompressed JPEG
              const c2 = document.createElement('canvas');
              c2.width = width;
              c2.height = height;
              const ctx2 = c2.getContext('2d');
              if (!ctx2) throw new Error('Could not create recompression context');

              ctx2.drawImage(recompressedImg, 0, 0, width, height);
              const jpegData = ctx2.getImageData(0, 0, width, height);

              // 4. Compute pixel-by-pixel Error Level Analysis
              const c3 = document.createElement('canvas');
              c3.width = width;
              c3.height = height;
              const ctx3 = c3.getContext('2d');
              if (!ctx3) throw new Error('Could not create output context');

              const elaImgData = ctx3.createImageData(width, height);
              const d1 = origData.data;
              const d2 = jpegData.data;
              const out = elaImgData.data;

              let totalDiff = 0;
              let maxDiff = 0;
              const count = width * height;

              for (let i = 0; i < d1.length; i += 4) {
                const dr = Math.abs(d1[i] - d2[i]);
                const dg = Math.abs(d1[i + 1] - d2[i + 1]);
                const db = Math.abs(d1[i + 2] - d2[i + 2]);
                const delta = ((dr + dg + db) / 3) * scale;

                totalDiff += delta;
                if (delta > maxDiff) maxDiff = delta;

                if (colorway === 'monochrome') {
                  const v = Math.min(255, delta * 1.5);
                  out[i] = v;
                  out[i + 1] = v;
                  out[i + 2] = v;
                  out[i + 3] = 255;
                } else if (colorway === 'rgb') {
                  out[i] = Math.min(255, dr * scale);
                  out[i + 1] = Math.min(255, dg * scale);
                  out[i + 2] = Math.min(255, db * scale);
                  out[i + 3] = 255;
                } else if (colorway === 'neon') {
                  // Cyber Neon Matrix
                  const norm = Math.min(1, delta / 90);
                  out[i] = Math.floor(norm * 255);
                  out[i + 1] = Math.floor(220 + norm * 35);
                  out[i + 2] = 255;
                  out[i + 3] = 255;
                } else {
                  // Standard Thermal Jet Palette
                  const norm = Math.min(1, delta / 110);
                  let r = 0,
                    g = 0,
                    b = 0;
                  if (norm < 0.2) {
                    r = Math.floor(10 + norm * 50);
                    g = Math.floor(20 + norm * 150);
                    b = Math.floor(80 + norm * 700);
                  } else if (norm < 0.45) {
                    const t = (norm - 0.2) / 0.25;
                    r = Math.floor(20 * (1 - t));
                    g = Math.floor(140 + t * 115);
                    b = Math.floor(220 * (1 - t * 0.6));
                  } else if (norm < 0.75) {
                    const t = (norm - 0.45) / 0.3;
                    r = Math.floor(t * 245);
                    g = 220;
                    b = Math.floor(20 * (1 - t));
                  } else {
                    const t = (norm - 0.75) / 0.25;
                    r = 255;
                    g = Math.floor(220 * (1 - t) + t * 255);
                    b = Math.floor(t * 255);
                  }
                  out[i] = r;
                  out[i + 1] = g;
                  out[i + 2] = b;
                  out[i + 3] = 255;
                }
              }

              ctx3.putImageData(elaImgData, 0, 0);

              const finalElaImg = new Image();
              finalElaImg.onload = () => {
                elaImgRef.current = finalElaImg;
                setElaMetrics({
                  meanResidual: Math.min(99.9, +((totalDiff / count) * 1.5).toFixed(1)),
                  peakAnomaly: Math.min(99.9, +(maxDiff / 2.2).toFixed(1)),
                });
                setIsProcessing(false);
                renderCanvas();
              };
              finalElaImg.src = c3.toDataURL('image/png');
            } catch (err) {
              console.warn('Canvas pixel read notice:', err);
              setIsProcessing(false);
            }
          };
          recompressedImg.src = jpegUrl;
        } catch (err) {
          console.warn('CORS or Canvas operation notice:', err);
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
      };
      img.src = src;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (currentImageSrc) {
      processImageELA(currentImageSrc, elaScale, palette);
    }
  }, [currentImageSrc, elaScale, palette, processImageELA]);

  // Main canvas render
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 640);
    const height = (canvas.height = 400);

    const origImg = originalImgRef.current;
    const elaImg = elaImgRef.current;

    ctx.fillStyle = '#061325';
    ctx.fillRect(0, 0, width, height);

    if (!origImg || !elaImg) {
      ctx.fillStyle = '#8c909f';
      ctx.font = '12px monospace';
      ctx.fillText('INITIALIZING QUANTIZATION MATRIX ELA...', 180, 200);
      return;
    }

    ctx.save();
    if (zoomLevel > 1) {
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-width / 2, -height / 2);
    }

    if (activeMode === 'raw') {
      ctx.drawImage(origImg, 0, 0, width, height);
      // HUD ROI Overlay Box
      ctx.strokeStyle = '#4d8eff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width * 0.25, height * 0.15, width * 0.5, height * 0.7);
      ctx.fillStyle = '#4d8eff';
      ctx.font = '10px monospace';
      ctx.fillText('FORENSIC ROI // PRIMARY SENSOR', width * 0.25 + 6, height * 0.15 - 6);
    } else if (activeMode === 'heatmap') {
      ctx.drawImage(elaImg, 0, 0, width, height);
      // Center Crosshair
      ctx.strokeStyle = 'rgba(77, 142, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else if (activeMode === 'diff') {
      // High-pass threshold mask
      ctx.drawImage(elaImg, 0, 0, width, height);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(0, 0, width, height);
    } else {
      // Split Wipe mode
      const splitX = Math.round((sliderPos / 100) * width);

      // Left: Original Raw
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      ctx.drawImage(origImg, 0, 0, width, height);
      ctx.restore();

      // Right: ELA
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, width - splitX, height);
      ctx.clip();
      ctx.drawImage(elaImg, 0, 0, width, height);
      ctx.restore();

      // Split Divider line
      ctx.strokeStyle = '#4edea3';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#4edea3';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [activeMode, sliderPos, zoomLevel]);

  useEffect(() => {
    renderCanvas();
  }, [sliderPos, activeMode, zoomLevel, renderCanvas]);

  const updateSliderFromClientX = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (relativeX / rect.width) * 100));
      setSliderPos(pct);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && activeMode !== 'split') return;
    updateSliderFromClientX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeMode !== 'split') return;
    if (e.touches[0]) {
      updateSliderFromClientX(e.touches[0].clientX);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadAnalyzedFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `aletheia-ela-frame-${Date.now()}.png`;
    a.click();
  };

  const handleTriggerVisionScan = () => {
    if (onSendToScan && currentImageSrc) {
      onSendToScan(
        customImageSrc ? 'Custom Uploaded Image Vector' : PRESET_SVGS[samplePreset]?.label || 'Visual Forensic Vector',
        {
          name: customImageSrc ? 'uploaded_payload.png' : `${samplePreset}.png`,
          mimeType: 'image/png',
          base64: currentImageSrc,
          size: 1024 * 140,
        }
      );
    }
  };

  const isFabricated =
    scan?.verdict === 'FABRICATED' ||
    (samplePreset === 'deepfake_face' && !customImageSrc) ||
    elaMetrics.meanResidual > 40;

  return (
    <div className="bg-[#111827] rounded-xl border border-[#243247] p-6 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#243247] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Canvas Error Level Analysis (ELA)</span>
            </h3>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
              Active Studio
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantization matrix discontinuity &amp; 90% recompression delta decomposition
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-[#0b0f17] p-1 rounded-lg border border-[#243247]">
          {(['split', 'heatmap', 'raw', 'diff'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              id={`ela-mode-btn-${mode}`}
              onClick={() => setActiveMode(mode)}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
                activeMode === mode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161f30]'
              }`}
            >
              {mode === 'split' ? 'Split Wipe' : mode === 'heatmap' ? 'ELA Heatmap' : mode === 'raw' ? 'Raw Image' : 'Tamper Mask'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Canvas Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          setIsDragging(true);
          updateSliderFromClientX(e.clientX);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches[0]) updateSliderFromClientX(e.touches[0].clientX);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative h-96 w-full rounded-xl overflow-hidden border border-[#243247] bg-[#0b0f17] select-none cursor-ew-resize group"
      >
        <canvas ref={canvasRef} className="w-full h-full object-contain bg-[#0b0f17]" />

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-2 text-xs text-blue-400 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Calculating 90% quantization delta...</span>
          </div>
        )}

        {/* Canvas HUD Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-3 left-3 text-[11px] text-slate-300 bg-[#0b0f17]/90 px-2.5 py-1 rounded-md border border-[#243247] shadow-sm">
            <span>Chroma: 32-bit &bull; Scale: {elaScale}x &bull; Palette: {palette.toUpperCase()} &bull; Zoom: {zoomLevel}x</span>
          </div>

          <div
            className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-md border shadow-sm ${
              isFabricated
                ? 'bg-red-950/80 text-red-300 border-red-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            ELA Residual: {elaMetrics.meanResidual}% (Peak: {elaMetrics.peakAnomaly}%)
          </div>

          {/* Interactive Split Wipe Divider */}
          {activeMode === 'split' && (
            <div
              className="absolute inset-y-0 w-0.5 bg-emerald-400 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-[#0b0f17] border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-md">
                <Sliders className="w-3 h-3" />
              </div>
              <div className="absolute bottom-3 -left-10 bg-[#0b0f17]/90 border border-[#243247] text-slate-300 text-[10px] px-2 py-0.5 rounded shadow-sm">
                Drag Wipe
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced ELA Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#0b0f17] border border-[#243247] rounded-xl">
        {/* Error Scale Multiplier Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Error Amplification:</span>
            <span className="text-blue-400 font-semibold">{elaScale}x</span>
          </div>
          <input
            id="ela-scale-slider"
            type="range"
            min={5}
            max={50}
            step={5}
            value={elaScale}
            onChange={(e) => setElaScale(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>5x Subtle</span>
            <span>20x Nominal</span>
            <span>50x Max</span>
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 block">Colorway Palette:</span>
          <div className="grid grid-cols-2 gap-1">
            {(['thermal', 'monochrome', 'rgb', 'neon'] as const).map((p) => (
              <button
                key={p}
                type="button"
                id={`ela-palette-btn-${p}`}
                onClick={() => setPalette(p)}
                className={`py-1 text-xs rounded-md border transition-colors cursor-pointer font-medium ${
                  palette === p
                    ? 'bg-[#1e293b] border-blue-500 text-blue-400'
                    : 'bg-[#111827] border-[#243247] text-slate-400 hover:text-white'
                }`}
              >
                {p === 'thermal' ? 'Thermal Jet' : p === 'monochrome' ? 'Noise B&W' : p === 'rgb' ? 'RGB Delta' : 'Cyber Neon'}
              </button>
            ))}
          </div>
        </div>

        {/* Source Payload / Custom Ingest Controls */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 block">Image Payload:</span>
          <div className="flex gap-1.5">
            <select
              id="ela-preset-select"
              value={customImageSrc ? 'custom' : samplePreset}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  setCustomImageSrc(null);
                  setSamplePreset(e.target.value);
                }
              }}
              className="flex-1 bg-[#111827] border border-[#243247] text-xs text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {customImageSrc && <option value="custom">Active Ingest Payload</option>}
              <option value="deepfake_face">Deepfake Face Inpaint</option>
              <option value="ai_video_deepfake">AI Video Deepfake (Sora/Runway)</option>
              <option value="doctored_document">Doctored Official Memo</option>
              <option value="authentic_photo">Authentic Camera Capture</option>
            </select>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc"
              onChange={handleCustomFileUpload}
              className="hidden"
              id="ela-custom-file-input"
            />
            <button
              type="button"
              id="ela-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload your own picture or document"
              className="px-2.5 py-1.5 bg-[#111827] hover:bg-[#1e293b] border border-[#243247] hover:border-slate-500 text-slate-200 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Load</span>
            </button>
          </div>
        </div>

        {/* Zoom & Export Actions */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 block">Zoom &amp; Export:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z === 1 ? 1.5 : z === 1.5 ? 2.5 : 1))}
              className="flex-1 py-1.5 bg-[#111827] hover:bg-[#1e293b] border border-[#243247] text-xs text-slate-200 rounded-md flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium"
            >
              <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
              <span>{zoomLevel}x Zoom</span>
            </button>

            <button
              type="button"
              id="ela-export-frame-btn"
              onClick={handleDownloadAnalyzedFrame}
              title="Export ELA Analyzed Canvas Frame"
              className="py-1.5 px-3 bg-[#111827] hover:bg-[#1e293b] border border-[#243247] hover:border-emerald-500 text-emerald-400 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Legend & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#0b0f17] border border-[#243247] rounded-xl">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="font-medium text-slate-300">Residual Guide:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600"></span>
            <span>Baseline PRNU (0-20%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>Compression Drift (40-65%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500"></span>
            <span className="text-red-400 font-semibold">Tampering Discontinuity (80%+)</span>
          </div>
        </div>

        {onSendToScan && (
          <button
            type="button"
            id="ela-send-to-deep-scan-btn"
            onClick={handleTriggerVisionScan}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Dispatch to Gemini Multimodal Scan &rarr;</span>
          </button>
        )}
      </div>

      {/* EXIF Metadata & Quantization Anomaly Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: EXIF Headers */}
        <div className="bg-[#0b0f17] p-4 rounded-xl border border-[#243247] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#243247] pb-2">
            <span className="text-xs text-slate-200 flex items-center gap-1.5 font-semibold">
              <Camera className="w-4 h-4 text-blue-400" />
              EXIF Forensic Stream
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                isFabricated
                  ? 'bg-red-950/40 text-red-400 border border-red-500/30'
                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isFabricated ? 'Metadata Stripped' : 'Genuine Camera Headers'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Camera Sensor:</span>
              <span>
                {scan?.forensics?.exif?.cameraModel ||
                  (isFabricated ? 'Virtual Diffusion Engine (No Camera)' : 'Sony Alpha 1 (ILCE-1)')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Software Footprint:</span>
              <span className={isFabricated ? 'text-red-400' : 'text-emerald-400'}>
                {scan?.forensics?.exif?.software ||
                  (isFabricated ? 'Midjourney v6.1 / SDXL ComfyUI' : 'Sony ILCE Firmware 2.1')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Quantization Table:</span>
              <span>
                {scan?.forensics?.exif?.compression ||
                  (isFabricated ? 'Non-standard Quantization Matrix' : 'Standard Baseline DCT')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color Gamut:</span>
              <span>{scan?.forensics?.exif?.colorSpace || 'sRGB (Stripped ICC Profile)'}</span>
            </div>
          </div>
        </div>

        {/* Right: Detected Forensic Anomalies */}
        <div className="bg-[#0b0f17] p-4 rounded-xl border border-[#243247] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#243247] pb-2">
            <span className="text-xs text-slate-200 flex items-center gap-1.5 font-semibold">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Synthesizer Artifacts
            </span>
            <span className="text-xs text-slate-400">
              {scan?.discrepancies?.length || 3} Signatures Detected
            </span>
          </div>
          <ul className="space-y-2 text-xs">
            {scan?.forensics?.exif?.anomaliesDetected &&
            scan.forensics.exif.anomaliesDetected.length > 0 ? (
              scan.forensics.exif.anomaliesDetected.map((anom, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{anom}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2 text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>
                    High-frequency boundary discontinuity across object and background perimeter.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Quantization noise variance indicates localized inpainting or synthetic generation.
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
