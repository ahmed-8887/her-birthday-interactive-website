import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Bookmark } from 'lucide-react';

export const UniverseStar = ({ star, isDiscovered, isSelected, onClick }) => {
  const getIcon = () => {
    switch (star.type) {
      case 'memory':
        return <Bookmark className="w-3 h-3 text-[#FF4F81]" />;
      case 'wish':
        return <Sparkles className="w-3 h-3 text-white" />;
      case 'message':
      default:
        return <Heart className="w-3 h-3 text-[#E63946] fill-[#E63946]" />;
    }
  };

  return (
    <motion.button
      onClick={() => onClick(star)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(star);
        }
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer z-20"
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
      aria-label={`Constellation star: ${star.title}`}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer Pulse Glow (Active / Discovered State) */}
      {(isSelected || isDiscovered) && (
        <motion.div
          className="absolute inset-0 -m-3 rounded-full pointer-events-none"
          style={{
            background: isSelected
              ? 'radial-gradient(circle, rgba(255,79,129,0.5) 0%, rgba(230,57,70,0.2) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Star Node Core */}
      <div
        className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
          isSelected
            ? 'bg-[#FF4F81]/25 border-[#FF4F81] shadow-glow-pink'
            : isDiscovered
            ? 'bg-white/15 border-white/40 shadow-glow-white'
            : 'bg-[#0B0B0F]/90 border-white/20 group-hover:border-white/60 group-hover:bg-white/10'
        }`}
      >
        {isDiscovered ? (
          getIcon()
        ) : (
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isSelected ? 'bg-[#FF4F81]' : 'bg-white/80 group-hover:bg-white'
            }`}
          />
        )}
      </div>

      {/* Accessible Title Label on Hover/Focus */}
      <span className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase font-sans tracking-widest text-white/70 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none bg-[#0B0B0F]/80 px-2 py-0.5 rounded border border-white/10">
        {star.title}
      </span>
    </motion.button>
  );
};
