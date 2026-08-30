import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

export const InteractiveStar = ({
  star,
  isTarget,
  isSelected,
  isCompleted,
  onClick,
}) => {
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    onClick(star.id);

    if (!isTarget && !isSelected) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 600);
    }
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
    >
      <motion.button
        onClick={handleClick}
        aria-label={isTarget ? "Follow the glowing star" : `Star ${star.id + 1}`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center min-w-[48px] min-h-[48px] p-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
      >
        {/* Ambient Halo Glow */}
        {(isTarget || isSelected || isCompleted) && (
          <motion.div
            className="absolute inset-1 rounded-full bg-[#FF4F81]/20 blur-md pointer-events-none"
            animate={{
              scale: isTarget ? [1, 1.4, 1] : 1,
              opacity: isTarget ? [0.6, 1, 0.6] : 0.8,
            }}
            transition={{
              duration: isTarget ? 1.8 : 0.5,
              repeat: isTarget ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Non-punitive Ripple Effect for non-target taps */}
        <AnimatePresence>
          {isRippling && (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/40 pointer-events-none"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Central Star Icon */}
        <motion.div
          animate={{
            scale: isTarget ? [1, 1.2, 1] : isSelected ? 1.15 : 1,
            rotate: isTarget ? [0, 15, -15, 0] : 0,
          }}
          transition={{
            duration: isTarget ? 2.5 : 0.3,
            repeat: isTarget ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <Star
            className={`w-5 h-5 transition-colors duration-300 ${
              isTarget
                ? 'text-[#FF4F81] fill-[#FF4F81] filter drop-shadow-[0_0_12px_rgba(255,79,129,0.9)]'
                : isSelected || isCompleted
                ? 'text-[#FF4F81] fill-[#FF4F81] filter drop-shadow-[0_0_8px_rgba(255,79,129,0.6)]'
                : 'text-white/60 hover:text-white fill-white/20'
            }`}
          />
        </motion.div>
      </motion.button>
    </div>
  );
};
