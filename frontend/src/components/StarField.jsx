import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const StarField = ({ isAccelerated = false }) => {
  // Generate deterministic random positions for 50 subtle ambient stars
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.25,
      duration: Math.random() * 3 + 2.5,
      delay: Math.random() * 2,
      isPink: i % 6 === 0,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0B0B0F]">
      {/* Subtle radial ambient glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial-glow blur-3xl pointer-events-none"
        animate={{
          scale: isAccelerated ? [1, 1.4, 1.2] : [1, 1.05, 1],
          opacity: isAccelerated ? 0.9 : 0.5,
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Twinkling star particles */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: star.isPink ? '#FF4F81' : '#FFFFFF',
            boxShadow: star.isPink
              ? '0 0 8px rgba(255, 79, 129, 0.9)'
              : '0 0 5px rgba(255, 255, 255, 0.7)',
          }}
          animate={{
            opacity: isAccelerated 
              ? [star.opacity * 0.5, 1, star.opacity * 0.5]
              : [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            scale: isAccelerated ? [1, 2.2, 1] : [1, 1.3, 1],
            y: isAccelerated ? [0, -25, 0] : [0, 0, 0],
          }}
          transition={{
            duration: isAccelerated ? star.duration * 0.4 : star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
