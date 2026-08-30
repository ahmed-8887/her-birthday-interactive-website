import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export const CelebrationEffects = ({ isActive }) => {
  // Generate celebration particles
  const confetti = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: -10,
      endY: 110 + Math.random() * 20,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 720 - 360,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
      color: i % 3 === 0 ? '#E63946' : i % 3 === 1 ? '#FF4F81' : '#FFFFFF',
      type: i % 4 === 0 ? 'heart' : i % 4 === 1 ? 'sparkle' : 'confetti',
    }));
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {confetti.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%` }}
          initial={{ y: `${p.startY}vh`, opacity: 0, rotate: 0 }}
          animate={{
            y: `${p.endY}vh`,
            opacity: [0, 1, 1, 0.5, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
            repeat: 1,
            repeatDelay: Math.random() * 2,
          }}
        >
          {p.type === 'heart' ? (
            <Heart
              className="fill-current"
              style={{ color: p.color, width: p.size + 4, height: p.size + 4 }}
            />
          ) : p.type === 'sparkle' ? (
            <Sparkles
              style={{ color: p.color, width: p.size + 2, height: p.size + 2 }}
            />
          ) : (
            <div
              className="rounded-sm"
              style={{
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}60`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};
