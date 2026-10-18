import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Link as LinkIcon,
  ChevronRight,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { ScanResult } from '../types';

interface HistoryViewProps {
  logs: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onClearHistory: () => void;
  onBackToHome: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  logs,
  onSelectScan,
  onClearHistory,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FABRICATED' | 'VERIFIED' | 'INCONCLUSIVE'>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'ALL') return matchesSearch;
    return matchesSearch && log.verdict === activeFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-sm text-[#8c909f] hover:text-[#adc6ff] font-mono-tech transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&lt; RETURN TO ACTIVE SURVEILLANCE</span>
        </button>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-mono-tech text-[#ffb4ab] hover:text-white bg-[#93000a]/20 border border-[#ff5451]/30 px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Dossiers</span>
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#233554] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#d6e3ff] flex items-center gap-2.5 font-['Inter']">
            <History className="w-6 h-6 text-[#4d8eff]" />
            <span>Analysis Log &amp; Archives</span>
          </h1>
          <p className="text-sm text-[#c2c6d6] mt-1 font-['Inter']">
            Comprehensive audit log of parsed data vectors, verification scores, and forensic signals.
          </p>
        </div>
        <div className="text-xs font-mono-tech text-[#8c909f] bg-[#112036] border border-[#233554] px-3 py-1.5 rounded self-start md:self-auto">
          TOTAL DOSSIERS: {logs.length}
        </div>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8c909f] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search targets, headlines, keywords..."
            className="w-full bg-[#0A192F] border border-[#233554] text-[#d6e3ff] placeholder-[#424754] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#3B82F6] font-['Inter']"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'FABRICATED', 'VERIFIED', 'INCONCLUSIVE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`font-mono-tech text-xs px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#4d8eff] text-white font-bold shadow-sm'
                  : 'bg-[#112036] text-[#8c909f] hover:text-[#d6e3ff] border border-[#233554]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Log List */}
      <div className="bg-[#112036] border border-[#233554] rounded-xl overflow-hidden shadow-xl">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-[#233554]">
            {filteredLogs.map((log) => {
              const isFabricated = log.verdict === 'FABRICATED';
              const isVerified = log.verdict === 'VERIFIED';
              const badgeBorder = isVerified
                ? 'border-[#10B981]/30 text-[#10B981] bg-[#10B981]/10'
                : isFabricated
                ? 'border-[#EF4444]/30 text-[#EF4444] bg-[#EF4444]/10'
                : 'border-[#F59E0B]/30 text-[#F59E0B] bg-[#F59E0B]/10';

              return (
                <div
                  key={log.id}
                  onClick={() => onSelectScan(log)}
                  className="p-4 hover:bg-[#1D2D50] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-xs text-[#8c909f]">
                        {log.timestamp}
                      </span>
                      <span className="text-[#233554]">•</span>
                      <span className="font-mono-tech text-xs text-[#adc6ff] bg-[#0A192F] px-2 py-0.5 rounded border border-[#233554] truncate max-w-xs">
                        {log.target}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#d6e3ff] group-hover:text-[#adc6ff] transition-colors font-['Inter']">
                      {log.headline}
                    </h3>
                    <p className="text-xs text-[#8c909f] line-clamp-1 font-['Inter']">
                      {log.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <span className="font-mono-tech text-xs text-[#8c909f] block">
                        TRUTH PROB
                      </span>
                      <span
                        className="font-mono-tech font-bold text-sm"
                        style={{
                          color: isVerified
                            ? '#10B981'
                            : isFabricated
                            ? '#EF4444'
                            : '#F59E0B',
                        }}
                      >
                        {log.truthProbability}%
                      </span>
                    </div>

                    <span
                      className={`font-mono-tech text-xs px-2.5 py-1 rounded border uppercase ${badgeBorder}`}
                    >
                      {log.verdict}
                    </span>

                    <ChevronRight className="w-5 h-5 text-[#8c909f] group-hover:text-[#d6e3ff] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-[#8c909f] space-y-2">
            <History className="w-10 h-10 mx-auto text-[#233554]" />
            <p className="text-sm font-['Inter']">No surveillance dossiers match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
