import React from 'react';
import { motion } from 'framer-motion';

export const MessageProgress = ({ currentIndex, total }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Step Numbers */}
      <span className="font-mono text-xs text-[#FF4F81] tracking-widest">
        0{currentIndex + 1}
      </span>

      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, idx) => (
          <motion.div
            key={idx}
            className={`rounded-full transition-all duration-500 ${
              idx === currentIndex
                ? 'w-2.5 h-2.5 bg-[#FF4F81] shadow-glow-pink'
                : idx < currentIndex
                ? 'w-1.5 h-1.5 bg-white/60'
                : 'w-1.5 h-1.5 bg-white/20'
            }`}
            animate={{
              scale: idx === currentIndex ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      {/* Total Count */}
      <span className="font-mono text-xs text-[#9A9AA5] tracking-widest">
        0{total}
      </span>
    </div>
  );
};
