import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';

export const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-[#0B0B0F]/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Title */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#FF4F81] animate-pulse" />
          <span className="font-serif text-lg tracking-wider text-white font-medium">
            {birthdayData.recipient.name}
          </span>
        </motion.div>

        {/* Status indicator & Music controller placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#9A9AA5] tracking-widest uppercase font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF4F81] animate-ping" />
            Universe Active
          </div>

          <button
            onClick={toggleMusic}
            aria-label="Toggle background music"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#FF4F81]/50 text-white/80 hover:text-[#FF4F81] transition-colors duration-300"
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-[#FF4F81]" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/60" />
            )}
          </button>
        </motion.div>
      </div>
    </header>
  );
};
