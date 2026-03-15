import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, PauseCircle, ChevronRight, Wand2, Paintbrush } from 'lucide-react';

const ParticleOverlay = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-50">
      {particles.map(p => (
        <div 
          key={p.id} className="particle bg-white"
          style={{
            left: `${p.x}vw`, bottom: `-10vh`, width: `${p.size}px`, height: `${p.size}px`,
            animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px rgba(255,255,255,0.8)`
          }}
        />
      ))}
    </div>
  );
};

const StoryboardCanvas = ({ story, onContinue, isContinuing }) => {
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const timelineRef = useRef(null);

  const activePanel = story.panels[activePanelIndex];

  useEffect(() => {
    if (timelineRef.current) {
      const activeThumb = timelineRef.current.children[activePanelIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activePanelIndex]);

  useEffect(() => {
    if (activePanel?.audio_url) {
      audioRef.current = new Audio(activePanel.audio_url);
      audioRef.current.onended = () => setIsPlaying(false);
      if (isPlaying) audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activePanelIndex, activePanel?.audio_url, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(e => console.error("Audio playback failed", e));
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (activePanelIndex < story.panels.length - 1) setActivePanelIndex(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0f172a] text-slate-900 border-[16px] border-black">
      
      {/* MAGNIFICENT ILLUSTRATED STORYBOOK BACKGROUND */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          // Illustrated comic background
          backgroundImage: 'url("https://images.unsplash.com/photo-1542382257-80fbefc25237?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.1) saturate(1.2)',
        }}
      />
      {/* Soft color wash to make UI pop */}
      <div className="fixed inset-0 bg-blue-100/60 pointer-events-none z-0" />
      
      {/* Spider-Verse Halftone Texture Overlay */}
      <div className="comic-texture" />
      <ParticleOverlay />

      {/* Comic Header Bar */}
      <header className="relative z-20 flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-white border-b-[8px] border-black shadow-[0_8px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-display font-bold text-black uppercase tracking-wider drop-shadow-sm flex items-center gap-3" style={{ textShadow: '2px 2px 0px #fca5a5' }}>
            <Paintbrush size={32} strokeWidth={3} />
            Storyboard Review
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-black uppercase tracking-[0.2em] bg-yellow-300 border-[4px] border-black px-6 py-2 shadow-[4px_4px_0px_#111] mt-4 md:mt-0 transform rotate-[1deg]">
          <span>{story.genre}</span>
          <span className="opacity-50">•</span>
          <span>{story.art_style}</span>
        </div>
      </header>

      {/* Main Canvas Viewport */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 lg:p-12 relative z-10 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {activePanel && (
            <motion.div
              key={activePanel.panel_number}
              initial={{ scale: 0.8, y: 100, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -100, rotate: 3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full flex justify-center py-8"
            >
              {/* LOUD Comic Frame Wrapper */}
              <div className="bg-white w-full max-w-5xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center border-[6px] border-[#111] shadow-[16px_16px_0px_rgba(0,0,0,1)] relative z-10 transition-transform duration-500 hover:scale-[1.01]">
                
                {/* Scene Label (Speech bubble style) */}
                <div className="absolute -top-6 -left-6 bg-blue-400 text-black border-4 border-black px-6 py-2 font-display font-bold text-xl shadow-[6px_6px_0px_#111] rotate-[-4deg] z-20 uppercase tracking-widest">
                  Act {activePanel.panel_number}
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 relative bg-black p-2 border-4 border-[#111] shadow-inner aspect-square">
                  <img 
                    src={activePanel.image_url} 
                    alt={activePanel.caption} 
                    className="w-full h-full object-cover filter saturate-110 contrast-110"
                  />
                  {/* Comic panel halftone overlay on image */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
                </div>

                {/* Bold Script Notes */}
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 relative">
                  <div>
                    <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-2 font-display">
                      Director's Cut
                    </h3>
                    <h2 className="text-5xl md:text-6xl font-display font-bold text-black leading-none uppercase" style={{ textShadow: '3px 3px 0px #93c5fd' }}>
                      {activePanel.caption}
                    </h2>
                  </div>
                  
                  {/* Speech Bubble Narration */}
                  <div className="bg-yellow-50 border-4 border-[#111] p-6 relative shadow-[8px_8px_0px_#111]">
                    {/* Tail of speech bubble */}
                    <div className="absolute -left-5 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-r-[20px] border-r-yellow-50 border-b-[10px] border-b-transparent z-10"></div>
                    <div className="absolute -left-7 top-7 w-0 h-0 border-t-[14px] border-t-transparent border-r-[26px] border-r-[#111] border-b-[14px] border-b-transparent z-0"></div>
                    
                    <p className="text-2xl text-black leading-relaxed font-display tracking-wide relative z-10">
                      "{activePanel.narration}"
                    </p>
                  </div>
                  
                  {activePanel.audio_url && (
                    <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                      <button 
                        onClick={togglePlay}
                        className={`comic-btn px-8 py-4 rounded font-bold text-2xl flex items-center gap-3 w-full md:w-auto justify-center uppercase tracking-widest ${isPlaying ? 'bg-orange-300' : 'bg-[#a78bfa]'}`}
                      >
                        {isPlaying ? <PauseCircle size={28} strokeWidth={3} /> : <PlayCircle size={28} strokeWidth={3} />}
                        {isPlaying ? 'Pause' : 'Play Audio'}
                      </button>
                      
                      <div className="text-slate-500 font-display text-xl font-bold uppercase hidden md:block border-b-4 border-slate-300 pb-1">
                        Panel {activePanelIndex + 1} / {story.panels.length}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Horizontal Timeline Panel (Comic Strip Style) */}
      <footer className="relative z-20 bg-white border-t-[8px] border-black shadow-[0_-8px_0px_rgba(0,0,0,1)] pb-8 pt-6 px-6 mt-auto">
        <h3 className="text-2xl font-bold text-black uppercase tracking-widest mb-6 font-display ml-2 md:ml-8 max-w-7xl mx-auto flex items-center gap-4">
          <span className="bg-green-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_#111] rotate-[-2deg]">Storyboard Timeline</span>
        </h3>
        
        <div className="max-w-7xl mx-auto flex items-end gap-6 overflow-visible py-4">
          <div className="flex-1 overflow-x-auto pb-4 pt-8 px-4 custom-scrollbar" ref={timelineRef}>
            <div className="flex items-end gap-6 min-w-max h-[200px] mb-4">
              {story.panels.map((panel, idx) => (
                <button
                  key={`thumb-${panel.panel_number}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setActivePanelIndex(idx);
                  }}
                  className={`relative shrink-0 transition-all duration-300 outline-none border-4 bg-white p-1 origin-bottom ${activePanelIndex === idx ? 'border-[#111] scale-[1.2] shadow-[8px_8px_0px_#111] z-20' : 'border-[#111] opacity-80 hover:opacity-100 hover:scale-[1.1] hover:shadow-[4px_4px_0px_#111]'} w-28 h-28 md:w-40 md:h-40 group`}
                >
                  <img src={panel.image_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300 border-2 border-black" alt="thumbnail" />
                  <div className="absolute -bottom-4 right-[-10px] bg-red-400 border-2 border-black px-3 font-display font-bold text-xl text-black shadow-[2px_2px_0px_#111] rotate-[10deg]">
                    #{panel.panel_number}
                  </div>
                </button>
              ))}
              
              {/* LOUD Infinite Continuations Button */}
              <button
                onClick={onContinue}
                disabled={isContinuing}
                className="shrink-0 w-28 h-28 md:w-40 md:h-40 ml-4 border-4 border-dashed border-[#111] bg-slate-100 flex flex-col items-center justify-center text-black hover:bg-yellow-200 hover:border-solid hover:shadow-[8px_8px_0px_#111] hover:-translate-y-2 transition-all group disabled:opacity-50"
              >
                {isContinuing ? (
                  <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mb-3"></div>
                ) : (
                  <ChevronRight size={44} strokeWidth={3} className="group-hover:translate-x-3 transition-transform mb-2 text-black" />
                )}
                <span className="text-xl font-bold uppercase tracking-widest font-display">{isContinuing ? 'Drawing...' : 'Next Act'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default StoryboardCanvas;
