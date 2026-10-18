import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle, Shield, Focus, FlipHorizontal } from 'lucide-react';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, dataUrl: string) => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera Stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setErrorMsg('');
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this device/browser context.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Webcam stream error:', err);
      setErrorMsg(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser or use the native camera file picker below.'
          : 'Unable to initialize webcam feed. You can take a photo directly using the native device camera button below.'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const toggleCameraFlip = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleAcceptPhoto = () => {
    if (!capturedPhoto) return;

    // Convert dataUrl to File
    const arr = capturedPhoto.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const file = new File([u8arr], `camera_capture_${Date.now()}.jpg`, { type: mime });
    onCapture(file, capturedPhoto);
    onClose();
  };

  const handleNativeMobileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onCapture(file, reader.result as string);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#111827] border border-[#243247] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#243247] flex items-center justify-between bg-[#0b0f17]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Direct Optical Camera Capture</span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  LIVE SENSOR
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Capture high-resolution optical image for hardware PRNU &amp; deepfake verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Content Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured Frame"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Cyber Camera Reticle Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Targeting Corner Brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400/80" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400/80" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400/80" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400/80" />

                {/* Central Focus Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <Focus className="w-16 h-16 text-emerald-400 animate-pulse" />
                </div>

                {/* Live Telemetry Indicator */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>SENSOR READY &bull; {facingMode.toUpperCase()}</span>
                </div>
              </div>

              {/* Shutter Flash Animation */}
              {isShutterActive && (
                <div className="absolute inset-0 bg-white transition-opacity duration-150 animate-fadeOut pointer-events-none" />
              )}
            </>
          )}

          {/* Hidden Canvas for Frame Extraction */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Error / Fallback Banner */}
          {errorMsg && (
            <div className="absolute inset-x-4 top-4 bg-red-950/90 border border-red-500/50 p-3 rounded-xl text-xs text-red-200 flex flex-col gap-2 shadow-lg backdrop-blur-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => mobileInputRef.current?.click()}
                className="self-start px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Launch Native Device Camera</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden native mobile camera input */}
        <input
          ref={mobileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleNativeMobileCapture}
          className="hidden"
        />

        {/* Controls Footer */}
        <div className="p-4 bg-[#0b0f17] border-t border-[#243247] flex items-center justify-between gap-3">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={() => setCapturedPhoto(null)}
                className="px-4 py-2 rounded-lg bg-[#161f30] hover:bg-[#1e293b] text-slate-200 text-xs font-medium border border-[#243247] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptPhoto}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Run Forensic Scan</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFlip}
                  className="px-3 py-2 rounded-lg bg-[#161f30] hover:bg-[#1e293b] text-slate-300 text-xs font-medium border border-[#243247] transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Switch between front and back camera"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => mobileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg bg-[#161f30] hover:bg-[#1e293b] text-slate-300 text-xs font-medium border border-[#243247] transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Trigger native mobile camera shutter"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Native Shutter</span>
                </button>
              </div>

              {/* Big Shutter Trigger Button */}
              <button
                type="button"
                onClick={handleCapture}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 border-4 border-emerald-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                title="Capture Frame"
              >
                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
