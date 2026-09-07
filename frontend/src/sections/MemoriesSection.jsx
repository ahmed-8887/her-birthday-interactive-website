import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { StarField } from '../components/StarField';
import { birthdayData } from '../data/birthdayData';
import { fadeIn, textFadeUp } from '../animations/variants';

export const MemoriesSection = () => {
  const navigate = useNavigate();
  const { memoriesTitle, memoriesSubtitle, memoriesParagraphs = [], memoriesEndText } = birthdayData.messages;

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/messages');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between py-12 px-4 sm:px-8 z-10 overflow-x-hidden bg-[#0B0B0F]">
      {/* Ambient Backdrop */}
      <StarField />

      {/* Header Area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-20 text-center mt-4 max-w-lg mx-auto"
      >
        <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal italic tracking-wide mb-2 text-glow-white">
          {memoriesTitle}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider uppercase">
          {memoriesSubtitle}
        </p>
      </motion.div>

      {/* Central Birthday Message Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 w-full max-w-3xl mx-auto my-6 p-6 sm:p-10 rounded-2xl bg-[#12121A]/80 border border-[#FF4F81]/30 backdrop-blur-md shadow-[0_0_40px_rgba(255,79,129,0.15)] text-center flex flex-col items-center gap-5"
      >
        {/* Subtle Decorative Star Icon */}
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#FF4F81]/10 border border-[#FF4F81]/25 mb-1 text-[#FF4F81] shadow-glow-pink">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Romantic Birthday Message Paragraphs */}
        <div className="flex flex-col gap-4 text-white font-serif italic text-base sm:text-lg md:text-xl font-normal leading-relaxed text-glow-white text-center">
          {memoriesParagraphs.map((para, index) => (
            <p key={index} className="leading-relaxed">
              "{para}"
            </p>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#FF4F81]/60 to-transparent mt-2" />
      </motion.div>

      {/* Footer Navigation Area */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={textFadeUp}
        className="relative z-20 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6 mb-4"
      >
        <p className="font-serif text-xl sm:text-2xl text-white font-normal italic mb-4 text-glow-pink">
          "{memoriesEndText}"
        </p>

        <motion.button
          onClick={handleContinue}
          whileHover={{
            scale: 1.05,
            borderColor: 'rgba(255, 79, 129, 0.8)',
            boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
            backgroundColor: 'rgba(255, 79, 129, 0.12)',
          }}
          whileTap={{ scale: 0.97 }}
          aria-label="Continue to personal messages"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#FF4F81]/40 bg-[#0B0B0F]/80 text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-4 h-4 text-[#FF4F81]" />
        </motion.button>
      </motion.div>
    </section>
  );
};
