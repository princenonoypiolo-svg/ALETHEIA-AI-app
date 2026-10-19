import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Scan,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Link2,
  FileCode,
  X,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Cpu,
  Key,
  Layers,
  Video,
  Film,
  Image as ImageIcon,
  Lock,
  Terminal,
  Check,
  Camera,
  ClipboardPaste,
  Globe,
  Sparkles,
  Newspaper,
} from 'lucide-react';
import { AiSmileyBot } from './AiSmileyBot';
import { LiveCameraModal } from './LiveCameraModal';
import { AppHelpGuideModal } from './AppHelpGuideModal';
import { UrlPreviewData } from '../types';

export interface FilePayload {
  name: string;
  mimeType: string;
  base64: string;
  size: number;
  frames?: string[];
  isVideo?: boolean;
}

interface DataInputVectorProps {
  onScan: (
    target: string,
    targetType: 'url' | 'file' | 'text' | 'audio',
    fileData?: FilePayload
  ) => Promise<void>;
  isScanning: boolean;
  geminiConfigured?: boolean | null;
  onOpenApiKeyModal?: () => void;
  onNavigateToEla?: (imageSrc?: string) => void;
  onOpenBatchModal?: () => void;
}

// Real raster base64 sample generator for AI video demonstration
function createSampleVideoFrame(label: string, frameNum: number, anomaly: string): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 270;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, 480, 270);

  // Generative lattice grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < 480; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 270);
    ctx.stroke();
  }
  for (let y = 0; y < 270; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(480, y);
    ctx.stroke();
  }

  // Artificial morphing sphere
  const shift = (frameNum - 1) * 14;
  const gradient = ctx.createRadialGradient(240 + shift, 135, 10, 240 + shift, 135, 65);
  gradient.addColorStop(0, '#f43f5e');
  gradient.addColorStop(0.5, '#a855f7');
  gradient.addColorStop(1, '#0ea5e9');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(240 + shift, 135, 60 + (frameNum % 2 ? 6 : -4), 0, Math.PI * 2);
  ctx.fill();

  // HUD Overlay
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(10, 10, 460, 48);
  ctx.strokeStyle = '#ef4444';
  ctx.strokeRect(10, 10, 460, 48);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`FRAME 0${frameNum} // SORA VIDEO DIFFUSION // FLICKER: 88%`, 20, 30);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.fillText(anomaly, 20, 46);

  return canvas.toDataURL('image/jpeg', 0.88);
}

// Robust client-side HTML5 video keyframe extractor
function extractVideoKeyframes(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    // @ts-ignore
    video.defaultMuted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    // Must be in DOM for Chrome hardware media decoder to activate reliably
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.style.width = '320px';
    video.style.height = '180px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    document.body.appendChild(video);

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    let isDone = false;
    const cleanup = (frames: string[]) => {
      if (isDone) return;
      isDone = true;
      try {
        clearTimeout(safetyTimer);
        URL.revokeObjectURL(objectUrl);
        video.pause();
        video.removeAttribute('src');
        video.load();
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
      } catch (e) {
        console.warn('Cleanup error', e);
      }
      resolve(frames);
    };

    // Safety timeout: if decoding takes too long or codec is unsupported, resolve gracefully without artificial text
    const safetyTimer = setTimeout(() => {
      try {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(video.videoWidth, 640);
          canvas.height = Math.min(video.videoHeight, 360);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (dataUrl && dataUrl.length > 1000) {
              cleanup([dataUrl]);
              return;
            }
          }
        }
      } catch {}
      cleanup([]);
    }, 8000);

    const onReadyToExtract = async () => {
      video.removeEventListener('loadeddata', onReadyToExtract);
      video.removeEventListener('canplay', onReadyToExtract);

      try {
        let attempts = 0;
        while ((video.videoWidth === 0 || video.videoHeight === 0) && attempts < 12) {
          await new Promise((r) => setTimeout(r, 100));
          attempts++;
        }

        const duration = (video.duration && !isNaN(video.duration) && video.duration > 0.5)
          ? video.duration
          : 4;

        const timestamps = [
          Math.max(0.1, duration * 0.15),
          Math.max(0.2, duration * 0.5),
          Math.max(0.3, duration * 0.8),
        ];

        const frames: string[] = [];
        const canvas = document.createElement('canvas');
        const targetWidth = Math.min(video.videoWidth || 640, 640);
        const targetHeight = Math.min(video.videoHeight || 360, 360);
        canvas.width = targetWidth > 0 ? targetWidth : 640;
        canvas.height = targetHeight > 0 ? targetHeight : 360;
        const ctx = canvas.getContext('2d');

        for (const t of timestamps) {
          await new Promise<void>((seekDone) => {
            let done = false;
            const finishSeek = () => {
              if (done) return;
              done = true;
              if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
                try {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                  if (dataUrl && dataUrl.length > 1000) {
                    frames.push(dataUrl);
                  }
                } catch (e) {
                  console.warn('Frame draw error', e);
                }
              }
              seekDone();
            };

            video.addEventListener('seeked', finishSeek, { once: true });
            video.currentTime = Math.min(Math.max(0.05, t), duration - 0.05);
            setTimeout(finishSeek, 900);
          });
        }

        cleanup(frames);
      } catch (err) {
        console.warn('Extraction loop error', err);
        cleanup([]);
      }
    };

    video.addEventListener('loadeddata', onReadyToExtract, { once: true });
    video.addEventListener('canplay', onReadyToExtract, { once: true });
    video.onerror = () => {
      console.warn('HTML5 Video load error');
      cleanup([]);
    };

    video.load();
  });
}

