import React from 'react';
import { motion } from 'framer-motion';
import { birthdayData } from '../data/birthdayData';

export const RevealMessage = () => {
  const { giftText1, giftText2 } = birthdayData.messages;

  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-lg mx-auto">
      {/* First Message Line */}
      <motion.p
        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-2xl sm:text-4xl font-normal italic text-white leading-relaxed text-glow-white"
      >
        "{giftText1}"
      </motion.p>

      {/* Second Message Line */}
      <motion.p
        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-xl sm:text-3xl font-light italic text-[#FF4F81] text-glow-pink"
      >
        "{giftText2}"
      </motion.p>
    </div>
  );
};
