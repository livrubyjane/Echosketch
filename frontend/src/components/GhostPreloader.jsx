import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GhostPreloader = ({ children }) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [scrambleText, setScrambleText] = useState('00000000');
  const [scrambleLocked, setScrambleLocked] = useState(false);
  const [beginReveal, setBeginReveal] = useState(false);
  const [flash, setFlash] = useState(false);

  const images = [
    '/assets/intro/ghost1.png',
    '/assets/intro/ghost2.png',
    '/assets/intro/ghost3.png',
    '/assets/intro/ghost4.png',
    '/assets/intro/ghost5.png',
  ];

  // 1. Check if already played
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('ghostPreloaderPlayed');
    if (hasPlayed) {
      setIsFinished(true);
    }
  }, []);

  // 2. Pre-warm Strategy: Load all images first
  useEffect(() => {
    if (isFinished) return;
    let loaded = 0;
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === images.length) {
          setImagesLoaded(loaded);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === images.length) {
          setImagesLoaded(loaded);
        }
      };
    });
  }, [isFinished]);

  // 3. Start Animation once safely loaded
  useEffect(() => {
    if (imagesLoaded === images.length && !startAnimation && !isFinished) {
      // Very slight delay for smooth entry
      setTimeout(() => setStartAnimation(true), 200);
    }
  }, [imagesLoaded, startAnimation, isFinished]);

  // 4. Marvel Cinematic Flipbook (Cycle & Shutter)
  useEffect(() => {
    if (!startAnimation || beginReveal || isFinished) return;

    let cycleTimer;
    let flashTimer;

    const cycle = () => {
      setFlash(true);
      
      flashTimer = setTimeout(() => {
        setFlash(false);
      }, 40);

      cycleTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        cycle();
      }, 80);
    };

    cycle();

    return () => {
      clearTimeout(cycleTimer);
      clearTimeout(flashTimer);
    };
  }, [startAnimation, beginReveal, isFinished, images.length]);

  // 5. Sci-Fi Number Scrambler
  useEffect(() => {
    if (!startAnimation || isFinished) return;

    const chars = '0123456789X';
    const scrambleInterval = setInterval(() => {
      let randomStr = '';
      for (let i = 0; i < 8; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setScrambleText(randomStr);
    }, 50);

    const lockTimer = setTimeout(() => {
      clearInterval(scrambleInterval);
      setScrambleLocked(true);
      setScrambleText('VERIFIED');
      setBeginReveal(true);
    }, 1500);

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(lockTimer);
    };
  }, [startAnimation, isFinished]);

  // 6. Camera Fly-Through / Zoom Reveal End
  useEffect(() => {
    if (beginReveal && !isFinished) {
      const finishTimer = setTimeout(() => {
        setIsFinished(true);
        sessionStorage.setItem('ghostPreloaderPlayed', 'true');
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [beginReveal, isFinished]);

  // Ensure children render instantly if finished
  if (isFinished) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
        
        {/* Render ALL 5 images immediately at opacity: 0 via Framer Motion */}
        {images.map((src, index) => {
          const isActive = index === currentIndex;
          const isThird = index % 3 === 0;
          
          return (
            <motion.img
              key={src}
              src={src}
              className={`absolute inset-0 w-full h-full object-cover transition-none will-change-transform ${isActive && isThird && !beginReveal ? "skew-x-12" : ""}`}
              initial={{ opacity: 0, scale: 1, zIndex: 0 }}
              animate={
                beginReveal
                  ? {
                      scale: isActive ? [1, 15] : 1,
                      opacity: isActive ? [1, 0] : 0,
                      zIndex: isActive ? 10 : 0,
                    }
                  : {
                      scale: isActive && isThird ? 1.1 : 1,
                      opacity: isActive ? 1 : 0,
                      zIndex: isActive ? 10 : 0,
                    }
              }
              transition={
                beginReveal
                  ? { duration: 0.8, ease: "easeIn" }
                  : { duration: 0 } // Snap instantly for the rapid cycle
              }
            />
          );
        })}

        {/* White Flash Component (Projector Shutter effect) */}
        <div 
          className="absolute inset-0 bg-white pointer-events-none z-[20] will-change-opacity"
          style={{ 
            opacity: flash && !beginReveal ? 0.9 : 0,
            transition: 'opacity 10ms linear'
          }}
        />

        {/* Sci-Fi Number Shuffle Centerpiece */}
        <motion.div 
          className="relative z-[30] flex flex-col items-center justify-center pointer-events-none"
          animate={{
             opacity: beginReveal ? 0 : 1,
             scale: beginReveal ? 2.5 : 1
          }}
          transition={{ duration: 0.8, ease: "easeIn" }}
        >
          <h1 
             className="text-white font-mono text-5xl md:text-8xl font-black tracking-[0.2em] whitespace-nowrap"
             style={{ textShadow: "0 0 20px rgba(0,0,0,0.8), 2px 2px 0 #000" }}
          >
            {scrambleText}
          </h1>
        </motion.div>
      </div>

      {/* Hidden children to preload assets of main app without jump */}
      <div className="hidden">{children}</div>
    </>
  );
};

export default GhostPreloader;