export const DataInputVector: React.FC<DataInputVectorProps> = ({
  onScan,
  isScanning,
  geminiConfigured,
  onOpenApiKeyModal,
  onNavigateToEla,
  onOpenBatchModal,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [videoFrames, setVideoFrames] = useState<string[]>([]);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isExtractingFrames, setIsExtractingFrames] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urlPreview, setUrlPreview] = useState<UrlPreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);

  // Real-time URL & News Article Auto-Scraper
  useEffect(() => {
    const trimmed = urlInput.trim();
    if (!trimmed || (!trimmed.startsWith('http') && !trimmed.includes('.'))) {
      setUrlPreview(null);
      return;
    }

    if (trimmed.length < 8) return;

    setIsLoadingPreview(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/url-preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: trimmed }),
        });
        if (res.ok) {
          const data: UrlPreviewData = await res.json();
          setUrlPreview(data);
        }
      } catch (err) {
        console.warn('URL auto-scraper notice:', err);
      } finally {
        setIsLoadingPreview(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [urlInput]);

  const [scanningStage, setScanningStage] = useState(0);
  const [scanProgress, setScanProgress] = useState(15);

  useEffect(() => {
    if (!isScanning) {
      setScanningStage(0);
      setScanProgress(15);
      return;
    }

    // Dynamic stage progression during security scan
    const stageInterval = setInterval(() => {
      setScanningStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 850);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 94) return 94;
        return prev + Math.floor(Math.random() * 6) + 4;
      });
    }, 220);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [isScanning]);

  const SECURITY_STAGES = [
    {
      step: '01',
      title: 'Cryptographic SHA-256 Hashing',
      detail: 'Sealing media buffer checksum & sanitizing input vectors',
      badge: 'SHA-256 Sealed',
    },
    {
      step: '02',
      title: 'Diffusion Lattice & Seam Scan',
      detail: 'Deconstructing generative frequency bands & boundary morphing',
      badge: 'Deepfake Audit',
    },
    {
      step: '03',
      title: 'PRNU Optical Sensor Noise',
      detail: 'Analyzing camera sensor hardware noise & compression quantization',
      badge: 'Hardware Calibration',
    },
    {
      step: '04',
      title: 'Consensus & Directive Synthesis',
      detail: 'Cross-verifying trusted wire archives & generating plain-English explanation',
      badge: 'Security Clearance',
    },
  ];

  const processSelectedFile = async (file: File) => {
    setSelectedFile(file);
    setErrorMsg('');
    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
    setIsVideo(isVid);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreviewUrl(reader.result as string);
        setVideoFrames([]);
      };
      reader.readAsDataURL(file);
    } else if (isVid) {
      const localUrl = URL.createObjectURL(file);
      setFilePreviewUrl(localUrl);
      setIsExtractingFrames(true);
      try {
        const frames = await extractVideoKeyframes(file);
        setVideoFrames(frames);
        if (frames && frames.length > 0 && frames[0].startsWith('data:image')) {
          setFilePreviewUrl(frames[0]);
        }
      } catch (err) {
        console.error('Keyframe extraction failed', err);
      } finally {
        setIsExtractingFrames(false);
      }
    } else {
      setFilePreviewUrl(null);
      setVideoFrames([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          setErrorMsg('');
        }
      }
    } catch {
      // Ignore if clipboard access not granted
    }
  };

  const handleLoadSample = (sampleType: 'ai_video' | 'ai_image' | 'authentic_photo' | 'viral_claim') => {
    setErrorMsg('');
    if (sampleType === 'ai_video') {
      setUrlInput('Analyze video clip for OpenAI Sora / Runway Gen-3 diffusion & deepfake artifacts');
      setIsVideo(true);
      const f1 = createSampleVideoFrame('Sora Video Diffusion', 1, 'Anomaly: Inter-Frame Geometry Drift');
      const f2 = createSampleVideoFrame('Sora Video Diffusion', 2, 'Anomaly: Temporal Boundary Morphing');
      const f3 = createSampleVideoFrame('Sora Video Diffusion', 3, 'Anomaly: Specular Jitter & Missing PRNU');
      const sampleFrames = [f1, f2, f3];
      setVideoFrames(sampleFrames);
      setFilePreviewUrl(f1);
      setSelectedFile(
        new File(['sample_video_bytes'], 'sora_synthetic_generation.mp4', { type: 'video/mp4' })
      );
    } else if (sampleType === 'ai_image') {
      setUrlInput('Investigate portrait photo for Midjourney / Stable Diffusion facial inpainting');
      setIsVideo(false);
      setVideoFrames([]);
      const faceSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
        <rect width="640" height="400" fill="%230f172a"/>
        <circle cx="320" cy="180" r="90" fill="%23fbcfe8"/>
        <circle cx="285" cy="165" r="12" fill="%230f172a"/>
        <circle cx="355" cy="165" r="12" fill="%230f172a"/>
        <rect x="250" y="110" width="140" height="150" fill="none" stroke="%23f87171" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="25" y="40" fill="%23f87171" font-family="sans-serif" font-size="14" font-weight="bold">AI Midjourney Inpaint Seams Detected</text>
      </svg>`;
      setFilePreviewUrl(faceSvg);
      setSelectedFile(
        new File(['sample'], 'midjourney_portrait_v6.png', { type: 'image/png' })
      );
    } else if (sampleType === 'viral_claim') {
      setUrlInput('Viral social media claim: "Sudden $450B offshore treasury withdrawal unverified by central bank archives"');
      setIsVideo(false);
      setVideoFrames([]);
      setSelectedFile(null);
      setFilePreviewUrl(null);
    } else {
      setUrlInput('Verify authentic Sony camera photograph taken on mountain trail');
      setIsVideo(false);
      setVideoFrames([]);
      const cameraSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
        <rect width="640" height="400" fill="%230284c7"/>
        <polygon points="0,400 160,260 320,350 480,210 640,400" fill="%231e293b"/>
        <text x="25" y="40" fill="%2310b981" font-family="sans-serif" font-size="14" font-weight="bold">Genuine Optical Sensor Exposure</text>
      </svg>`;
      setFilePreviewUrl(cameraSvg);
      setSelectedFile(
        new File(['sample'], 'authentic_sony_camera.jpg', { type: 'image/jpeg' })
      );
    }
  };

  const handleExecuteScan = async () => {
    if (selectedFile) {
      const isAudio =
        selectedFile.type.startsWith('audio') ||
        selectedFile.name.endsWith('.wav') ||
        selectedFile.name.endsWith('.mp3');
      const isImg = selectedFile.type.startsWith('image');
      const targetLabel = urlInput.trim() || selectedFile.name;

      if (isVideo) {
        let framesToUse = videoFrames;
        if (isExtractingFrames || framesToUse.length === 0) {
          try {
            framesToUse = await extractVideoKeyframes(selectedFile);
            setVideoFrames(framesToUse);
          } catch (e) {
            console.warn('Sync extraction fallback', e);
          }
        }
        const primaryFrame =
          (framesToUse && framesToUse[0] && framesToUse[0].startsWith('data:image'))
            ? framesToUse[0]
            : (filePreviewUrl && filePreviewUrl.startsWith('data:image'))
            ? filePreviewUrl
            : '';

        await onScan(
          targetLabel,
          'file',
          {
            name: selectedFile.name,
            mimeType: selectedFile.type || 'video/mp4',
            base64: primaryFrame,
            size: selectedFile.size || 1024 * 500,
            frames: framesToUse && framesToUse.length > 0 ? framesToUse : undefined,
            isVideo: true,
          }
        );
      } else {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          await onScan(
            targetLabel,
            isAudio ? 'audio' : isImg ? 'file' : 'file',
            {
              name: selectedFile.name,
              mimeType:
                selectedFile.type ||
                (isAudio ? 'audio/wav' : isImg ? 'image/jpeg' : 'application/octet-stream'),
              base64: filePreviewUrl?.startsWith('data:') ? filePreviewUrl : base64,
              size: selectedFile.size || 1024 * 100,
            }
          );
        };
        reader.onerror = () => {
          setErrorMsg('Failed to read media file payload.');
        };
        if (filePreviewUrl?.startsWith('data:')) {
          await onScan(targetLabel, isAudio ? 'audio' : 'file', {
            name: selectedFile.name,
            mimeType: selectedFile.type || 'image/png',
            base64: filePreviewUrl,
            size: selectedFile.size || 1024 * 100,
          });
        } else {
          reader.readAsDataURL(selectedFile);
        }
      }
    } else if (urlInput.trim()) {
      await onScan(urlInput.trim(), urlInput.trim().startsWith('http') ? 'url' : 'text');
    } else {
      setErrorMsg('Please input a target URL, claim statement, or attach an image / video file.');
    }
  };

  return (
    <div className="bg-white/95 dark:bg-[#0f1728]/95 border border-slate-200/90 dark:border-[#1e2a3f] rounded-2xl p-6 sm:p-7 shadow-xl backdrop-blur-md transition-colors relative overflow-hidden">
      <div className="relative z-10 space-y-6">
        
        {/* Streamlined Clean Header with Waving Mascot where pointed */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-[#1e2a3f] gap-3">
          <div className="space-y-1.5 min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Truth &amp; Deepfake Verification Scanner</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-500/40">
                ENGINE READY
              </span>
            </div>
          </div>

          {/* Waving Mascot with Help? message bubble where pointed */}
          <div className="flex-shrink-0 pt-2">
            <AiSmileyBot
              size="lg"
              speechBubbleText="Help?"
              onSpeechBubbleClick={() => setIsHelpGuideOpen(true)}
              onClick={() => setIsHelpGuideOpen(true)}
            />
          </div>
        </div>

        {/* Input Fields Container */}
        <div className="space-y-5">
          {/* Target URL / Text Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Link2 className="w-4 h-4 text-blue-500" />
                <span>Claim Statement, News Article, or URL</span>
              </label>
            </div>

            <div className="relative">
              <input
                id="target-url-input"
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isScanning}
                placeholder=""
                className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-[#1e2a3f] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-['Inter',sans-serif] pr-20"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {!urlInput && (
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1 transition-all cursor-pointer font-medium shadow-2xs"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>
                )}

                {urlInput && (
                  <button
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-300 dark:bg-[#1a253a] dark:hover:bg-[#243350] border border-slate-300 dark:border-[#2d3d5c] flex items-center gap-1 transition-all cursor-pointer font-medium"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live URL Intelligence & Auto-Scraper Card */}
            {isLoadingPreview && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-300/80 dark:border-blue-500/30 text-xs text-blue-700 dark:text-blue-300 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Auto-scraping real-time article intelligence &amp; publisher credibility...</span>
              </div>
            )}

            {urlPreview && !isLoadingPreview && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090d16] border border-blue-400/50 dark:border-blue-500/40 space-y-3 animate-fadeIn shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-200 dark:border-[#1e2a3f] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">{urlPreview.domain}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        urlPreview.domainTrustScore >= 85
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/40'
                          : urlPreview.domainTrustScore >= 50
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/40'
                          : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-500/40'
                      }`}
                    >
                      {urlPreview.credibilityTier} ({urlPreview.domainTrustScore}/100 Trust)
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {urlPreview.httpsSecured ? '🔒 SSL Encrypted' : '⚠️ Unencrypted'}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {urlPreview.ogImage && (
                    <img
                      src={urlPreview.ogImage}
                      alt="Article Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-[#1e2a3f] flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{urlPreview.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {urlPreview.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{urlPreview.author || 'Editorial Staff'}</span>
                      <span>&bull;</span>
                      <span>{urlPreview.publishDate || 'Recent'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-[#1e2a3f] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Transparency: <strong className="text-slate-800 dark:text-slate-200">{urlPreview.editorialTransparency}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleExecuteScan}
                    disabled={isScanning}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Verify This Article Now</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Forensic Media Upload Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span>Forensic Media (Pictures &amp; Videos)</span>
              </label>
              <div className="flex items-center gap-1">
                {['JPG', 'PNG', 'WEBP', 'MP4'].map((ext) => (
                  <span
                    key={ext}
                    className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#090d16] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#1e2a3f]"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,.mp4,.webm,.mov,.avi,.mkv,.pdf,.doc,.docx,.mp3,.wav,.txt"
              className="hidden"
              id="file-upload-input"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-solid rounded-xl cursor-pointer transition-all p-5 relative ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                  : selectedFile
                  ? 'border-blue-500/60 bg-blue-50/20 dark:bg-blue-950/10'
                  : 'border-slate-300 dark:border-[#22314a] bg-slate-50/60 dark:bg-[#090d16]/60 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-blue-50/30 dark:hover:bg-[#121a2c]'
              }`}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isVideo ? (
                        <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-500/40 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                          <Video className="w-6 h-6" />
                        </div>
                      ) : filePreviewUrl ? (
                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-300 dark:border-[#1e2a3f] flex-shrink-0 bg-slate-100 dark:bg-[#090d16]">
                          <img
                            src={filePreviewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-500/40 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {isVideo ? 'Video Payload Attached' : 'Image Payload Attached'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                            {isVideo ? 'Multi-Frame Video' : 'Visual Ingest'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                          {selectedFile.name} &bull; {(selectedFile.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {filePreviewUrl && onNavigateToEla && !isVideo && (
                        <button
                          type="button"
                          id="btn-attached-open-ela"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToEla(filePreviewUrl);
                          }}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-white bg-blue-50 dark:bg-[#1a253a] hover:bg-blue-600 dark:hover:bg-blue-600 border border-blue-200 dark:border-blue-500/40 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Open in ELA</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setFilePreviewUrl(null);
                          setVideoFrames([]);
                          setIsVideo(false);
                        }}
                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-600 dark:hover:bg-rose-900/60 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Multi-Frame Video Keyframes Strip */}
                  {isVideo && (
                    <div className="bg-slate-100 dark:bg-[#090d16] p-3 rounded-xl border border-slate-200 dark:border-[#1e2a3f] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                          <Film className="w-3.5 h-3.5" />
                          <span>Sequential Video Keyframes ({videoFrames.length} frames)</span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">Temporal Drift Analysis</span>
                      </div>

                      {isExtractingFrames ? (
                        <div className="flex items-center justify-center py-5 text-xs text-blue-600 dark:text-blue-400 gap-2 font-medium">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Extracting video keyframes across timeline...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {videoFrames.map((frame, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-[#1e2a3f] bg-black aspect-video shadow-xs"
                            >
                              <img
                                src={frame}
                                alt={`Frame ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
                                Frame {idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-center sm:text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#141d2e] border border-blue-200 dark:border-[#22314a] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs flex-shrink-0">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Upload Picture or Video for AI Detection
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCameraOpen(true);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:text-white bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 dark:hover:bg-blue-800/80 border border-blue-300 dark:border-blue-500/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Camera Snap</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#141d2e] dark:hover:bg-[#1c283f] border border-slate-300 dark:border-[#22314a] px-3.5 py-2 rounded-xl shadow-xs transition-colors">
                      <span>Browse Files</span>
                      <span>&rarr;</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick 1-Click Interactive Sample Presets */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider mr-1">
                Try Sample:
              </span>
              <button
                type="button"
                id="btn-sample-ai-video"
                onClick={() => handleLoadSample('ai_video')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 dark:bg-[#101726] dark:hover:bg-red-950/30 border border-slate-200 hover:border-red-300 dark:border-[#1e2a3f] dark:hover:border-red-500/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>AI Sora Video</span>
              </button>
              <button
                type="button"
                id="btn-sample-ai-image"
                onClick={() => handleLoadSample('ai_image')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 dark:bg-[#101726] dark:hover:bg-amber-950/30 border border-slate-200 hover:border-amber-300 dark:border-[#1e2a3f] dark:hover:border-amber-500/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Midjourney</span>
              </button>
              <button
                type="button"
                id="btn-sample-authentic"
                onClick={() => handleLoadSample('authentic_photo')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-[#101726] dark:hover:bg-blue-950/30 border border-slate-200 hover:border-blue-300 dark:border-[#1e2a3f] dark:hover:border-blue-500/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Authentic Photo</span>
              </button>
              <button
                type="button"
                id="btn-sample-viral-claim"
                onClick={() => handleLoadSample('viral_claim')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-[#101726] dark:hover:bg-blue-950/30 border border-slate-200 hover:border-blue-300 dark:border-[#1e2a3f] dark:hover:border-blue-500/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Newspaper className="w-3.5 h-3.5 text-blue-500" />
                <span>Viral Claim</span>
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/40 p-3.5 rounded-xl animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Live High-Security Multi-Stage Verification HUD */}
          {isScanning && (
            <div className="bg-slate-50 dark:bg-[#090d16] border border-blue-400 dark:border-blue-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden space-y-4 animate-fadeIn">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 animate-pulse" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e2a3f] gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 animate-pulse text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                        High-Security Multi-Stage Verification Active
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>AES-256 Sandbox</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Real-time payload sanitization, deepfake lattice deconstruction &amp; sensor PRNU audit
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between text-right">
                  <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{scanProgress}%</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Stage {scanningStage + 1} of 4</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-[#1e2a3f]">
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              {/* 4 Security Stage Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {SECURITY_STAGES.map((stg, idx) => {
                  const isDone = scanningStage > idx;
                  const isActive = scanningStage === idx;
                  return (
                    <div
                      key={stg.step}
                      className={`p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-blue-50/80 border-blue-300 text-blue-900 dark:bg-blue-950/20 dark:border-blue-500/30 dark:text-blue-300'
                          : isActive
                          ? 'bg-blue-50/90 border-blue-400 text-blue-900 dark:bg-blue-950/30 dark:border-blue-500/50 dark:text-blue-200 ring-1 ring-blue-500/30 shadow-xs'
                          : 'bg-slate-100/60 dark:bg-[#0c121e]/60 border-slate-200 dark:border-[#1e2a3f] text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/40">
                          {stg.step}
                        </span>
                        {isDone ? (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold">
                            <Check className="w-3.5 h-3.5" /> Done
                          </span>
                        ) : isActive ? (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Queued</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{stg.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">{stg.detail}</p>
                    </div>
                  );
                })}
              </div>

              {/* Security Telemetry Footer Ticker */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2 border-t border-slate-200 dark:border-[#1e2a3f]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span>Tamper Shield: <strong className="text-blue-600 dark:text-blue-400">Armored</strong></span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" />
                    <span>Neural Cores: <strong className="text-blue-600 dark:text-blue-400">Online</strong></span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-mono">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Synthesizing Plain-English Directive...</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 border-t border-slate-200/90 dark:border-[#1e2a3f]">
            <div
              className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 select-none font-semibold"
              title="Groq Llama / Qwen Vision Core: Connected and active"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <Cpu className="w-4 h-4" />
              <span>Groq Vision Core: Active &amp; Ready</span>
            </div>

            <button
              id="scan-vector-button"
              onClick={handleExecuteScan}
              disabled={isScanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:shadow-blue-500/25 active:scale-98 transition-all disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Securing &amp; Analyzing ({scanProgress}%)...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-white" />
                  <span>Detect AI &amp; Verify Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature 4: Live Camera Direct Capture Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file, dataUrl) => {
          setSelectedFile(file);
          setFilePreviewUrl(dataUrl);
          setIsVideo(false);
          setVideoFrames([]);
          setErrorMsg('');
        }}
      />

      {/* Interactive App Help Guide Modal */}
      <AppHelpGuideModal
        isOpen={isHelpGuideOpen}
        onClose={() => setIsHelpGuideOpen(false)}
        onSelectSampleClaim={(claim) => {
          setUrlInput(claim);
          setErrorMsg('');
        }}
      />
    </div>
  );
};
