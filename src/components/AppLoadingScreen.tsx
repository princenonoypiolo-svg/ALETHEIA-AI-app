import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AletheiaLoadingLogo } from './AletheiaLoadingLogo';

interface AppLoadingScreenProps {
  isLoading: boolean;
  onFinish?: () => void;
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  isLoading,
  onFinish,
}) => {
  const [progress, setProgress] = useState(12);
  const [statusMessage, setStatusMessage] = useState('Initializing Verification Engine...');
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  useEffect(() => {
    if (!isLoading) return;

    setProgress(12);
    setStatusMessage('Initializing Verification Engine...');

    const t1 = setTimeout(() => {
      setProgress(36);
      setStatusMessage('Loading Multimodal Detection Models...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(68);
      setStatusMessage('Calibrating Forensic & Tampering Filters...');
    }, 900);

    const t3 = setTimeout(() => {
      setProgress(90);
      setStatusMessage('Synchronizing Cryptographic Ledger...');
    }, 1450);

    const t4 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('Verification System Ready');
    }, 1900);

    const tFinish = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tFinish);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="app-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070b13] text-[#e2e8f0] select-none"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm px-6">
            {/* New Futuristic Cyber Shield Logo Emblem */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex justify-center"
            >
              <AletheiaLoadingLogo size="xl" />
            </motion.div>

            {/* Title & Brand */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                  Aletheia
                </h1>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Truth Verification Platform
              </p>
            </motion.div>

            {/* Minimalist Progress Meter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="w-56 space-y-2 pt-2"
            >
              <div className="w-full h-1 bg-[#161f30] border border-[#243247] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                <span>{statusMessage}</span>
                <span className="text-slate-300">{progress}%</span>
              </div>
            </motion.div>

            {/* Version Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="pt-4"
            >
              <span className="text-[10px] text-slate-500 border border-[#243247] px-2.5 py-1 rounded-full font-mono bg-[#111827]">
                Core v4.2 &bull; Enterprise Secure
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
