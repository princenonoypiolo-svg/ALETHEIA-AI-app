import React from 'react';
import { History, Link as LinkIcon, FileText, Image as ImageIcon, AlertTriangle, CheckCircle2, HelpCircle, ChevronRight } from 'lucide-react';
import { ScanResult } from '../types';

interface AnalysisLogListProps {
  logs: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onViewAllHistory?: () => void;
}

export const AnalysisLogList: React.FC<AnalysisLogListProps> = ({
  logs,
  onSelectScan,
  onViewAllHistory,
}) => {
  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'file':
        return <FileText className="w-4 h-4 text-[#8c909f] flex-shrink-0" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-[#8c909f] flex-shrink-0" />;
      default:
        return <LinkIcon className="w-4 h-4 text-[#8c909f] flex-shrink-0" />;
    }
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'FABRICATED':
        return {
          chip: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
          stroke: '#EF4444',
          icon: <AlertTriangle className="w-4 h-4 text-[#EF4444]" />,
          label: 'FABRICATED',
        };
      case 'VERIFIED':
        return {
          chip: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
          stroke: '#10B981',
          icon: <CheckCircle2 className="w-4 h-4 text-[#10B981]" />,
          label: 'VERIFIED',
        };
      default:
        return {
          chip: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
          stroke: '#F59E0B',
          icon: <HelpCircle className="w-4 h-4 text-[#F59E0B]" />,
          label: 'INCONCLUSIVE',
        };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-[#d6e3ff] flex items-center gap-2 font-['Inter']">
          <History className="w-5 h-5 text-[#8c909f]" />
          <span>Analysis Log</span>
        </h2>
        {onViewAllHistory && (
          <button
            onClick={onViewAllHistory}
            className="text-xs font-mono-tech text-[#adc6ff] hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="bg-[#112240] border border-[#233554] rounded-lg overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-[#0A192F] border-b border-[#233554] font-mono-tech text-xs text-[#8c909f] uppercase tracking-wider">
          <div className="col-span-6 md:col-span-7">Target Vector</div>
          <div className="col-span-3 md:col-span-2 text-center">Confidence</div>
          <div className="col-span-3 md:col-span-3 text-right">Verdict</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#233554]">
          {logs.slice(0, 5).map((log) => {
            const verdictInfo = getVerdictStyle(log.verdict);
            const circumference = 2 * Math.PI * 15.9155; // ~100
            const strokeDash = `${log.confidence}, 100`;

            return (
              <div
                key={log.id}
                onClick={() => onSelectScan(log)}
                className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-[#1D2D50] transition-colors items-center group cursor-pointer"
              >
                {/* Target Column */}
                <div className="col-span-6 md:col-span-7 flex items-center gap-2.5 overflow-hidden">
                  {getTargetIcon(log.targetType)}
                  <span className="text-sm font-['Inter'] truncate text-[#d6e3ff] group-hover:text-[#adc6ff] transition-colors">
                    {log.target}
                  </span>
                </div>

                {/* Confidence Circular Badge */}
                <div className="col-span-3 md:col-span-2 flex justify-center items-center">
                  <div className="relative w-8 h-8 rounded-full border-2 border-[#1D2D50] flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        style={{ color: verdictInfo.stroke }}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray={strokeDash}
                        strokeWidth="4"
                      />
                    </svg>
                    <span className="font-mono-tech text-[10px] font-bold text-[#d6e3ff] z-10">
                      {log.confidence}
                    </span>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="col-span-3 md:col-span-3 text-right flex items-center justify-end gap-1.5">
                  <span
                    className={`font-mono-tech text-[11px] px-2 py-0.5 rounded border ${verdictInfo.chip} uppercase font-medium tracking-wider hidden sm:inline-block`}
                  >
                    {verdictInfo.label}
                  </span>
                  {verdictInfo.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
