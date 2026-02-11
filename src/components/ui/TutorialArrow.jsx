import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialArrow = ({ targetSelector }) => {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!targetSelector) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });
      } else {
        setCoords(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Observer to catch dynamic elements
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer.disconnect();
    };
  }, [targetSelector]);

  if (!coords) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: [0, -15, 0],
          x: coords.x,
          top: coords.y - 60
        }}
        transition={{ 
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
        className="fixed left-0 z-[10000] pointer-events-none -translate-x-1/2"
      >
        <div className="relative">
          {/* Neon Glow */}
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 animate-pulse rounded-full" />
          
          {/* Arrow Body */}
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialArrow;
