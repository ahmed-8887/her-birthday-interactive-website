import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { StarField } from '../components/StarField';
import { MessageCard } from '../components/MessageCard';
import { MessageProgress } from '../components/MessageProgress';
import { birthdayData } from '../data/birthdayData';
import { fadeIn, textFadeUp } from '../animations/variants';

export const MessagesSection = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const messages = birthdayData.personalMessages;
  const { messagesOpeningTitle, messagesOpeningSubtitle, messagesFinalText1, messagesFinalText2 } = birthdayData.messages;

  // Advance to next message or complete sequence
  const handleAdvance = useCallback(() => {
    if (!isStarted || isFinished) return;

    if (currentIndex < messages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [isStarted, isFinished, currentIndex, messages.length]);

  // Global Keyboard Listener (Space, Enter, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isStarted) {
          setIsStarted(true);
        } else if (!isFinished) {
          handleAdvance();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isFinished, handleAdvance]);

  const handleCelebrateClick = (e) => {
    e.preventDefault();
    navigate('/birthday');
  };

  return (
    <section
      onClick={isStarted && !isFinished ? handleAdvance : undefined}
      className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-6 z-10 select-none overflow-hidden bg-[#0B0B0F] cursor-pointer"
    >
      {/* Ambient Twinkling Backdrop */}
      <StarField isAccelerated={isFinished} />

      {/* Screen 1: Opening State */}
      {!isStarted && (
        <div className="my-auto flex flex-col items-center text-center max-w-lg mx-auto z-20">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="font-serif text-3xl sm:text-5xl text-white font-normal italic tracking-wide mb-3 text-glow-white"
          >
            {messagesOpeningTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider uppercase mb-10"
          >
            {messagesOpeningSubtitle}
          </motion.p>

          <motion.button
            onClick={() => setIsStarted(true)}
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 79, 129, 0.8)',
              boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
              backgroundColor: 'rgba(255, 79, 129, 0.12)',
            }}
            whileTap={{ scale: 0.97 }}
            aria-label="Begin reading personal messages"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/25 bg-[#0B0B0F]/80 text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF4F81]" />
            <span>BEGIN ✦</span>
          </motion.button>
        </div>
      )}

      {/* Screen 2: Active One-at-a-Time Message Sequence */}
      {isStarted && !isFinished && (
        <>
          {/* Header Progress Bar */}
          <div className="relative z-20 mt-4">
            <MessageProgress currentIndex={currentIndex} total={messages.length} />
          </div>

          {/* Message Display Canvas */}
          <div className="relative my-auto z-20 w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <MessageCard key={messages[currentIndex].id} message={messages[currentIndex]} />
            </AnimatePresence>
          </div>

          {/* Tap / Click Helper Label */}
          <div className="relative z-20 mb-4 text-center">
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#9A9AA5] font-mono animate-pulse">
              TAP OR PRESS SPACE TO CONTINUE
            </span>
          </div>
        </>
      )}

      {/* Screen 3: Final Celebration Reveal */}
      {isFinished && (
        <div className="my-auto flex flex-col items-center text-center max-w-lg mx-auto z-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textFadeUp}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-serif italic text-2xl sm:text-4xl text-[#9A9AA5] font-light">
              "{messagesFinalText1}"
            </p>

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="font-serif italic text-4xl sm:text-6xl text-white font-normal text-glow-pink my-2"
            >
              "{messagesFinalText2}"
            </motion.h2>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="p-3 rounded-full bg-white/5 border border-[#FF4F81]/40 shadow-glow-pink my-3"
            >
              <Heart className="w-8 h-8 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
            </motion.div>

            {/* Let's Celebrate Button */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              onClick={handleCelebrateClick}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(255, 79, 129, 0.8)',
                boxShadow: '0 0 30px rgba(255, 79, 129, 0.5)',
                backgroundColor: 'rgba(255, 79, 129, 0.15)',
              }}
              whileTap={{ scale: 0.97 }}
              aria-label="Proceed to birthday celebration"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-[#FF4F81]/50 bg-[#E63946] text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] shadow-glow-red focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer mt-4"
            >
              <span>LET'S CELEBRATE</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </section>
  );
};
