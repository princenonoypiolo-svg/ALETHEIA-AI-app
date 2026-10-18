import React, { useState } from 'react';
import { ShieldAlert, Cpu, Activity, RefreshCw } from 'lucide-react';

export const SystemStatusCard: React.FC = () => {
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);
  const [activeMetricDetail, setActiveMetricDetail] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(1204);
  const [threatCount, setThreatCount] = useState(84.2);

  const handlePingNetwork = () => {
    if (isPinging) return;
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setLastPingTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setNodeCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
      setThreatCount((prev) => +(prev + 0.1).toFixed(1));
    }, 1200);
  };

  const toggleMetricDetail = (metric: string) => {
    setActiveMetricDetail((prev) => (prev === metric ? null : metric));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Global Telemetry Card */}
      <div className="bg-[#111827] border border-[#243247] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#243247] pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Platform Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time verification cluster status</p>
          </div>

          <button
            type="button"
            onClick={handlePingNetwork}
            title="Refresh network telemetry"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer bg-[#161f30] hover:bg-[#1e293b] border border-[#243247] px-2.5 py-1 rounded-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        <div className="space-y-2">
          {/* Threats Neutralized Metric */}
          <div>
            <button
              type="button"
              onClick={() => toggleMetricDetail('threats')}
              className="w-full flex justify-between items-center p-2.5 rounded-lg bg-[#0b0f17] hover:bg-[#161f30] border border-[#243247] transition-colors cursor-pointer text-left"
            >
              <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span>Threats Neutralized</span>
              </span>
              <span className="font-semibold text-sm text-slate-100">
                {threatCount}K
              </span>
            </button>
            {activeMetricDetail === 'threats' && (
              <div className="bg-[#161f30] p-3 rounded-lg mt-1 text-xs text-slate-300 border border-[#243247] space-y-1.5 animate-fadeIn">
                <div className="flex justify-between">
                  <span className="text-slate-400">Deepfake Imagery:</span>
                  <span className="font-medium text-slate-200">32.4K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fabricated News Wires:</span>
                  <span className="font-medium text-slate-200">28.1K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Synthetic Audio &amp; Video:</span>
                  <span className="font-medium text-slate-200">23.7K</span>
                </div>
              </div>
            )}
          </div>

          {/* Active Nodes Metric */}
          <div>
            <button
              type="button"
              onClick={() => toggleMetricDetail('nodes')}
              className="w-full flex justify-between items-center p-2.5 rounded-lg bg-[#0b0f17] hover:bg-[#161f30] border border-[#243247] transition-colors cursor-pointer text-left"
            >
              <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Active Nodes</span>
              </span>
              <span className="font-semibold text-sm text-emerald-400">
                {nodeCount.toLocaleString()}
              </span>
            </button>
            {activeMetricDetail === 'nodes' && (
              <div className="bg-[#161f30] p-3 rounded-lg mt-1 text-xs text-slate-300 border border-[#243247] space-y-1.5 animate-fadeIn">
                <div className="flex justify-between">
                  <span className="text-slate-400">US-East Cluster:</span>
                  <span className="font-medium text-emerald-400">412 active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">EU-West Cluster:</span>
                  <span className="font-medium text-emerald-400">388 active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AP-South Cluster:</span>
                  <span className="font-medium text-emerald-400">404 active</span>
                </div>
              </div>
            )}
          </div>

          {/* Pipeline Latency Metric */}
          <div>
            <button
              type="button"
              onClick={() => toggleMetricDetail('latency')}
              className="w-full flex justify-between items-center p-2.5 rounded-lg bg-[#0b0f17] hover:bg-[#161f30] border border-[#243247] transition-colors cursor-pointer text-left"
            >
              <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Verification Latency</span>
              </span>
              <span className="font-semibold text-xs text-blue-400">
                0.4s
              </span>
            </button>
            {activeMetricDetail === 'latency' && (
              <div className="bg-[#161f30] p-3 rounded-lg mt-1 text-xs text-slate-300 border border-[#243247] space-y-1.5 animate-fadeIn">
                <div className="flex justify-between">
                  <span className="text-slate-400">Inference Response:</span>
                  <span className="font-medium text-blue-300">380ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Entropy Decomposition:</span>
                  <span className="font-medium text-blue-300">20ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Packet Loss:</span>
                  <span className="font-medium text-emerald-400">0.0%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {lastPingTime && (
          <div className="pt-3 mt-3 border-t border-[#243247] flex justify-between items-center text-[11px] text-slate-400">
            <span>Last Telemetry Sync:</span>
            <span className="text-emerald-400">{lastPingTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};
