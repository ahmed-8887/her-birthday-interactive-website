/**
 * Reusable Framer Motion variants for section transitions, micro-interactions,
 * and text reveals across "Her Birthday".
 */

export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInDelayed = (delay = 0.2) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Opening Experience - Heart Breathing Animation
export const heartBreathing = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.75, 1, 0.75],
    filter: [
      'drop-shadow(0 0 12px rgba(255, 79, 129, 0.4))',
      'drop-shadow(0 0 28px rgba(255, 79, 129, 0.85))',
      'drop-shadow(0 0 12px rgba(255, 79, 129, 0.4))',
    ],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  entered: {
    scale: [1, 1.5, 1.3],
    opacity: 1,
    filter: 'drop-shadow(0 0 50px rgba(255, 79, 129, 1))',
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  },
};

// Opening Experience - Text Reveal Animation
export const textFadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      delay: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(4px)',
    transition: { duration: 0.8, ease: 'easeIn' },
  },
};

// Opening Experience - CTA Button Fade & Glow
export const ctaFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 1.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(6px)',
    transition: { duration: 0.5, ease: 'easeIn' },
  },
};
