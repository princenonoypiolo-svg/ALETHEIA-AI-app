import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

interface AiSmileyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  speechBubbleText?: string;
  onSpeechBubbleClick?: () => void;
  onClick?: () => void;
}

export const AiSmileyBot: React.FC<AiSmileyLogoProps> = ({
  className = '',
  size = 'lg',
  speechBubbleText,
  onSpeechBubbleClick,
  onClick,
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
    // Both hands rest down; when clicked or hovered, hands raise UP and wave!
    setIsWinking(true);
    setIsWaving(true);

    setTimeout(() => setIsWinking(false), 500);
    setTimeout(() => setIsWaving(false), 1500);

    onClick?.();
  };

  const isLarge = size === 'lg';
  const isMedium = size === 'md';
  const isWavingActive = isWaving || isHovered;

  return (
    <div className={`inline-flex items-center justify-center select-none pt-8 pb-2 px-5 ${className}`}>
      {/* AI Smiley Bot Logo Emblem */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => {
          setIsHovered(true);
          setIsWinking(true);
          setTimeout(() => setIsWinking(false), 500);
        }}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleBotClick}
        className="relative flex-shrink-0 cursor-pointer"
        title={speechBubbleText ? `Click for help using this app` : 'Point at me or click to wave! :D'}
      >
        {/* Floating Speech Bubble Message e.g. "Help?" */}
        {speechBubbleText && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBotClick();
              if (onSpeechBubbleClick) {
                onSpeechBubbleClick();
              } else if (onClick) {
                onClick();
              }
            }}
            animate={{
              y: [0, -3, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute ${
              isLarge ? '-top-8 -left-7' : '-top-7 -left-7'
            } z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/40 border border-blue-400/60 cursor-pointer whitespace-nowrap transition-colors`}
            title="Click for help using this app"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-200" />
            <span>{speechBubbleText}</span>
            {/* Speech bubble tail pointing towards the robot head */}
            <span className="absolute -bottom-1 right-3 w-2 h-2 bg-indigo-600 rotate-45 border-r border-b border-blue-400/50" />
          </motion.button>
        )}

        {/* Soft Ambient Glow */}
        <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-blue-500/20 blur-md opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Left Robotic Arm (Rests DOWN alongside body - DOES NOT WAVE) */}
        <motion.div
          animate={{ rotate: 0, y: [0, 1, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top right' }}
          className={`absolute ${
            isLarge ? '-left-4 top-6' : isMedium ? '-left-3.5 top-5.5' : '-left-3 top-4.5'
          } flex flex-col items-center pointer-events-none z-10`}
        >
          {/* Shoulder joint */}
          <div className={`${isLarge ? 'w-3 h-3' : 'w-2.5 h-2.5'} rounded-full bg-[#1e293b] border border-blue-500/50 shadow-xs`} />
          {/* Arm limb pointing DOWN */}
          <div className={`${isLarge ? 'w-2.5 h-6' : 'w-2 h-5'} -mt-0.5 rounded-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-blue-500/50 flex items-end justify-center pb-0.5`}>
            {/* Hand at the bottom */}
            <div className={`${isLarge ? 'w-2.5 h-2.5' : 'w-2 h-2'} rounded-full bg-cyan-400/80 shadow-[0_0_5px_#38bdf8]`} />
          </div>
        </motion.div>

        {/* Right Robotic Arm (Raises UP and WAVES when mouse points/hovers or clicks!) */}
        <motion.div
          animate={
            isWavingActive
              ? {
                  // Swings up into the air and waves enthusiastically side-to-side
                  rotate: [-145, -112, -155, -112, -145],
                  scale: [1, 1.08, 1, 1.08, 1],
                }
              : { rotate: 0, y: [0, 1, 0] }
          }
          transition={
            isWavingActive
              ? { duration: 0.75, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: 'top center' }}
          className={`absolute ${
            isLarge ? '-right-4 top-6' : isMedium ? '-right-3.5 top-5.5' : '-right-3 top-4.5'
          } flex flex-col items-center pointer-events-none z-20`}
        >
          {/* Shoulder joint */}
          <div className={`${isLarge ? 'w-3 h-3' : 'w-2.5 h-2.5'} rounded-full bg-[#1e293b] border border-blue-500/50 shadow-xs`} />
          {/* Arm limb */}
          <div className={`${isLarge ? 'w-2.5 h-6' : 'w-2 h-5'} -mt-0.5 rounded-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-blue-500/50 flex items-end justify-center pb-0.5`}>
            {/* Hand with glowing cyan sensor */}
            <div className={`${isLarge ? 'w-2.5 h-2.5' : 'w-2 h-2'} rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]`} />
          </div>
        </motion.div>

        {/* Bot Head Shell */}
        <div
          className={`relative ${
            isLarge
              ? 'w-16 h-16 rounded-2xl p-2'
              : isMedium
              ? 'w-13 h-13 rounded-2xl p-1.5'
              : 'w-10 h-10 rounded-xl p-1'
          } bg-gradient-to-b from-[#1e293b] via-[#141d2e] to-[#0f172a] border border-blue-500/40 group-hover:border-blue-400 flex flex-col items-center justify-between shadow-lg transition-colors z-10`}
        >
          {/* Top Antenna with Pulse Light */}
          <div className={`absolute ${isLarge ? '-top-1.5' : '-top-1'} left-1/2 -translate-x-1/2 flex flex-col items-center`}>
            <span className={`${isLarge ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-ping`} />
          </div>

          {/* Side Ear Caps */}
          <div className={`absolute -left-1 top-1/2 -translate-y-1/2 ${isLarge ? 'w-1.5 h-4' : 'w-1 h-3.5'} bg-blue-500/50 rounded-r-xs`} />
          <div className={`absolute -right-1 top-1/2 -translate-y-1/2 ${isLarge ? 'w-1.5 h-4' : 'w-1 h-3.5'} bg-blue-500/50 rounded-l-xs`} />

          {/* Screen Faceplate */}
          <div className="w-full h-full rounded-xl bg-[#070b12] border border-blue-900/50 flex flex-col items-center justify-center relative p-1">
            {/* Eyes & Cheerful Smile :D */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
              {/* Eyes */}
              <div className={`flex items-center ${isLarge ? 'gap-2.5' : 'gap-1.5'}`}>
                {isWinking ? (
                  <>
                    <span className={`${isLarge ? 'w-3.5 h-0.5' : 'w-2.5 h-0.5'} bg-cyan-400 rounded-full shadow-[0_0_5px_#38bdf8]`} />
                    <span className={`${isLarge ? 'w-3.5 h-2.5' : 'w-2.5 h-1.5'} bg-cyan-400 rounded-full shadow-[0_0_5px_#38bdf8] flex items-center justify-center`}>
                      <span className="w-1 h-1 bg-white rounded-full" />
                    </span>
                  </>
                ) : (
                  <>
                    <svg className={`${isLarge ? 'w-4 h-2.5' : 'w-3 h-1.5'} text-cyan-400`} viewBox="0 0 14 10" fill="none">
                      <path
                        d="M1 8C3 3 7 3 9 8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <svg className={`${isLarge ? 'w-4 h-2.5' : 'w-3 h-1.5'} text-cyan-400`} viewBox="0 0 14 10" fill="none">
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
                <svg className={`${isLarge ? 'w-6 h-3' : 'w-4.5 h-2'} text-cyan-300 drop-shadow-[0_0_5px_#38bdf8]`} viewBox="0 0 20 10" fill="none">
                  <path d="M3 2 Q10 11 17 2 Z" fill="currentColor" />
                  <ellipse cx="10" cy="5.5" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.85" />
                </svg>
              </div>
            </div>

            {/* Rosy Cheeks */}
            <div className="absolute bottom-1 w-full flex justify-between px-1.5 pointer-events-none">
              <span className={`${isLarge ? 'w-2 h-1' : 'w-1.5 h-0.5'} rounded-full bg-pink-500/60 blur-[0.5px]`} />
              <span className={`${isLarge ? 'w-2 h-1' : 'w-1.5 h-0.5'} rounded-full bg-pink-500/60 blur-[0.5px]`} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
