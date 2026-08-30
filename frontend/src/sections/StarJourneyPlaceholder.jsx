import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { fadeIn } from '../animations/variants';

export const StarJourneyPlaceholder = () => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 z-10 bg-[#0B0B0F]">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#FF4F81]/30 mb-6 shadow-glow-pink">
          <Star className="w-3.5 h-3.5 text-[#FF4F81] fill-[#FF4F81]" />
          <span className="text-xs tracking-widest uppercase text-white/90 font-mono">
            Section 2 Placeholder
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal mb-4">
          Interactive Star Journey
        </h2>

        <p className="text-[#9A9AA5] text-sm sm:text-base font-light max-w-md leading-relaxed">
          Welcome to the start of our universe. This interactive constellation experience will be constructed in the next step.
        </p>
      </motion.div>
    </section>
  );
};
