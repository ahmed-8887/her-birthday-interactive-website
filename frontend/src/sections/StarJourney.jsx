import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { StarField } from '../components/StarField';
import { InteractiveStar } from '../components/InteractiveStar';
import { StarConnections } from '../components/StarConnections';
import { fadeIn, textFadeUp } from '../animations/variants';

// Constellation heart nodes (in percentage coordinate space)
const STAR_NODES = [
  { id: 0, x: 50, y: 70, label: 'Bottom Tip' },
  { id: 1, x: 30, y: 55, label: 'Left Side' },
  { id: 2, x: 32, y: 35, label: 'Left Lobe' },
  { id: 3, x: 50, y: 44, label: 'Center Dip' },
  { id: 4, x: 68, y: 35, label: 'Right Lobe' },
  { id: 5, x: 70, y: 55, label: 'Right Side' },
];

// Deterministic target order index sequence: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0 (closing loop)
const TARGET_SEQUENCE = [0, 1, 2, 3, 4, 5, 0];

export const StarJourney = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [connectedIndices, setConnectedIndices] = useState([]);
  const [isHeartComplete, setIsHeartComplete] = useState(false);

  const activeTargetId = useMemo(() => {
    if (isHeartComplete) return null;
    return TARGET_SEQUENCE[currentStep];
  }, [currentStep, isHeartComplete]);

  const handleStarClick = (starId) => {
    if (isHeartComplete) return;

    // Check if clicked star matches expected sequence target
    if (starId === activeTargetId) {
      const nextConnected = [...connectedIndices, starId];
      setConnectedIndices(nextConnected);

      const nextStep = currentStep + 1;
      if (nextStep >= TARGET_SEQUENCE.length) {
        setIsHeartComplete(true);
      } else {
        setCurrentStep(nextStep);
      }
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/gift');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-6 z-10 select-none overflow-hidden bg-[#0B0B0F]">
      {/* Background Star Particle Canvas */}
      <StarField isAccelerated={isHeartComplete} />

      {/* Header Area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-20 text-center mt-6 max-w-lg mx-auto"
      >
        <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal italic tracking-wide mb-2 text-glow-white">
          Follow the stars...
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider uppercase">
          Click or tap on the glowing star ✦
        </p>
      </motion.div>

      {/* Constellation Canvas Container */}
      <div className="relative w-full max-w-md h-[400px] sm:h-[480px] my-auto flex items-center justify-center">
        {/* Connecting SVG Lines */}
        <StarConnections
          stars={STAR_NODES}
          connectedIndices={connectedIndices}
          isHeartComplete={isHeartComplete}
        />

        {/* Constellation Stars */}
        {STAR_NODES.map((star) => {
          const isTarget = star.id === activeTargetId;
          const isSelected = connectedIndices.includes(star.id);

          return (
            <InteractiveStar
              key={star.id}
              star={star}
              isTarget={isTarget}
              isSelected={isSelected}
              isCompleted={isHeartComplete}
              onClick={handleStarClick}
            />
          );
        })}

        {/* Ambient Pulsing Heart Glow Overlay on Completion */}
        {isHeartComplete && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-[320px] h-[320px] rounded-full bg-gradient-radial-glow opacity-80 blur-3xl" />
          </motion.div>
        )}
      </div>

      {/* Final Reveal Text & Continue Button */}
      <div className="relative z-20 text-center min-h-[140px] flex flex-col items-center justify-center max-w-lg mx-auto mb-6">
        <AnimatePresence>
          {isHeartComplete && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textFadeUp}
              className="flex flex-col items-center gap-3"
            >
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal italic text-glow-pink">
                You found it ❤️
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wide mb-3">
                Maybe you're ready for the next surprise...
              </p>

              {/* Continue Button */}
              <motion.button
                onClick={handleContinue}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 79, 129, 0.8)',
                  boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
                  backgroundColor: 'rgba(255, 79, 129, 0.12)',
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="Continue to secret gift"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#FF4F81]/40 bg-[#0B0B0F]/80 text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 text-[#FF4F81]" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
