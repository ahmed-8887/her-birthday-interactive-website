import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowDown, Stars } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';
import { fadeIn, floatAnimation, glowingHeartPulse } from '../animations/variants';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 z-10">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Subtle romantic pill badge */}
        <motion.div 
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#FF4F81]/30 backdrop-blur-md mb-8 shadow-glow-pink"
        >
          <motion.div variants={glowingHeartPulse} initial="initial" animate="animate">
            <Heart className="w-3.5 h-3.5 text-[#FF4F81] fill-[#FF4F81]" />
          </motion.div>
          <span className="text-xs tracking-widest uppercase text-white/90 font-medium">
            {birthdayData.messages.heroTagline}
          </span>
        </motion.div>

        {/* Main Title */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.1] mb-6">
          Happy Birthday, <br />
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4F81] to-[#E63946] text-glow-pink">
            {birthdayData.recipient.name}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#9A9AA5] max-w-xl font-light leading-relaxed mb-12">
          {birthdayData.messages.heroSubtitle}
        </p>

        {/* Call to Action Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 79, 129, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E63946] text-white font-medium text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 shadow-glow-red"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Stars className="w-4 h-4 text-white" />
            Begin Our Journey
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4F81] to-[#E63946] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-[#9A9AA5] tracking-widest uppercase"
      >
        <span>Scroll to Explore</span>
        <ArrowDown className="w-4 h-4 text-[#FF4F81] animate-bounce" />
      </motion.div>
    </section>
  );
};
