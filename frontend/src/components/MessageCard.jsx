import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export const MessageCard = ({ message }) => {
  if (!message) return null;

  const { styleVariant, text, smallLabel } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-w-2xl w-full mx-auto flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] px-6 text-center"
    >
      {/* Variation 1: Centered Display */}
      {styleVariant === 'centered' && (
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF4F81] mb-6 block">
            {smallLabel}
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-white leading-relaxed text-glow-white">
            "{text}"
          </h2>
        </div>
      )}

      {/* Variation 2: Left Aligned Intimate Typography */}
      {styleVariant === 'leftAligned' && (
        <div className="w-full text-left border-l-2 border-[#FF4F81]/60 pl-6 sm:pl-8 py-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF4F81] mb-4 block">
            {smallLabel}
          </span>
          <h2 className="font-serif italic text-2xl sm:text-4xl font-normal text-white leading-relaxed text-glow-white">
            "{text}"
          </h2>
        </div>
      )}

      {/* Variation 3: Centered with Glowing Heart Accent */}
      {styleVariant === 'heartGlow' && (
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF4F81] mb-6 block">
            {smallLabel}
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-white leading-relaxed text-glow-white mb-6">
            "{text}"
          </h2>
          <div className="p-2.5 rounded-full bg-white/5 border border-[#FF4F81]/30 shadow-glow-pink">
            <Heart className="w-5 h-5 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
          </div>
        </div>
      )}

      {/* Variation 4: Large Display Typography */}
      {styleVariant === 'largeTypography' && (
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#9A9AA5] mb-6 block">
            {smallLabel}
          </span>
          <h2 className="font-serif italic text-3xl sm:text-6xl font-light text-white leading-[1.2] text-glow-pink">
            "{text}"
          </h2>
        </div>
      )}

      {/* Variation 5: Star Surrounded Layout */}
      {styleVariant === 'starSurrounded' && (
        <div className="relative flex flex-col items-center py-4">
          <Sparkles className="absolute -top-4 -left-2 sm:-left-6 w-5 h-5 text-[#FF4F81] animate-pulse" />
          <Sparkles className="absolute -bottom-4 -right-2 sm:-right-6 w-5 h-5 text-white/60 animate-pulse" />

          <span className="font-mono text-xs uppercase tracking-widest text-[#FF4F81] mb-6 block">
            {smallLabel}
          </span>
          <h2 className="font-serif italic text-2xl sm:text-4xl font-normal text-white leading-relaxed text-glow-white">
            "{text}"
          </h2>
        </div>
      )}

      {/* Variation 6: Minimal with Red Accent Line */}
      {styleVariant === 'minimalRedLine' && (
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF4F81] mb-6 block">
            {smallLabel}
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-white leading-relaxed text-glow-white mb-8">
            "{text}"
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#E63946] to-transparent shadow-glow-red" />
        </div>
      )}
    </motion.div>
  );
};
