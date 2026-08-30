import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export const UniverseMessage = ({ star, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!star) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-auto">
        {/* Soft Dim Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B0B0F]/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Floating Dark Glass Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-50 w-full max-w-md bg-[#0B0B0F]/90 border border-[#FF4F81]/40 rounded-2xl p-6 sm:p-8 shadow-glow-pink text-center overflow-hidden mb-6 sm:mb-0"
        >
          {/* Subtle Pink Ambient Glow Background */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF4F81]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close star message"
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content Type Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-sans tracking-widest uppercase text-[#FF4F81] mb-4">
            <Sparkles className="w-3 h-3 text-[#FF4F81]" />
            <span>{star.type}</span>
          </div>

          {/* Star Title */}
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
            {star.title}
          </h3>

          {/* Star Content Text */}
          <p className="font-sans text-sm sm:text-base text-[#9A9AA5] font-light leading-relaxed mb-6">
            "{star.text}"
          </p>

          {/* Dismiss CTA Helper */}
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-sans text-xs font-medium tracking-widest uppercase transition-all duration-200 cursor-pointer"
          >
            CONTINUE EXPLORING
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
