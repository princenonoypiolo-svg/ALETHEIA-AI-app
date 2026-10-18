import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  X,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { ChatMessage, ScanResult } from '../types';

interface AiAssistantWidgetProps {
  currentScan?: ScanResult | null;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  currentScan,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: 'Aletheia Verification Copilot online. Ready to analyze threats and verify media, Boss Prince!',
      timestamp: 'Now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputVal('');
    setIsSending(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          context: currentScan
            ? {
                target: currentScan.target,
                verdict: currentScan.verdict,
                truthProbability: currentScan.truthProbability,
                summary: currentScan.summary,
              }
            : null,
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Analysis completed with no telemetry anomalies.',
          timestamp: 'Just now',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: currentScan
            ? `Regarding "${currentScan.target}": System evaluated a truth probability of ${currentScan.truthProbability}%. Verdict: ${currentScan.verdict}.`
            : 'Copilot is ready. Enter a query or run a verification scan to investigate claims and media.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = currentScan
    ? [
        'Explain this verdict',
        'How was AI probability calculated?',
        'Summarize evidence sources',
      ]
    : [
        'How does AI picture detection work?',
        'How does video keyframe analysis work?',
        'What is Error Level Analysis (ELA)?',
      ];

  return (
    <>
      {/* Floating Enterprise Assistant Trigger */}
      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer border border-blue-400/30"
          title="Open Aletheia Copilot"
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Slide-out Intelligence Copilot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-50 w-[calc(100vw-32px)] sm:w-96 max-h-[550px] bg-[#111827] border border-[#243247] rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0b0f17] p-3.5 border-b border-[#243247] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Aletheia Copilot
                  </h3>
                  <span className="text-[11px] text-slate-400 block">
                    Powered by Gemini Multimodal AI
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#161f30] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Context Banner if scanning */}
            {currentScan && (
              <div className="bg-[#161f30] px-3.5 py-1.5 border-b border-[#243247] text-xs text-slate-300 flex items-center justify-between">
                <span className="truncate max-w-[220px]">
                  Target: {currentScan.target}
                </span>
                <span
                  className={`font-semibold ${
                    currentScan.verdict === 'VERIFIED'
                      ? 'text-emerald-400'
                      : currentScan.verdict === 'FABRICATED'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {currentScan.verdict}
                </span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 min-h-[220px] max-h-[320px] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-2.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-[#161f30] border border-[#243247] text-slate-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-[#161f30] border border-[#243247] text-slate-400 rounded-lg p-2.5 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    <span>Analyzing verification query...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-[#0b0f17] border-t border-[#243247] flex gap-1.5 overflow-x-auto">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isSending}
                  className="text-xs bg-[#161f30] hover:bg-[#1e293b] text-slate-300 border border-[#243247] px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-2.5 bg-[#0b0f17] border-t border-[#243247] flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about claims, AI detection, or sources..."
                className="flex-1 bg-[#111827] border border-[#243247] text-slate-100 placeholder-slate-500 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isSending || !inputVal.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
