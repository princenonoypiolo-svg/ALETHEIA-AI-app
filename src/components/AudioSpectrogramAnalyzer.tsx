import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  Activity,
  Radio,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Cpu,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { AudioAnalysisResult } from '../types';
import { playTacticalSound } from '../utils/soundFx';

interface AudioSpectrogramAnalyzerProps {
  onBackToHome: () => void;
  soundEnabled?: boolean;
}

export const AudioSpectrogramAnalyzer: React.FC<AudioSpectrogramAnalyzerProps> = ({
  onBackToHome,
  soundEnabled = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'synthetic_politician' | 'authentic_briefing' | 'robocall_clone'>('synthetic_politician');
  const [result, setResult] = useState<AudioAnalysisResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize sample data on preset change
  useEffect(() => {
    runAnalysis(selectedPreset);
  }, [selectedPreset]);

  // Audio Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.05;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 220);

      // Dark tactical background
      ctx.fillStyle = '#050c18';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(77, 142, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Simulated 2D Spectrogram + Harmonic FFT bars
      const numBars = 48;
      const barWidth = width / numBars;

      for (let i = 0; i < numBars; i++) {
        const freqRatio = i / numBars;
        // Synthesis anomaly produces glitch spikes in high frequency band (12kHz - 16kHz)
        const isAnomalyBand = selectedPreset !== 'authentic_briefing' && i > 32;
        const baseAmp = Math.sin(time * 3 + i * 0.4) * 0.5 + 0.5;
        const glitch = isAnomalyBand ? Math.random() * 0.6 : 0;
        const barHeight = (baseAmp * 0.7 + glitch * 0.3) * (height - 30);

        const x = i * barWidth;
        const y = height - barHeight;

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, height, 0, y);
        if (isAnomalyBand) {
          grad.addColorStop(0, '#3b82f6');
          grad.addColorStop(0.6, '#f59e0b');
          grad.addColorStop(1, '#ef4444');
        } else {
          grad.addColorStop(0, '#1d4ed8');
          grad.addColorStop(0.7, '#4d8eff');
          grad.addColorStop(1, '#4edea3');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

        // Peak dot
        ctx.fillStyle = isAnomalyBand ? '#ffb4ab' : '#ffffff';
        ctx.fillRect(x + 1, y - 2, barWidth - 2, 2);
      }

      // Waveform line overlay across center
      ctx.beginPath();
      ctx.strokeStyle = selectedPreset !== 'authentic_briefing' ? 'rgba(239, 68, 68, 0.85)' : 'rgba(78, 222, 163, 0.85)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 4) {
        const wave = Math.sin(x * 0.03 + time * 4) * Math.cos(x * 0.01) * 35;
        const y = height / 2 + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedPreset, isPlaying, isRecording]);

  const runAnalysis = async (preset: string) => {
    setIsAnalyzing(true);
    playTacticalSound('scan_start', soundEnabled);

    try {
      const res = await fetch('/api/analyze-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName:
            preset === 'synthetic_politician'
              ? 'wiretap_intercept_04.wav'
              : preset === 'robocall_clone'
              ? 'automated_exec_voice.mp3'
              : 'whitehouse_press_briefing.wav',
          sampleType: preset === 'authentic_briefing' ? 'authentic' : 'synthetic',
        }),
      });

      if (!res.ok) throw new Error('Audio analysis failed');
      const data: AudioAnalysisResult = await res.json();
      setResult(data);
      if (data.verdict === 'SYNTHETIC_CLONE') {
        playTacticalSound('alert_fabricated', soundEnabled);
      } else {
        playTacticalSound('scan_success', soundEnabled);
      }
    } catch (err) {
      console.error('Audio analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      playTacticalSound('radar_ping', soundEnabled);
      setTimeout(() => {
        setIsRecording(false);
        runAnalysis('custom_mic_capture');
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const isSynthetic = result?.verdict === 'SYNTHETIC_CLONE';

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#233554] pb-4">
        <div>
          <button
            onClick={onBackToHome}
            className="text-xs font-mono-tech text-[#8c909f] hover:text-[#adc6ff] mb-2 inline-block cursor-pointer transition-colors"
          >
            &lt; RETURN TO ACTIVE SURVEILLANCE
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#d6e3ff] flex items-center gap-2.5 font-['Inter']">
            <Radio className="w-6 h-6 text-[#4d8eff] animate-pulse" />
            <span>Voice &amp; Audio Deepfake Spectrogram</span>
          </h1>
          <p className="text-xs font-mono-tech text-[#8c909f] mt-1">
            NEURAL VOCODER PHASE DECOMPOSITION &bull; HARMONIC JITTER ANALYSIS
          </p>
        </div>

        {/* Live Capture & Sample Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRecording}
            className={`px-4 py-2 rounded-lg font-mono-tech text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse border border-red-400'
                : 'bg-[#112036] hover:bg-[#1D2D50] text-[#adc6ff] border border-[#233554]'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#ff5451]" />}
            <span>{isRecording ? 'CAPTURING MIC (3s)...' : 'RECORD MICROPHONE'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0A192F] p-2 rounded-xl border border-[#233554]">
        <span className="text-xs font-mono-tech text-[#8c909f] px-2">SAMPLE VECTORS:</span>
        <button
          onClick={() => setSelectedPreset('synthetic_politician')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors cursor-pointer ${
            selectedPreset === 'synthetic_politician'
              ? 'bg-[#4d8eff] text-white font-bold'
              : 'text-[#8c909f] hover:text-[#d6e3ff]'
          }`}
        >
          Politician Deepfake Clone (.WAV)
        </button>
        <button
          onClick={() => setSelectedPreset('robocall_clone')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors cursor-pointer ${
            selectedPreset === 'robocall_clone'
              ? 'bg-[#4d8eff] text-white font-bold'
              : 'text-[#8c909f] hover:text-[#d6e3ff]'
          }`}
        >
          Executive Voice Phishing (.MP3)
        </button>
        <button
          onClick={() => setSelectedPreset('authentic_briefing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors cursor-pointer ${
            selectedPreset === 'authentic_briefing'
              ? 'bg-[#4edea3] text-[#00285d] font-bold'
              : 'text-[#8c909f] hover:text-[#d6e3ff]'
          }`}
        >
          Authentic Press Dispatch
        </button>
      </div>

      {/* Real-Time Spectrogram & FFT Visualizer Box */}
      <div className="bg-[#050c18] border-2 border-[#233554] rounded-xl p-4 shadow-2xl relative overflow-hidden">
        {/* Visualizer Canvas */}
        <canvas ref={canvasRef} className="w-full h-56 rounded-lg block" />

        {/* HUD Info Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
          <span className="text-[10px] font-mono-tech text-[#adc6ff] bg-[#0A192F]/90 border border-[#233554] px-2 py-0.5 rounded">
            FFT RESOLUTION: 2048 BINS // 48.0 kHz
          </span>
        </div>

        <div className="absolute top-6 right-6 pointer-events-none">
          <span className={`text-[10px] font-mono-tech px-2.5 py-1 rounded border font-bold ${
            isSynthetic
              ? 'bg-[#ff5451]/20 border-[#ff5451]/50 text-[#ffb4ab]'
              : 'bg-[#4edea3]/20 border-[#4edea3]/50 text-[#4edea3]'
          }`}>
            {isSynthetic ? 'SYNTHETIC VOCODER DETECTED' : 'BIOMETRICALLY AUTHENTIC'}
          </span>
        </div>
      </div>

      {/* Forensic Dials & Acoustic Signal Matrix */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
            <span className="text-[11px] font-mono-tech text-[#8c909f] block">CLONING PROBABILITY</span>
            <span className={`text-2xl font-mono-tech font-bold ${result.voiceCloningProbability > 50 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
              {result.voiceCloningProbability}%
            </span>
            <div className="w-full bg-[#0A192F] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${result.voiceCloningProbability > 50 ? 'bg-[#ff5451]' : 'bg-[#4edea3]'}`}
                style={{ width: `${result.voiceCloningProbability}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
            <span className="text-[11px] font-mono-tech text-[#8c909f] block">VOCODER HARMONIC JITTER</span>
            <span className="text-2xl font-mono-tech font-bold text-[#adc6ff]">
              {result.vocoderHarmonicJitter}%
            </span>
            <div className="w-full bg-[#0A192F] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#4d8eff]" style={{ width: `${result.vocoderHarmonicJitter}%` }}></div>
            </div>
          </div>

          <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
            <span className="text-[11px] font-mono-tech text-[#8c909f] block">FORMANT CONTINUITY</span>
            <span className="text-2xl font-mono-tech font-bold text-[#4edea3]">
              {result.formantContinuity}%
            </span>
            <div className="w-full bg-[#0A192F] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#4edea3]" style={{ width: `${result.formantContinuity}%` }}></div>
            </div>
          </div>

          <div className="bg-[#112240] p-4 rounded-xl border border-[#233554] shadow-xl">
            <span className="text-[11px] font-mono-tech text-[#8c909f] block">ACOUSTIC NATURALNESS</span>
            <span className={`text-2xl font-mono-tech font-bold ${result.acousticNaturalness < 50 ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
              {result.acousticNaturalness}%
            </span>
            <div className="w-full bg-[#0A192F] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${result.acousticNaturalness < 50 ? 'bg-[#ff5451]' : 'bg-[#4edea3]'}`}
                style={{ width: `${result.acousticNaturalness}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Findings & Model Signatures */}
      {result && (
        <div className="bg-[#112036] rounded-xl border border-[#233554] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#233554] pb-3">
            <h3 className="text-base font-semibold text-[#d6e3ff] flex items-center gap-2 font-['Inter']">
              <Cpu className="w-5 h-5 text-[#4d8eff]" />
              <span>Acoustic Forensic Breakdown</span>
            </h3>
            <span className="text-xs font-mono-tech text-[#adc6ff] bg-[#0A192F] px-2.5 py-1 rounded border border-[#233554]">
              IDENTIFIED MODEL: {result.detectedSynthesisModel || 'HiFi-GAN / VITS'}
            </span>
          </div>

          <ul className="space-y-2.5">
            {result.anomalies.map((anom, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#c2c6d6]">
                {isSynthetic ? (
                  <AlertTriangle className="w-4 h-4 text-[#ffb4ab] mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#4edea3] mt-0.5 flex-shrink-0" />
                )}
                <span>{anom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
