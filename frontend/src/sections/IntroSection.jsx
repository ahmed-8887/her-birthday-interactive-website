import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { heartBreathing, textFadeUp, ctaFadeIn } from '../animations/variants';

export const IntroSection = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  // Generate 24 burst particles for radial explosion effect on click
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * (2 * Math.PI);
      const distance = Math.random() * 120 + 80;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 4 + 2,
        isPink: i % 2 === 0,
      };
    });
  }, []);

  const handleEnterClick = (e) => {
    e.preventDefault();
    if (isClicked) return;

    setIsClicked(true);

    // Trigger router navigation to /stars after particle burst and supernova heart animation (~1.1s)
    setTimeout(() => {
      navigate('/stars');
    }, 1100);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 z-10 select-none overflow-hidden bg-[#0B0B0F]">
      <div className="relative max-w-xl mx-auto flex flex-col items-center justify-center">
        
        {/* Central Glowing Heart Component */}
        <div className="relative mb-8 flex items-center justify-center">
          <motion.div
            variants={heartBreathing}
            initial="initial"
            animate={isClicked ? "entered" : "animate"}
            className="relative z-10 p-3 rounded-full bg-white/[0.03] border border-[#FF4F81]/30 backdrop-blur-sm"
          >
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF4F81] fill-[#FF4F81]" />
          </motion.div>

          {/* Radial Particle Burst Erupting from Central Heart on Click */}
          <AnimatePresence>
            {isClicked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      backgroundColor: p.isPink ? '#FF4F81' : '#FFFFFF',
                      boxShadow: p.isPink
                        ? '0 0 10px rgba(255, 79, 129, 1)'
                        : '0 0 8px rgba(255, 255, 255, 0.9)',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      opacity: [1, 0.8, 0],
                      scale: [1, 1.4, 0.2],
                    }}
                    transition={{
                      duration: 1.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sentence Text Reveal */}
        <motion.div
          variants={textFadeUp}
          initial="hidden"
          animate={isClicked ? "exit" : "visible"}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white italic tracking-wide leading-snug text-glow-white">
            "I made something for you..."
          </h1>
        </motion.div>

        {/* CTA Button */}
        <AnimatePresence>
          {!isClicked && (
            <motion.div
              variants={ctaFadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                onClick={handleEnterClick}
                whileHover={{
                  scale: 1.04,
                  borderColor: 'rgba(255, 79, 129, 0.8)',
                  boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
                  backgroundColor: 'rgba(255, 79, 129, 0.08)',
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="Enter our little world"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full border border-white/25 bg-transparent text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F81] group-hover:rotate-12 transition-transform duration-300" />
                <span>ENTER OUR LITTLE WORLD ✦</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
