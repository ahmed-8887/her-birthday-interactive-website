import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import { StarField } from '../components/StarField';
import { MemoryCard } from '../components/MemoryCard';
import { MemoryLightbox } from '../components/MemoryLightbox';
import { birthdayData } from '../data/birthdayData';
import { fadeIn, textFadeUp } from '../animations/variants';

export const MemoriesSection = () => {
  const navigate = useNavigate();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const { memoriesTitle, memoriesSubtitle, memoriesEndText } = birthdayData.messages;
  const memories = birthdayData.memories;

  const handleCardClick = (memory) => {
    setSelectedMemory(memory);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/messages');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between py-12 px-4 sm:px-8 z-10 select-none overflow-x-hidden bg-[#0B0B0F]">
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

      {/* Desktop Scattered Scrapbook Composition (lg viewports) */}
      <div className="relative hidden lg:block w-full max-w-6xl h-[620px] mx-auto my-6 z-20">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="absolute"
            style={{
              top: mem.desktopPos.top,
              left: mem.desktopPos.left,
              width: mem.desktopPos.width,
              zIndex: mem.desktopPos.zIndex,
            }}
          >
            <MemoryCard memory={mem} onClick={handleCardClick} />
          </div>
        ))}
      </div>

      {/* Mobile & Tablet Vertical Memory Journey (sm/md viewports) */}
      <div className="relative block lg:hidden w-full max-w-md mx-auto my-8 space-y-8 z-20">
        {memories.map((mem, idx) => (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: idx * 0.15 }}
            className={`w-[85%] sm:w-[80%] ${
              idx % 2 === 0 ? 'mr-auto text-left' : 'ml-auto text-right'
            }`}
          >
            <MemoryCard memory={mem} onClick={handleCardClick} />
          </motion.div>
        ))}
      </div>

      {/* Custom Lightbox Modal */}
      <MemoryLightbox
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />

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
