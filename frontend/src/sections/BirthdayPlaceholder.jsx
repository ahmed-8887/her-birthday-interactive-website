import React from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { fadeIn } from '../animations/variants';

export const BirthdayPlaceholder = () => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 z-10 bg-[#0B0B0F]">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="max-w-xl mx-auto flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#FF4F81]/30 mb-6 shadow-glow-pink">
          <PartyPopper className="w-4 h-4 text-[#FF4F81]" />
          <span className="text-xs tracking-widest uppercase text-white/90 font-mono">
            Birthday Celebration Destination
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal mb-4">
          Birthday Reveal
        </h1>

        <p className="text-[#9A9AA5] text-sm sm:text-base font-light max-w-md leading-relaxed">
          The main birthday reveal experience will be constructed in the next step.
        </p>
      </motion.div>
    </section>
  );
};
