import React from 'react';
import { motion } from 'framer-motion';

export const MemoryCard = ({ memory, onClick, className = '' }) => {
  return (
    <motion.button
      onClick={() => onClick(memory)}
      aria-label={`View memory: ${memory.caption}`}
      whileHover={{
        y: -10,
        scale: 1.05,
        rotate: memory.rotation * 0.4,
        boxShadow: '0 25px 45px rgba(255, 79, 129, 0.35)',
      }}
      whileTap={{ scale: 0.96 }}
      style={{ rotate: `${memory.rotation}deg` }}
      className={`group relative bg-[#FAFAFC] text-[#0B0B0F] p-3.5 pt-4 pb-5 rounded-md shadow-xl border border-white/40 cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] ${className}`}
    >
      {/* Image Frame Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-zinc-950 mb-3">
        <img
          src={memory.image}
          alt={memory.caption}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle photo gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Handwritten Caption Area */}
      <div className="flex flex-col items-center text-center px-1">
        <p className="font-serif italic text-base sm:text-lg text-zinc-900 leading-snug line-clamp-2">
          "{memory.caption}"
        </p>

        {memory.date && (
          <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-600 font-mono mt-1.5">
            {memory.date}
          </span>
        )}
      </div>
    </motion.button>
  );
};
