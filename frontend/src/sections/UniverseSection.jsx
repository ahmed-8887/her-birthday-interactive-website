import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';
import { StarField } from '../components/StarField';
import { UniverseStar } from '../components/UniverseStar';
import { ConstellationLines } from '../components/ConstellationLines';
import { UniverseMessage } from '../components/UniverseMessage';
import { birthdayData } from '../data/birthdayData';
import { textFadeUp } from '../animations/variants';

export const UniverseSection = () => {
  const [openingStage, setOpeningStage] = useState('dark'); // 'dark' | 'part1' | 'part2' | 'welcome' | 'main'
  const [replayKey, setReplayKey] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const {
    openingTitle1,
    openingTitle2,
    welcomeText,
    allDiscoveredText1,
    allDiscoveredText2,
    finalName,
    finalSubtitle,
    finalMessage,
    signature,
    stars,
  } = birthdayData.universe;

  // Opening sequence timeline (triggers on initial mount & whenever replayKey changes)
  useEffect(() => {
    setOpeningStage('dark');
    const t1 = setTimeout(() => setOpeningStage('part1'), 800);
    const t2 = setTimeout(() => setOpeningStage('part2'), 2800);
    const t3 = setTimeout(() => setOpeningStage('welcome'), 4800);
    const t4 = setTimeout(() => setOpeningStage('main'), 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [replayKey]);

  // Handle star selection
  const handleStarClick = (star) => {
    setSelectedStar(star);
    if (!discoveredIds.includes(star.id)) {
      const nextDiscovered = [...discoveredIds, star.id];
      setDiscoveredIds(nextDiscovered);

      // Check if all stars have been discovered (7/7)
      if (nextDiscovered.length === stars.length) {
        setTimeout(() => {
          setIsCompleted(true);
        }, 1500);
      }
    }
  };

  // Close message modal
  const handleCloseMessage = () => {
    setSelectedStar(null);
    if (isCompleted && !showFinalMessage) {
      setTimeout(() => {
        setShowFinalMessage(true);
      }, 1000);
    }
  };

  // Reset/Replay experience to initial state
  const handleReplay = useCallback(() => {
    setDiscoveredIds([]);
    setSelectedStar(null);
    setIsCompleted(false);
    setShowFinalMessage(false);
    setReplayKey((prev) => prev + 1);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-10 px-6 z-10 select-none overflow-hidden bg-[#0B0B0F]">
      {/* Background Star Canvas */}
      <StarField isAccelerated={showFinalMessage} />

      {/* Top Subtle Replay Control */}
      {openingStage === 'main' && (
        <div className="absolute top-6 right-6 z-30 flex items-center gap-4">
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#9A9AA5]">
            {discoveredIds.length} / {stars.length} DISCOVERED
          </span>
          <button
            onClick={handleReplay}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReplay();
              }
            }}
            aria-label="Replay the universe experience"
            title="Replay the universe experience"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-[#9A9AA5] hover:text-white hover:border-white/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Opening Intro Text Timeline */}
      {openingStage !== 'main' && (
        <div className="my-auto flex flex-col items-center text-center max-w-lg mx-auto z-20">
          <AnimatePresence mode="wait">
            {(openingStage === 'part1' || openingStage === 'part2') && (
              <motion.div
                key={`part1-2-${replayKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <h1 className="font-serif text-3xl sm:text-5xl text-[#9A9AA5] font-light italic">
                  {openingTitle1}
                </h1>
                {openingStage === 'part2' && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-serif text-4xl sm:text-6xl text-white font-normal italic text-glow-white"
                  >
                    {openingTitle2}
                  </motion.h2>
                )}
              </motion.div>
            )}

            {openingStage === 'welcome' && (
              <motion.div
                key={`welcome-${replayKey}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1 }}
              >
                <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal italic tracking-tight text-glow-pink">
                  {welcomeText}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Interactive Constellation Canvas */}
      {openingStage === 'main' && !showFinalMessage && (
        <div className="relative w-full max-w-4xl h-[75vh] my-auto flex items-center justify-center z-20">
          {/* Central Glowing Heart */}
          <motion.div
            className="relative flex flex-col items-center justify-center z-10"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute w-36 h-36 rounded-full bg-gradient-radial-glow blur-2xl pointer-events-none opacity-80" />
            <div className="p-4 rounded-full bg-white/5 border border-[#FF4F81]/40 shadow-glow-pink">
              <Heart className="w-8 h-8 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
            </div>
          </motion.div>

          {/* SVG Connection Lines */}
          <ConstellationLines
            stars={stars}
            discoveredIds={discoveredIds}
            selectedId={selectedStar?.id}
          />

          {/* Interactive Constellation Stars */}
          {stars.map((star) => (
            <UniverseStar
              key={star.id}
              star={star}
              isDiscovered={discoveredIds.includes(star.id)}
              isSelected={selectedStar?.id === star.id}
              onClick={handleStarClick}
            />
          ))}

          {/* Floating Message Card */}
          <UniverseMessage star={selectedStar} onClose={handleCloseMessage} />
        </div>
      )}

      {/* Final Completion Climax Reveal */}
      {showFinalMessage && (
        <div className="my-auto flex flex-col items-center text-center max-w-lg mx-auto z-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textFadeUp}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-serif italic text-xl sm:text-3xl text-[#9A9AA5] font-light">
              "{allDiscoveredText1}"
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider uppercase">
              {allDiscoveredText2}
            </p>

            {/* Glowing Central Heart */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.25, 1] }}
              transition={{ duration: 1, delay: 0.8 }}
              className="p-4 rounded-full bg-white/10 border border-[#FF4F81]/60 shadow-glow-pink my-3"
            >
              <Heart className="w-10 h-10 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
            </motion.div>

            {/* Her Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="font-serif text-5xl sm:text-7xl text-white font-normal text-glow-white tracking-tight"
            >
              {finalName}
            </motion.h1>

            {/* You Are Loved */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.2 }}
              className="font-serif text-3xl sm:text-5xl italic font-light text-[#FF4F81] text-glow-pink"
            >
              {finalSubtitle}
            </motion.h2>

            {/* Final Personal Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
              className="font-sans text-sm sm:text-base text-white/90 font-light max-w-md leading-relaxed mt-2"
            >
              "{finalMessage}"
            </motion.p>

            {/* Final Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.8 }}
              className="mt-8 pt-6 border-t border-white/10 w-full flex flex-col items-center gap-1"
            >
              <span className="font-serif italic text-base text-[#9A9AA5]">
                {signature}
              </span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
