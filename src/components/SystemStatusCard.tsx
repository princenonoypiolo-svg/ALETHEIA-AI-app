import React, { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, Activity, RefreshCw, Zap, Lock } from 'lucide-react';
import { TelemetryStats } from '../types';

interface SystemStatusCardProps {
  stats?: TelemetryStats;
  onSync?: () => void;
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ stats, onSync }) => {
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);
  const [activeMetricDetail, setActiveMetricDetail] = useState<string | null>(null);

  // Fallback local stats if no external stats provided
  const [localStats, setLocalStats] = useState<TelemetryStats>(() => {
    try {
      const saved = localStorage.getItem('aletheia_telemetry_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      threatCount: 0.0,
      deepfakeCount: 0.0,
      newsCount: 0.0,
      syntheticMediaCount: 0.0,
      nodeCount: 0.0,
      latencyVal: 0.0,
      inferenceVal: 0.0,
      latticeVal: 0.0,
      packetLoss: 0.0,
    };
  });

  const currentStats = stats || localStats;
  const [onlineCount, setOnlineCount] = useState<number>(1);

  // Live online presence tracking for Active Nodes
  const pingPresence = async () => {
    let sessionId = 'op_client';
    try {
      sessionId =
        sessionStorage.getItem('aletheia_presence_id') ||
        'op_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('aletheia_presence_id', sessionId);
    } catch {}

    try {
      const res = await fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, operativeName: 'Operative' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.onlineCount === 'number') {
          setOnlineCount(Math.max(1, data.onlineCount));
        }
      }
    } catch {
      setOnlineCount((prev) => (prev > 0 ? prev : 1));
    }
  };

  useEffect(() => {
    pingPresence();
    const interval = setInterval(pingPresence, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePingNetwork = () => {
    if (isPinging) return;
    setIsPinging(true);
    pingPresence();
    if (onSync) {
      onSync();
    }
    setTimeout(() => {
      setIsPinging(false);
      setLastPingTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (!stats) {
        setLocalStats((prev) => ({
          ...prev,
          latencyVal: 0.1,
          inferenceVal: 10.0,
          latticeVal: 1.0,
          packetLoss: 0.0,
        }));
      }
    }, 1000);
  };

  const toggleMetricDetail = (metric: string) => {
    setActiveMetricDetail((prev) => (prev === metric ? null : metric));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Global Telemetry Card matching user's reference */}
      <div className="bg-[#0b1322] border border-[#1e2a3f] rounded-2xl p-5 sm:p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e2a3f] pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Platform Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time verification cluster status</p>
          </div>

          <button
            type="button"
            onClick={handlePingNetwork}
            title="Refresh network telemetry"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer bg-[#141e33] hover:bg-[#1a2742] border border-[#243552] px-3 py-1.5 rounded-xl shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isPinging ? 'animate-spin text-blue-400' : ''}`} />
            <span className="font-medium">Sync</span>
          </button>
        </div>

        {/* Metric Cards List */}
        <div className="space-y-3">
          
          {/* Threats Neutralized Metric */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleMetricDetail('threats')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                activeMetricDetail === 'threats'
                  ? 'bg-[#0b1424] border-blue-500/50 shadow-md'
                  : 'bg-[#080e1b] hover:bg-[#0c1628] border-[#18253d]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  Threats Neutralized
                </span>
              </div>
              <span className="font-mono font-bold text-base text-white">
                {currentStats.threatCount.toFixed(1)}
              </span>
            </button>

            {activeMetricDetail === 'threats' && (
              <div className="bg-[#080e1b] p-3.5 rounded-xl text-xs border border-[#18253d] space-y-2 animate-fadeIn shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Deepfake Imagery:</span>
                  <span className="font-mono font-bold text-sm text-white">{currentStats.deepfakeCount.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Fabricated News Wires:</span>
                  <span className="font-mono font-bold text-sm text-white">{currentStats.newsCount.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Synthetic Audio &amp; Video:</span>
                  <span className="font-mono font-bold text-sm text-white">{currentStats.syntheticMediaCount.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Active Nodes Metric (Live Online Users) */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleMetricDetail('nodes')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                activeMetricDetail === 'nodes'
                  ? 'bg-[#0b1424] border-blue-500/50 shadow-md'
                  : 'bg-[#080e1b] hover:bg-[#0c1628] border-[#18253d]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner relative">
                  <Cpu className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0b1322] animate-pulse"></span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-slate-200 block truncate">
                    Active Nodes
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Online Operatives</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-blue-400">
                  {onlineCount}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {onlineCount === 1 ? '1 online' : `${onlineCount} online`}
                </span>
              </div>
            </button>

            {activeMetricDetail === 'nodes' && (
              <div className="bg-[#080e1b] p-3.5 rounded-xl text-xs border border-[#18253d] space-y-2 animate-fadeIn shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Active Users Online:</span>
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    {onlineCount} {onlineCount === 1 ? 'User' : 'Users'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Your Active Session:</span>
                  <span className="font-mono font-bold text-sm text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Connected (Live)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Platform Node Sync:</span>
                  <span className="font-mono font-bold text-sm text-white">Realtime Active</span>
                </div>
              </div>
            )}
          </div>

          {/* Verification Latency Metric */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleMetricDetail('latency')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                activeMetricDetail === 'latency'
                  ? 'bg-[#0b1424] border-blue-500/50 shadow-md'
                  : 'bg-[#080e1b] hover:bg-[#0c1628] border-[#18253d]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  Verification Latency
                </span>
              </div>
              <span className="font-mono font-bold text-base text-blue-400">
                {currentStats.latencyVal.toFixed(1)}s
              </span>
            </button>

            {activeMetricDetail === 'latency' && (
              <div className="bg-[#080e1b] p-3.5 rounded-xl text-xs border border-[#18253d] space-y-2 animate-fadeIn shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Vision Neural Inference:</span>
                  <span className="font-mono font-bold text-sm text-white">{(currentStats.inferenceVal ?? 0).toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Lattice Frequency Scan:</span>
                  <span className="font-mono font-bold text-sm text-white">{(currentStats.latticeVal ?? 0).toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#38bdf8] font-medium">Corroboration Packet Loss:</span>
                  <span className="font-mono font-bold text-sm text-white">{(currentStats.packetLoss ?? 0).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Enclave Status Footer */}
        <div className="pt-4 mt-4 border-t border-[#1e2a3f] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Cryptographic Enclave</span>
          </span>
          <span className="font-mono text-blue-400 font-bold">Active</span>
        </div>

        {lastPingTime && (
          <div className="pt-2 text-[10px] text-slate-500 font-mono text-right">
            Last Telemetry Sync: {lastPingTime}
          </div>
        )}
      </div>
    </div>
  );
};
