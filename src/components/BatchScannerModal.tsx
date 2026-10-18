import React, { useState } from 'react';
import {
  X,
  ListOrdered,
  Play,
  Loader2,
  Plus,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { BatchScanItem, ScanResult } from '../types';
import { playTacticalSound } from '../utils/soundFx';

interface BatchScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (scan: ScanResult) => void;
  soundEnabled?: boolean;
}

export const BatchScannerModal: React.FC<BatchScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectScan,
  soundEnabled = true,
}) => {
  const [items, setItems] = useState<BatchScanItem[]>([
    { id: '1', target: 'https://reuters.com/investigation/space-satellite-propulsion-test', status: 'pending' },
    { id: '2', target: 'Viral video asserts lunar station destroyed by solar flare', status: 'pending' },
    { id: '3', target: 'https://nasa.gov/press-release/artemis-trajectory-confirmed', status: 'pending' },
    { id: '4', target: 'Leaked classified memo claims central bank digital currency mandatory tomorrow', status: 'pending' },
  ]);
  const [newTarget, setNewTarget] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!newTarget.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), target: newTarget.trim(), status: 'pending' },
    ]);
    setNewTarget('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRunBatch = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    playTacticalSound('scan_start', soundEnabled);

    setItems((prev) => prev.map((item) => ({ ...item, status: 'scanning' })));

    try {
      const res = await fetch('/api/scan-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectors: items.map((i) => i.target) }),
      });

      if (!res.ok) throw new Error('Batch scanning request failed');
      const data = await res.json();

      const mapped: BatchScanItem[] = items.map((item, idx) => {
        const resultItem = data.results[idx];
        return {
          ...item,
          status: resultItem ? 'completed' : 'failed',
          result: resultItem,
        };
      });

      setItems(mapped);
      playTacticalSound('scan_success', soundEnabled);
    } catch (err) {
      console.error('Batch scan error:', err);
      setItems((prev) => prev.map((item) => ({ ...item, status: 'failed' })));
    } finally {
      setIsProcessing(false);
    }
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const fabricatedCount = items.filter((i) => i.result?.verdict === 'FABRICATED').length;
  const verifiedCount = items.filter((i) => i.result?.verdict === 'VERIFIED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#111827] border border-[#243247] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#243247] flex items-center justify-between bg-[#0b0f17]">
          <div className="flex items-center gap-2.5">
            <ListOrdered className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Batch Verification Queue
              </h2>
              <span className="text-xs text-slate-400">
                Concurrent multi-target analysis pipeline
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#161f30] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingestion & Queue List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-grow">
          {/* Add Vector Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              placeholder="Add statement, URL, or headline to queue..."
              className="flex-grow bg-[#0b0f17] border border-[#243247] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddItem}
              className="px-3.5 py-2 bg-[#1e293b] hover:bg-[#283548] text-slate-200 border border-[#334155] rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Target</span>
            </button>
          </div>

          {/* Queue Items */}
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-[#0b0f17] p-3 rounded-lg border border-[#243247] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-slate-400 text-xs w-5 font-mono">#{idx + 1}</span>
                  <span className="text-slate-200 truncate max-w-sm">{item.target}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.status === 'scanning' && (
                    <span className="text-xs text-blue-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Analyzing
                    </span>
                  )}

                  {item.status === 'completed' && item.result && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          item.result.verdict === 'VERIFIED'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            : item.result.verdict === 'FABRICATED'
                            ? 'bg-red-950/40 text-red-400 border border-red-500/30'
                            : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.result.verdict} ({item.result.truthProbability}%)
                      </span>
                      <button
                        onClick={() => {
                          if (item.result) {
                            onSelectScan(item.result);
                            onClose();
                          }
                        }}
                        className="text-xs text-blue-400 hover:text-white flex items-center gap-0.5 cursor-pointer font-medium"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Rollup Summary Stats */}
          {completedCount > 0 && (
            <div className="p-3 bg-[#0b0f17] border border-[#243247] rounded-lg flex items-center justify-around text-xs">
              <span className="text-slate-400">Processed: <strong className="text-slate-100">{completedCount}/{items.length}</strong></span>
              <span className="text-emerald-400 font-medium">Verified: {verifiedCount}</span>
              <span className="text-red-400 font-medium">Fabricated: {fabricatedCount}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-[#243247] bg-[#0b0f17] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {items.length} targets queued for verification
          </span>

          <button
            onClick={handleRunBatch}
            disabled={isProcessing || items.length === 0}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Batch Analysis...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Batch Verification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
