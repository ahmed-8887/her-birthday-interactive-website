import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { StarField } from '../components/StarField';
import { GiftBox } from '../components/GiftBox';
import { RevealMessage } from '../components/RevealMessage';
import { fadeIn, textFadeUp } from '../animations/variants';

export const GiftSection = () => {
  const navigate = useNavigate();
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const handleOpenGift = (e) => {
    if (e) e.preventDefault();
    if (isOpening || isOpen) return;

    setIsOpening(true);

    // 2.8s cinematic animation timeline before completing opening sequence
    setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
      setShowReveal(true);
    }, 2800);
  };

  const handleShowMemories = (e) => {
    e.preventDefault();
    navigate('/memories');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-6 z-10 select-none overflow-hidden bg-[#0B0B0F]">
      {/* Ambient Twinkling Star Backdrop */}
      <StarField isAccelerated={isOpen} />

      {/* Header Area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-20 text-center mt-4 max-w-lg mx-auto"
      >
        <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal italic tracking-wide mb-2 text-glow-white">
          You made it this far...
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider uppercase">
          I think this one is worth opening.
        </p>
      </motion.div>

      {/* Gift Box Container */}
      <div className="relative my-auto flex flex-col items-center justify-center z-20">
        <GiftBox
          isOpen={isOpen}
          isOpening={isOpening}
          onClick={handleOpenGift}
        />

        {/* Initial CTA Button */}
        <AnimatePresence>
          {!isOpening && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
              className="mt-8"
            >
              <motion.button
                onClick={handleOpenGift}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 79, 129, 0.8)',
                  boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
                  backgroundColor: 'rgba(255, 79, 129, 0.12)',
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="Open the secret gift"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/25 bg-[#0B0B0F]/80 text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F81]" />
                <span>OPEN THE GIFT ✦</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reveal Message & Navigation Footer */}
      <div className="relative z-20 text-center min-h-[160px] flex flex-col items-center justify-center max-w-xl mx-auto mb-4">
        <AnimatePresence>
          {showReveal && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textFadeUp}
              className="flex flex-col items-center gap-5"
            >
              {/* Centralized Revealed Messages */}
              <RevealMessage />

              {/* Navigation Action */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.5 }}
                className="flex flex-col items-center gap-2 mt-3"
              >
                <span className="font-sans text-xs text-[#9A9AA5] font-light tracking-widest uppercase">
                  There's more...
                </span>

                <motion.button
                  onClick={handleShowMemories}
                  whileHover={{
                    scale: 1.05,
                    borderColor: 'rgba(255, 79, 129, 0.8)',
                    boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
                    backgroundColor: 'rgba(255, 79, 129, 0.12)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Show me memories"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#FF4F81]/40 bg-[#0B0B0F]/80 text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
                >
                  <span>SHOW ME</span>
                  <ArrowRight className="w-4 h-4 text-[#FF4F81]" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
