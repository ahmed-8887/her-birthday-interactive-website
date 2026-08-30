import React from 'react';
import { motion } from 'framer-motion';

export const ConstellationLines = ({ stars, discoveredIds, selectedId, centerPos = { x: 50, y: 50 } }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      {stars.map((star) => {
        const isDiscovered = discoveredIds.includes(star.id);
        const isSelected = selectedId === star.id;

        if (!isDiscovered && !isSelected) return null;

        return (
          <g key={`line-group-${star.id}`}>
            {/* Base SVG Connection Line to Heart */}
            <motion.line
              x1={`${star.x}%`}
              y1={`${star.y}%`}
              x2={`${centerPos.x}%`}
              y2={`${centerPos.y}%`}
              stroke={isSelected ? '#FF4F81' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth={isSelected ? '1.5' : '1'}
              strokeDasharray={isSelected ? 'none' : '3 3'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isSelected ? 0.8 : 0.35 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Traveling Energy Pulse Particle */}
            {isSelected && (
              <motion.circle
                r="3"
                fill="#FF4F81"
                initial={{ cx: `${star.x}%`, cy: `${star.y}%` }}
                animate={{ cx: `${centerPos.x}%`, cy: `${centerPos.y}%` }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
