import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export const MemoryLightbox = ({ memory, onClose }) => {
  // Global Escape key listener for accessible closing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!memory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0B0F]/90 backdrop-blur-md">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Modal Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl w-full bg-[#12121A] border border-[#FF4F81]/40 rounded-2xl p-6 sm:p-8 shadow-glow-pink overflow-hidden flex flex-col items-center text-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close memory modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#FF4F81]/50 text-white/80 hover:text-[#FF4F81] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Date Tag */}
          {memory.date && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF4F81]/15 border border-[#FF4F81]/30 mb-4">
              <Sparkles className="w-3 h-3 text-[#FF4F81]" />
              <span className="text-xs font-mono tracking-widest text-[#FF4F81] uppercase">
                {memory.date}
              </span>
            </div>
          )}

          {/* Expanded Image */}
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/60 shadow-2xl mb-6 border border-white/10">
            <img
              src={memory.image}
              alt={memory.caption}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Emotional Caption */}
          <h2 className="font-serif italic text-2xl sm:text-3xl text-white font-normal leading-relaxed text-glow-white mb-2">
            "{memory.caption}"
          </h2>

          <p className="font-sans text-xs text-[#9A9AA5] tracking-widest uppercase mt-2">
            Tap anywhere outside or press ESC to return
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
