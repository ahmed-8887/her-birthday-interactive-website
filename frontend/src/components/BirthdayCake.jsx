import React from 'react';
import { motion } from 'framer-motion';

export const BirthdayCake = () => {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center select-none"
    >
      {/* Mini Candles Row on Top */}
      <div className="flex items-end gap-6 mb-1 relative z-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center relative">
            {/* Realistic Mini Flame Aura */}
            <motion.div
              className="absolute -top-3 w-8 h-8 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,140,50,0.5) 0%, rgba(255,79,129,0.2) 60%, transparent 100%)',
                filter: 'blur(3px)',
              }}
              animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />

            {/* Realistic SVG Mini Burning Flame */}
            <motion.div
              className="relative z-10 origin-bottom mb-0.5"
              animate={{
                scaleY: [1, 1.1, 0.92, 1.05, 1],
                scaleX: [1, 0.92, 1.08, 0.96, 1],
                rotate: [-2, 2.5, -1.5, 3, -2],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              <svg
                width="16"
                height="24"
                viewBox="0 0 44 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_6px_rgba(255,140,0,0.8)]"
              >
                <defs>
                  <linearGradient id={`flameOuterGrad-${i}`} x1="22" y1="64" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E63946" />
                    <stop offset="35%" stopColor="#FF4F81" />
                    <stop offset="70%" stopColor="#FF8F00" />
                    <stop offset="100%" stopColor="#FFF59D" />
                  </linearGradient>

                  <linearGradient id={`flameMidGrad-${i}`} x1="22" y1="58" x2="22" y2="8" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF3D00" />
                    <stop offset="40%" stopColor="#FF9100" />
                    <stop offset="85%" stopColor="#FFEA00" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>

                  <linearGradient id={`flameInnerGrad-${i}`} x1="22" y1="54" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFE082" />
                    <stop offset="60%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>

                  <filter id={`flameBlur-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" />
                  </filter>
                </defs>

                {/* Outer Flame Mantle */}
                <path
                  d="M 22 62 C 10 60 2 46 2 32 C 2 18 16 8 22 1 C 28 8 42 18 42 32 C 42 46 34 60 22 62 Z"
                  fill={`url(#flameOuterGrad-${i})`}
                />

                {/* Mid Fiery Layer */}
                <path
                  d="M 22 56 C 14 54 8 44 8 32 C 8 20 17 12 22 6 C 27 12 36 20 36 32 C 36 44 30 54 22 56 Z"
                  fill={`url(#flameMidGrad-${i})`}
                  filter={`url(#flameBlur-${i})`}
                />

                {/* Inner White-Hot Core */}
                <path
                  d="M 22 50 C 17 48 13 40 13 32 C 13 24 19 18 22 14 C 25 18 31 24 31 32 C 31 40 27 48 22 50 Z"
                  fill={`url(#flameInnerGrad-${i})`}
                />
              </svg>
            </motion.div>

            {/* Mini Candle Stick */}
            <div className="w-1.5 h-5 bg-gradient-to-b from-[#FF4F81] to-[#E63946] rounded-b-sm" />
          </div>
        ))}
      </div>

      {/* Top Tier */}
      <div className="relative w-32 sm:w-40 h-12 sm:h-14 rounded-t-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F0F0 60%, #EDE5E5 100%)',
          boxShadow: '0 -2px 10px rgba(255,79,129,0.15)',
        }}
      >
        {/* Frosting Drip Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-around">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-5 h-4 rounded-b-full"
              style={{
                background: i % 2 === 0
                  ? 'linear-gradient(to bottom, #FF4F81, #E63946)'
                  : 'linear-gradient(to bottom, #FFFFFF, #F0E8E8)',
              }}
            />
          ))}
        </div>
        {/* Subtle Side Highlight */}
        <div className="absolute top-0 left-0 w-4 h-full bg-white/40 rounded-tl-xl" />
      </div>

      {/* Divider Layer */}
      <div className="w-36 sm:w-44 h-2 bg-gradient-to-r from-[#FF4F81]/60 via-[#E63946]/50 to-[#FF4F81]/60 shadow-glow-pink" />

      {/* Bottom Tier */}
      <div className="relative w-44 sm:w-52 h-16 sm:h-20 rounded-b-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FAFAFA 0%, #F0EAEA 40%, #E8E0E0 100%)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        }}
      >
        {/* Bottom Frosting Drip Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-around">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-b-full"
              style={{
                background: i % 2 === 0
                  ? 'linear-gradient(to bottom, #FF4F81, #E63946)'
                  : 'linear-gradient(to bottom, #FFFFFF, #F0E8E8)',
              }}
            />
          ))}
        </div>
        {/* Side Highlight */}
        <div className="absolute top-0 left-0 w-5 h-full bg-white/30 rounded-bl-xl" />

        {/* Decorative Center Heart */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF4F81] text-xl opacity-40">
          ♥
        </div>
      </div>

      {/* Cake Base / Plate */}
      <div className="w-52 sm:w-60 h-3 rounded-b-full bg-gradient-to-b from-[#DDD7D0] to-[#C0BAB4] border-b border-black/10 shadow-lg" />
    </motion.div>
  );
};
