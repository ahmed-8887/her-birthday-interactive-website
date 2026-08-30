import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Candle = ({ stage, onClick }) => {
  const isLit = stage === 'candle' || stage === 'intro';
  const isBlowing = stage === 'blowing';

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center cursor-pointer select-none"
      role="button"
      aria-label="Blow out the candle"
      tabIndex={0}
    >
      {/* Realistic Flame & Ambient Heat Container */}
      <div className="relative h-28 flex flex-col items-center justify-end">
        <AnimatePresence>
          {(isLit || isBlowing) && (
            <>
              {/* Outer Radiant Heat Halo / Atmosphere (Matching Image 3 Warm Heat Aura) */}
              <motion.div
                className="absolute -top-8 w-36 h-36 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,140,50,0.45) 0%, rgba(255,79,129,0.25) 40%, rgba(230,57,70,0.1) 70%, transparent 100%)',
                  filter: 'blur(8px)',
                }}
                animate={
                  isBlowing
                    ? { opacity: [0.9, 0.3, 0], scale: [1, 0.5, 0.2] }
                    : { opacity: [0.7, 0.95, 0.7], scale: [1, 1.12, 1] }
                }
                transition={
                  isBlowing
                    ? { duration: 1.2, ease: 'easeOut' }
                    : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                }
                exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.6 } }}
              />

              {/* Realistic Multi-layered Burning Fire Flame (SVG teardrop with organic tendrils) */}
              <motion.div
                className="relative z-10 origin-bottom"
                animate={
                  isBlowing
                    ? { scale: [1, 1.4, 0.4, 0], rotate: [0, -25, 25, 0], opacity: [1, 1, 0.4, 0] }
                    : {
                        scaleY: [1, 1.08, 0.95, 1.05, 1],
                        scaleX: [1, 0.94, 1.06, 0.97, 1],
                        rotate: [-2, 2.5, -1.5, 3, -2],
                      }
                }
                transition={
                  isBlowing
                    ? { duration: 1, ease: 'easeOut' }
                    : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                }
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              >
                <svg
                  width="44"
                  height="64"
                  viewBox="0 0 44 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter drop-shadow-[0_0_12px_rgba(255,140,0,0.9)]"
                >
                  <defs>
                    {/* Outer Fiery Red Gradient */}
                    <linearGradient id="flameOuterGrad" x1="22" y1="64" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E63946" />
                      <stop offset="35%" stopColor="#FF4F81" />
                      <stop offset="70%" stopColor="#FF8F00" />
                      <stop offset="100%" stopColor="#FFF59D" />
                    </linearGradient>

                    {/* Mid Fiery Orange-Gold Gradient */}
                    <linearGradient id="flameMidGrad" x1="22" y1="58" x2="22" y2="8" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF3D00" />
                      <stop offset="40%" stopColor="#FF9100" />
                      <stop offset="85%" stopColor="#FFEA00" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>

                    {/* Inner White-Hot Core Gradient */}
                    <linearGradient id="flameInnerGrad" x1="22" y1="54" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFE082" />
                      <stop offset="60%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>

                    {/* Soft Flame Core Blur */}
                    <filter id="flameBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" />
                    </filter>
                  </defs>

                  {/* Outer Flame Mantle (Dynamic Teardrop Shape with Tendril Tip) */}
                  <motion.path
                    d="M 22 62 C 10 60 2 46 2 32 C 2 18 16 8 22 1 C 28 8 42 18 42 32 C 42 46 34 60 22 62 Z"
                    fill="url(#flameOuterGrad)"
                    animate={{
                      d: [
                        "M 22 62 C 10 60 2 46 2 32 C 2 18 16 8 22 1 C 28 8 42 18 42 32 C 42 46 34 60 22 62 Z",
                        "M 22 62 C 8 58 1 44 2 30 C 3 16 18 6 23 0 C 27 7 43 19 41 33 C 39 47 33 60 22 62 Z",
                        "M 22 62 C 12 59 3 45 2 31 C 1 17 14 7 21 2 C 29 9 41 17 42 31 C 43 45 32 60 22 62 Z",
                        "M 22 62 C 10 60 2 46 2 32 C 2 18 16 8 22 1 C 28 8 42 18 42 32 C 42 46 34 60 22 62 Z",
                      ],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Mid Fiery Layer */}
                  <motion.path
                    d="M 22 56 C 14 54 8 44 8 32 C 8 20 17 12 22 6 C 27 12 36 20 36 32 C 36 44 30 54 22 56 Z"
                    fill="url(#flameMidGrad)"
                    filter="url(#flameBlur)"
                    animate={{
                      d: [
                        "M 22 56 C 14 54 8 44 8 32 C 8 20 17 12 22 6 C 27 12 36 20 36 32 C 36 44 30 54 22 56 Z",
                        "M 22 56 C 12 52 7 42 8 30 C 9 18 19 10 23 5 C 26 11 37 21 35 33 C 33 45 29 54 22 56 Z",
                        "M 22 56 C 14 54 8 44 8 32 C 8 20 17 12 22 6 C 27 12 36 20 36 32 C 36 44 30 54 22 56 Z",
                      ],
                    }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Inner White-Hot Core */}
                  <motion.path
                    d="M 22 50 C 17 48 13 40 13 32 C 13 24 19 18 22 14 C 25 18 31 24 31 32 C 31 40 27 48 22 50 Z"
                    fill="url(#flameInnerGrad)"
                    animate={{ scaleY: [1, 1.1, 0.9, 1], scaleX: [1, 0.92, 1.08, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>

              {/* Floating Fiery Embers & Heat Wisps */}
              {isLit && !isBlowing && (
                <div className="absolute -top-4 inset-x-0 flex justify-center pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`ember-${i}`}
                      className="absolute rounded-full bg-[#FFE082]"
                      style={{
                        width: `${2 + i}px`,
                        height: `${2 + i}px`,
                        boxShadow: '0 0 6px #FF9100',
                      }}
                      initial={{ y: 0, opacity: 0, x: 0 }}
                      animate={{
                        y: -35 - i * 15,
                        opacity: [0, 0.8, 0],
                        x: (i % 2 === 0 ? 6 : -6),
                        scale: [0.8, 1.4, 0.2],
                      }}
                      transition={{
                        duration: 1.6 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Rising Smoke on Blow Out */}
        <AnimatePresence>
          {isBlowing && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`smoke-${i}`}
                  className="absolute rounded-full bg-white/20 blur-sm"
                  style={{
                    width: `${6 + i * 2}px`,
                    height: `${6 + i * 2}px`,
                  }}
                  initial={{ y: -10, opacity: 0, x: 0 }}
                  animate={{
                    y: -70 - i * 20,
                    opacity: [0, 0.5, 0],
                    x: (i % 2 === 0 ? 8 : -8),
                    scale: [1, 1.8],
                  }}
                  transition={{ duration: 1.5, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Candle Wick */}
      <div className="w-[2px] h-3 bg-zinc-600 rounded-full relative z-10 -mt-1" />

      {/* Candle Body */}
      <div className="relative flex flex-col items-center">
        {/* Top Ring Detail */}
        <div className="w-14 sm:w-16 h-2 rounded-t-sm bg-[#FF4F81]/40 border-t border-x border-[#FF4F81]/30" />

        {/* Main Body */}
        <div
          className="w-12 sm:w-14 h-28 sm:h-32 rounded-b-md relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #F5F0EB 0%, #E8E2DB 50%, #DDD7D0 100%)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4), inset -3px 0 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Decorative Pink Drip Lines */}
          <div className="absolute top-0 left-2 w-1 h-10 bg-gradient-to-b from-[#FF4F81]/50 to-transparent rounded-b-full" />
          <div className="absolute top-0 right-3 w-0.5 h-6 bg-gradient-to-b from-[#E63946]/40 to-transparent rounded-b-full" />

          {/* Subtle White Highlight */}
          <div className="absolute top-0 left-0 w-3 h-full bg-white/15 rounded-l-md" />
        </div>

        {/* Base Rim */}
        <div className="w-16 sm:w-18 h-3 rounded-b-lg bg-gradient-to-b from-[#DDD7D0] to-[#C8C2BB] border-b border-x border-black/10 shadow-md" />
      </div>
    </div>
  );
};
