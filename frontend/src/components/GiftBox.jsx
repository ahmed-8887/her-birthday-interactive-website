import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export const GiftBox = ({ isOpen, isOpening, onClick }) => {
  // Generate 16 sparkle particles for when the gift opens
  const sparkles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: -Math.random() * 140 - 30,
      scale: Math.random() * 0.8 + 0.5,
      duration: Math.random() * 1.5 + 1.2,
      delay: Math.random() * 0.4,
      isPink: i % 2 === 0,
    }));
  }, []);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer group select-none min-w-[200px] min-h-[220px]"
    >
      {/* Radial Atmospheric Ambient Glow Behind Gift */}
      <motion.div
        className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-radial-glow blur-3xl pointer-events-none"
        animate={{
          scale: isOpening || isOpen ? [1, 1.35, 1.2] : [1, 1.08, 1],
          opacity: isOpening || isOpen ? 0.95 : 0.5,
        }}
        transition={{
          duration: isOpening ? 2 : 4,
          repeat: isOpening || isOpen ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Ambient Container */}
      <motion.div
        animate={
          isOpen || isOpening
            ? { y: 0, scale: 1.08 }
            : { y: [-6, 6, -6], scale: 1 }
        }
        transition={
          isOpen || isOpening
            ? { duration: 1, ease: 'easeOut' }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative flex flex-col items-center justify-center"
      >
        {/* Floating Heart emerging from opened gift */}
        <AnimatePresence>
          {(isOpen || isOpening) && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.4 }}
              animate={{
                y: -100,
                opacity: 1,
                scale: [1, 1.15, 1],
                filter: 'drop-shadow(0 0 25px rgba(255, 79, 129, 0.95))',
              }}
              transition={{
                duration: 1.6,
                delay: 0.8,
                scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute z-40 p-3.5 rounded-full bg-[#12121A]/90 border border-[#FF4F81]/50 shadow-glow-pink"
            >
              <Heart className="w-8 h-8 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Light Beam Erupting from Box on Open */}
        <AnimatePresence>
          {(isOpening || isOpen) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: [0, 0.9, 0.6], height: 220 }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              className="absolute bottom-16 w-32 bg-gradient-to-t from-[#FF4F81]/60 via-[#E63946]/30 to-transparent blur-md pointer-events-none z-20"
            />
          )}
        </AnimatePresence>

        {/* Sparkle Particles Rising on Open */}
        <AnimatePresence>
          {(isOpening || isOpen) &&
            sparkles.map((sp) => (
              <motion.div
                key={sp.id}
                initial={{ x: 0, y: -20, opacity: 0, scale: 0 }}
                animate={{
                  x: sp.x,
                  y: sp.y,
                  opacity: [0, 1, 0],
                  scale: [0.5, sp.scale, 0],
                }}
                transition={{
                  duration: sp.duration,
                  delay: 0.6 + sp.delay,
                  ease: 'easeOut',
                }}
                className="absolute z-30 pointer-events-none"
              >
                <Sparkles
                  className={`w-4 h-4 ${
                    sp.isPink ? 'text-[#FF4F81]' : 'text-white'
                  }`}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Gift Box Lid & Bow Layer */}
        <motion.div
          animate={
            isOpening || isOpen
              ? { y: -80, rotate: -14, opacity: 0.85 }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-30 flex flex-col items-center"
        >
          {/* Ribbon Bow */}
          <div className="relative flex items-center justify-center -mb-2 z-10">
            {/* Left Bow Loop */}
            <div className="w-8 h-8 rounded-full border-2 border-[#FF4F81] bg-[#E63946]/80 -rotate-45 shadow-glow-pink" />
            {/* Right Bow Loop */}
            <div className="w-8 h-8 rounded-full border-2 border-[#FF4F81] bg-[#E63946]/80 rotate-45 -ml-3 shadow-glow-pink" />
            {/* Center Knot */}
            <div className="absolute w-4 h-4 rounded-full bg-[#FFFFFF] border border-[#FF4F81] shadow-glow-white z-20" />
          </div>

          {/* Lid Cap */}
          <div className="w-44 sm:w-52 h-10 rounded-t-md bg-[#161622] border border-[#FF4F81]/40 shadow-lg relative overflow-hidden flex items-center justify-center">
            {/* Vertical Pink Ribbon on Lid */}
            <div className="w-7 h-full bg-gradient-to-b from-[#FF4F81] to-[#E63946] shadow-glow-pink" />
          </div>
        </motion.div>

        {/* Gift Box Body Base */}
        <div className="relative w-40 sm:w-48 h-36 rounded-b-lg bg-[#12121A] border-x border-b border-[#FF4F81]/30 shadow-2xl overflow-hidden flex items-center justify-center z-10 group-hover:border-[#FF4F81]/60 transition-colors duration-300">
          {/* Vertical Ribbon */}
          <div className="w-7 h-full bg-gradient-to-b from-[#FF4F81] via-[#E63946] to-[#FF4F81] shadow-glow-pink" />
          {/* Horizontal Ribbon */}
          <div className="absolute h-7 w-full bg-gradient-to-r from-[#FF4F81] via-[#E63946] to-[#FF4F81] shadow-glow-pink" />
          {/* Subtle Corner White Highlight */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-bl-full pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
