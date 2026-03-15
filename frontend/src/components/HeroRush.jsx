import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A diverse pool of action, fantasy, and sci-fi characters/scenes
const HERO_POOL = [
  'https://images.unsplash.com/photo-1542382257-80fbefc25237?q=80&w=400&h=400&fit=crop', // Action hero silhouette
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&h=400&fit=crop', // Mage in forest
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&h=400&fit=crop', // Castle dragon vibe
  'https://images.unsplash.com/photo-1621478374422-b2584ebbcfe9?q=80&w=400&h=400&fit=crop', // Anime sword
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=400&h=400&fit=crop', // Comic neon
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=400&fit=crop', // Space planet
  'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=400&h=400&fit=crop', // Stormtroopers
  'https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=400&h=400&fit=crop', // Wizard hat
  'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=400&h=400&fit=crop', // Fantasy village
  'https://images.unsplash.com/photo-1517436073-3b1b1509f122?q=80&w=400&h=400&fit=crop', // Golden light hero
  'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&h=400&fit=crop', // Batman-esque
  'https://images.unsplash.com/photo-1579762715111-a6f1604085f1?q=80&w=400&h=400&fit=crop', // Watercolor fairy
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&h=400&fit=crop', // Snowy mountain explorer
  'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=400&h=400&fit=crop', // Crystal cave
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=400&fit=crop', // Romance silhouettes
  'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=400&h=400&fit=crop', // Funny cartoon pug
  'https://images.unsplash.com/photo-1533158307587-828f0a76cf46?q=80&w=400&h=400&fit=crop', // Night cityscape
  'https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=400&h=400&fit=crop', // Floating island
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=400&fit=crop', // Cyberspace
  'https://images.unsplash.com/photo-1616091427210-9b6348efc6ee?q=80&w=400&h=400&fit=crop', // Pixar room
];

const HeroRush = ({ onComplete }) => {
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    // Check if we've already played this session
    const hasPlayed = sessionStorage.getItem('heroRushPlayed');
    if (hasPlayed) {
      onComplete(); // Skip immediately
      return;
    }

    // Sequence timing
    const flashTimer = setTimeout(() => setShowFlash(true), 2100);
    const endTimer = setTimeout(() => {
      sessionStorage.setItem('heroRushPlayed', 'true');
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  // Framer Motion parent/child variants for staggered rushing
  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Very fast rapid firing
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 3,
      x: () => (Math.random() > 0.5 ? 800 : -800), // Start way offscreen
      y: () => (Math.random() > 0.5 ? 400 : -400),
      rotate: () => Math.random() * 90 - 45,
      filter: 'blur(10px)',
    },
    show: {
      opacity: [0, 1, 1, 0], // Quick flash in and out
      scale: [3, 1.1, 1, 0.5], // Rush towards camera, then shrink out
      x: [null, 0, 0, () => (Math.random() > 0.5 ? -800 : 800)], // Rush to center, then fly away
      y: [null, 0, 0, () => (Math.random() > 0.5 ? -400 : 400)],
      rotate: [null, () => Math.random() * 10 - 5, () => Math.random() * 10 - 5, () => Math.random() * 90 - 45],
      filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.3, 0.7, 1]
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[100] flex items-center justify-center overflow-hidden">
      
      {/* Spider-Verse comic halftone overlay in background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%), radial-gradient(rgba(255,255,255,0.15) 20%, transparent 20%)', backgroundSize: '100% 100%, 4px 4px' }} />

      {/* Rushing Heroes */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {HERO_POOL.map((imgUrl, idx) => {
          // Calculate random z-index and scale adjustments to simulate depth
          const depthScale = Math.random() * 0.8 + 0.6; // 0.6 to 1.4
          const zInd = Math.floor(depthScale * 10);
          
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="absolute w-48 h-64 md:w-80 md:h-96 border-[6px] border-black bg-white shadow-[12px_12px_0px_#111] overflow-hidden will-change-transform"
              style={{ zIndex: zInd, transformOrigin: 'center' }}
            >
              <img src={imgUrl} className="w-full h-full object-cover filter saturate-[1.5] contrast-[1.2]" alt={`Hero ${idx}`} />
              {/* Comic dot overlay acting as halftone shading */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* The Central Flash Bang (White-Out/Gold Flash to transition) */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="absolute inset-0 flex items-center justify-center z-[200] pointer-events-none mix-blend-screen"
            style={{ 
              background: 'radial-gradient(circle, rgba(253,224,71,1) 0%, rgba(255,255,255,1) 30%, transparent 70%)' 
            }}
          />
        )}
      </AnimatePresence>
      
      {/* White overlay fallback for the absolute end of sequence */}
      <AnimatePresence>
        {showFlash && (
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute inset-0 bg-white z-[201] pointer-events-none"
           />
        )}
      </AnimatePresence>

    </div>
  );
};

export default HeroRush;
