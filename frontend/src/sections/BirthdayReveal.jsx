import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { StarField } from '../components/StarField';
import { Candle } from '../components/Candle';
import { BirthdayCake } from '../components/BirthdayCake';
import { CelebrationEffects } from '../components/CelebrationEffects';
import { birthdayData } from '../data/birthdayData';
import { textFadeUp } from '../animations/variants';

export const BirthdayReveal = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState('intro');
  const { title, name, message, finalText1, finalText2 } = birthdayData.birthdayReveal;

  // Auto-transition from intro to candle after 3s
  useEffect(() => {
    if (stage === 'intro') {
      const timer = setTimeout(() => setStage('candle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Blowing -> reveal transition (~2s)
  useEffect(() => {
    if (stage === 'blowing') {
      const timer = setTimeout(() => setStage('reveal'), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Reveal -> cake transition (~3s)
  useEffect(() => {
    if (stage === 'reveal') {
      const timer = setTimeout(() => setStage('cake'), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Cake -> celebration transition (~2.5s)
  useEffect(() => {
    if (stage === 'cake') {
      const timer = setTimeout(() => setStage('celebration'), 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Celebration -> complete transition (~5s)
  useEffect(() => {
    if (stage === 'celebration') {
      const timer = setTimeout(() => setStage('complete'), 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Handle candle blow interaction
  const handleBlow = useCallback(() => {
    if (stage === 'candle') {
      setStage('blowing');
    }
  }, [stage]);

  // Navigation handler to /message
  const handleNavigateMessage = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate('/message');
  }, [navigate]);

  // Keyboard accessibility listeners for candle blow & message navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && stage === 'candle') {
        e.preventDefault();
        handleBlow();
      } else if ((e.key === ' ' || e.key === 'Enter') && stage === 'complete') {
        e.preventDefault();
        handleNavigateMessage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, handleBlow, handleNavigateMessage]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 z-10 select-none overflow-hidden bg-[#0B0B0F]">
      {/* Ambient Star Backdrop */}
      <StarField isAccelerated={stage === 'celebration' || stage === 'complete'} />

      {/* Expanding Light on Reveal */}
      <AnimatePresence>
        {(stage === 'reveal' || stage === 'cake' || stage === 'celebration' || stage === 'complete') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.7, scale: 1.2 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial-glow blur-3xl pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Celebration Effects Layer */}
      <CelebrationEffects isActive={stage === 'celebration' || stage === 'complete'} />

      {/* Stage Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center my-auto max-w-xl mx-auto w-full">

        {/* STAGE: intro */}
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-4 h-6 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(to top, #E63946, #FF4F81, #FFF)',
                  boxShadow: '0 0 20px rgba(255,79,129,0.7), 0 0 50px rgba(230,57,70,0.3)',
                }}
              />
              <h1 className="font-serif text-2xl sm:text-4xl text-[#9A9AA5] font-light italic">
                Before we celebrate...
              </h1>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="font-serif text-3xl sm:text-5xl text-white font-normal italic text-glow-white"
              >
                Make a wish.
              </motion.h2>
            </motion.div>
          )}

          {/* STAGE: candle */}
          {stage === 'candle' && (
            <motion.div
              key="candle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-8"
            >
              <Candle stage={stage} onClick={handleBlow} />

              <motion.button
                onClick={handleBlow}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 79, 129, 0.8)',
                  boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
                  backgroundColor: 'rgba(255, 79, 129, 0.12)',
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="Blow out the candle"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/25 bg-[#0B0B0F]/80 text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F81]" />
                <span>BLOW OUT THE CANDLE ✦</span>
              </motion.button>
            </motion.div>
          )}

          {/* STAGE: blowing */}
          {stage === 'blowing' && (
            <motion.div
              key="blowing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Candle stage={stage} onClick={() => {}} />
            </motion.div>
          )}

          {/* STAGE: reveal */}
          {stage === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-serif text-4xl sm:text-7xl font-normal text-white tracking-tight text-glow-white"
              >
                {title}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 1 }}
                className="font-serif text-5xl sm:text-8xl italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4F81] to-[#E63946] text-glow-pink"
              >
                {name} ❤️
              </motion.h2>
            </motion.div>
          )}

          {/* STAGE: cake */}
          {stage === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight text-glow-white">
                {title}
              </h1>
              <h2 className="font-serif text-4xl sm:text-6xl italic font-light text-[#FF4F81] text-glow-pink mb-4">
                {name} ❤️
              </h2>
              <BirthdayCake />
            </motion.div>
          )}

          {/* STAGE: celebration */}
          {stage === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight text-glow-white">
                {title}
              </h1>
              <h2 className="font-serif text-4xl sm:text-6xl italic font-light text-[#FF4F81] text-glow-pink mb-4">
                {name} ❤️
              </h2>
              <BirthdayCake />
            </motion.div>
          )}

          {/* STAGE: complete */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial="hidden"
              animate="visible"
              variants={textFadeUp}
              className="flex flex-col items-center gap-5 text-center pointer-events-auto relative z-30"
            >
              {/* Personal Birthday Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="font-serif italic text-2xl sm:text-4xl text-white font-normal leading-relaxed text-glow-white max-w-lg"
              >
                "{message}"
              </motion.p>

              {/* Glowing Heart */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="p-3 rounded-full bg-white/5 border border-[#FF4F81]/40 shadow-glow-pink my-3"
              >
                <Heart className="w-7 h-7 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
              </motion.div>

              {/* Final Reveal Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="font-serif italic text-xl sm:text-2xl text-[#9A9AA5] font-light"
              >
                "{finalText1}"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
                className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider"
              >
                {finalText2}
              </motion.p>

              {/* Leave A Message Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3 }}
                onClick={handleNavigateMessage}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigateMessage(e);
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 79, 129, 0.8)',
                  boxShadow: '0 0 30px rgba(255, 79, 129, 0.5)',
                  backgroundColor: 'rgba(255, 79, 129, 0.15)',
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="Leave a message"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-[#FF4F81]/50 bg-[#E63946] text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] shadow-glow-red focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer mt-4 relative z-30 pointer-events-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>LEAVE A MESSAGE 💌</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
