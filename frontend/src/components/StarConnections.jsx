import React from 'react';
import { motion } from 'framer-motion';

export const StarConnections = ({ stars, connectedIndices, isHeartComplete }) => {
  // Build line segments between consecutive connected star indices
  const lineSegments = [];

  for (let i = 0; i < connectedIndices.length - 1; i++) {
    const fromIndex = connectedIndices[i];
    const toIndex = connectedIndices[i + 1];
    const fromStar = stars[fromIndex];
    const toStar = stars[toIndex];

    if (fromStar && toStar) {
      lineSegments.push({
        id: `line-${fromIndex}-${toIndex}`,
        x1: `${fromStar.x}%`,
        y1: `${fromStar.y}%`,
        x2: `${toStar.x}%`,
        y2: `${toStar.y}%`,
      });
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <defs>
        <filter id="pink-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lineSegments.map((segment, idx) => (
        <motion.line
          key={segment.id}
          x1={segment.x1}
          y1={segment.y1}
          x2={segment.x2}
          y2={segment.y2}
          stroke="#FF4F81"
          strokeWidth={isHeartComplete ? "2.5" : "1.8"}
          strokeDasharray={isHeartComplete ? "none" : "4 4"}
          filter="url(#pink-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: isHeartComplete ? 0.95 : 0.75 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
};
