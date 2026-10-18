import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AiSmileyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AiSmileyBot: React.FC<AiSmileyLogoProps> = ({
  className = '',
  size = 'lg',
}) => {
  const [isWinking, setIsWinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Subtle auto-wink every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleBotClick = () => {
    // Both hands rest down; when clicked, right hand raises UP and waves!
    setIsWinking(true);
    setIsWaving(true);

    setTimeout(() => setIsWinking(false), 500);
    setTimeout(() => setIsWaving(false), 1500);
  };

  const isLarge = size === 'lg';

  return (
    <div className={`inline-flex items-center justify-center select-none py-2 px-5 ${className}`}>
      {/* AI Smiley Bot Logo Emblem */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleBotClick}
        className="relative flex-shrink-0 cursor-pointer"
        title="Click me to wave! :D"
      >
        {/* Soft Ambient Glow */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/20 via-cyan-400/25 to-blue-500/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Left Robotic Arm (Rests DOWN alongside body) */}
        <motion.div
          animate={
            isWaving
              ? { rotate: [0, 8, -4, 6, 0], y: [0, 1, 0, 1, 0] }
              : { rotate: 0, y: [0, 1, 0] }
          }
          transition={
            isWaving
              ? { duration: 1.4, ease: 'easeInOut' }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: 'top right' }}
          className="absolute -left-3.5 top-5 flex flex-col items-center pointer-events-none z-10"
        >
          {/* Shoulder joint */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-blue-500/50 shadow-xs" />
          {/* Arm limb pointing DOWN */}
          <div className="w-2 h-5 -mt-0.5 rounded-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-blue-500/50 flex items-end justify-center pb-0.5">
            {/* Hand at the bottom */}
            <div className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_4px_#38bdf8]" />
          </div>
        </motion.div>

        {/* Right Robotic Arm (Rests DOWN; on click raises UP and WAVES in the air!) */}
        <motion.div
          animate={
            isWaving
              ? {
                  // Swings from DOWN (0deg) -> UP into the air (-145deg) -> waves side-to-side -> returns DOWN (0deg)
                  rotate: [0, -145, -115, -150, -115, -145, -120, -140, 0],
                  scale: [1, 1.08, 1, 1.06, 1, 1.04, 1, 1, 1],
                }
              : isHovered
              ? { rotate: -15 }
              : { rotate: 0, y: [0, 1, 0] }
          }
          transition={
            isWaving
              ? { duration: 1.5, ease: 'easeInOut' }
              : isHovered
              ? { duration: 0.2 }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: 'top center' }}
          className="absolute -right-3.5 top-5 flex flex-col items-center pointer-events-none z-20"
        >
          {/* Shoulder joint */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-blue-500/50 shadow-xs" />
          {/* Arm limb */}
          <div className="w-2 h-5 -mt-0.5 rounded-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-blue-500/50 flex items-end justify-center pb-0.5">
            {/* Hand with glowing cyan sensor */}
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
          </div>

          {/* Friendly wave emoji particle that floats up when hand is up and waving */}
          <AnimatePresence>
            {isWaving && (
              <motion.div
                key="wave-particle"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1.25, y: -26 }}
                exit={{ opacity: 0, scale: 0.8, y: -34 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="absolute -top-6 -right-4 text-base pointer-events-none drop-shadow-md select-none"
              >
                👋
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bot Head Shell */}
        <div
          className={`relative ${
            isLarge ? 'w-14 h-14 rounded-2xl p-1.5' : 'w-11 h-11 rounded-xl p-1'
          } bg-gradient-to-b from-[#1e293b] via-[#141d2e] to-[#0f172a] border border-blue-500/40 group-hover:border-blue-400 flex flex-col items-center justify-between shadow-lg transition-colors z-10`}
        >
          {/* Top Antenna with Pulse Light */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-ping" />
          </div>

          {/* Side Ear Caps */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-blue-500/50 rounded-r-xs" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-blue-500/50 rounded-l-xs" />

          {/* Screen Faceplate */}
          <div className="w-full h-full rounded-xl bg-[#070b12] border border-blue-900/50 flex flex-col items-center justify-center relative p-1">
            {/* Eyes & Cheerful Smile :D */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
              {/* Eyes */}
              <div className={`flex items-center ${isLarge ? 'gap-2' : 'gap-1.5'}`}>
                {isWinking ? (
                  <>
                    <span className={`${isLarge ? 'w-3 h-0.5' : 'w-2 h-0.5'} bg-cyan-400 rounded-full shadow-[0_0_4px_#38bdf8]`} />
                    <span className={`${isLarge ? 'w-3 h-2' : 'w-2 h-1.5'} bg-cyan-400 rounded-full shadow-[0_0_4px_#38bdf8] flex items-center justify-center`}>
                      <span className="w-1 h-1 bg-white rounded-full" />
                    </span>
                  </>
                ) : (
                  <>
                    <svg className={`${isLarge ? 'w-3.5 h-2' : 'w-2.5 h-1.5'} text-cyan-400`} viewBox="0 0 14 10" fill="none">
                      <path
                        d="M1 8C3 3 7 3 9 8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <svg className={`${isLarge ? 'w-3.5 h-2' : 'w-2.5 h-1.5'} text-cyan-400`} viewBox="0 0 14 10" fill="none">
                      <path
                        d="M1 8C3 3 7 3 9 8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </>
                )}
              </div>

              {/* Cheerful :D Smile */}
              <div className="flex items-center justify-center">
                <svg className={`${isLarge ? 'w-5 h-2.5' : 'w-4 h-2'} text-cyan-300 drop-shadow-[0_0_4px_#38bdf8]`} viewBox="0 0 20 10" fill="none">
                  <path d="M3 2 Q10 11 17 2 Z" fill="currentColor" />
                  <ellipse cx="10" cy="5.5" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.85" />
                </svg>
              </div>
            </div>

            {/* Rosy Cheeks */}
            <div className="absolute bottom-1 w-full flex justify-between px-1.5 pointer-events-none">
              <span className="w-1.5 h-0.5 rounded-full bg-pink-500/60 blur-[0.5px]" />
              <span className="w-1.5 h-0.5 rounded-full bg-pink-500/60 blur-[0.5px]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
