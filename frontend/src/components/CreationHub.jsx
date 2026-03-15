import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowRight, Paintbrush } from 'lucide-react';
import HeroRush from './HeroRush';

const GENRES = [
  { id: 'Fantasy', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&h=400&fit=crop', label: 'Fantasy' },
  { id: 'Adventure', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&h=400&fit=crop', label: 'Adventure' },
  { id: 'Sci-Fi', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=400&fit=crop', label: 'Sci-Fi' },
  { id: 'Mystery', image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=400&h=400&fit=crop', label: 'Mystery' },
  { id: 'Romance', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=400&fit=crop', label: 'Romance' },
  { id: 'Comedy', image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=400&h=400&fit=crop', label: 'Comedy' },
];

const STYLES = [
  { id: 'Disney Concept Art', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&h=400&fit=crop', label: 'Disney / Pixar' },
  { id: 'Marvel Comic', image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=400&h=400&fit=crop', label: 'Marvel Comic' },
  { id: 'Studio Ghibli Anime', image: 'https://images.unsplash.com/photo-1542779283-429940ce8336?q=80&w=400&h=400&fit=crop', label: 'Anime / Manga' },
  { id: 'Watercolor Storybook', image: 'https://images.unsplash.com/photo-1580501170888-80668882ca0c?q=80&w=400&h=400&fit=crop', label: 'Watercolor Book' },
  { id: 'Vintage Comic', image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&h=400&fit=crop', label: 'Vintage Comic' },
];

// Floating dust motes to sell the storybook/magical vibe
const ParticleOverlay = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 5,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-60">
      {particles.map(p => (
        <div 
          key={p.id} className="particle bg-orange-200"
          style={{
            left: `${p.x}vw`, bottom: `-10vh`, width: `${p.size}px`, height: `${p.size}px`,
            animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px rgba(251,146,60,0.8)`
          }}
        />
      ))}
    </div>
  );
};

const CreationHub = ({ onGenerate }) => {
  const [introFinished, setIntroFinished] = useState(false);
  const [text, setText] = useState('');
  const [genre, setGenre] = useState('Fantasy');
  const [artStyle, setArtStyle] = useState('Disney Concept Art');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // We let HeroRush handle its own internal timing and session storage logic.
  // We simply wait for it to call onComplete.

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'en-US';

        reco.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          }
          if (finalTranscript) setText(prev => (prev + ' ' + finalTranscript).trim());
        };
        reco.onend = () => setIsListening(false);
        setRecognition(reco);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return alert("Browser does not support Voice Input.");
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setText('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please type or speak a story idea!");
    setIsGenerating(true);
    await onGenerate({ text, genre, artStyle });
    setIsGenerating(false);
  };

  if (!introFinished) {
    return (
      <HeroRush onComplete={() => setIntroFinished(true)} />
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center pt-8 px-4 pb-20 relative text-slate-800 selection:bg-orange-300"
      initial={{ scale: 0.96, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* MAGNIFICENT ILLUSTRATED STORYBOOK BACKGROUND */}
      <div 
        className="fixed inset-0 pointer-events-none z-[-2]"
        style={{
          // Illustrated fantasy town/landscape
          backgroundImage: 'url("https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.1) saturate(1.2)',
        }}
      />
      {/* Soft color wash to make UI pop */}
      <div className="fixed inset-0 bg-orange-100/30 inset-0 pointer-events-none z-[-1]" />
      
      {/* Spider-Verse Halftone Texture Overlay */}
      <div className="comic-texture" />
      <ParticleOverlay />
      
      {/* Title */}
      <div className="text-center z-10 mb-10 relative mt-4">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-white uppercase tracking-widest drop-shadow-md" style={{ textShadow: '4px 4px 0px #ef4444, 8px 8px 0px #111, -2px -2px 0px #111' }}>
          EchoSketch
        </h1>
        <div className="mt-4 bg-white text-slate-800 font-bold font-sans uppercase tracking-[0.2em] px-6 py-2 border-4 border-black inline-block shadow-[6px_6px_0px_#111] rotate-[1deg]">
          The Animation Playground
        </div>
      </div>

      {/* LOUD Input Bar (Comic Speech Bubble Style) */}
      <div className="z-10 w-full max-w-4xl bg-white p-4 rounded-full flex items-center gap-4 border-4 border-[#111] mb-12 shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
        <button
          onClick={toggleListening}
          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all border-4 border-[#111] ${isListening ? 'bg-red-500 text-white animate-pulse shadow-inner' : 'bg-orange-400 text-white hover:bg-orange-500 hover:scale-105 shadow-[4px_4px_0px_#111]'}`}
        >
          <Mic size={28} />
        </button>
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Speak your story... (e.g. A brave dog saving the galaxy!)"
          className="flex-grow bg-transparent text-2xl font-sans font-bold text-slate-800 placeholder-slate-400 focus:outline-none px-4"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !text.trim()}
          className="flex-shrink-0 comic-btn px-8 py-4 rounded-full font-bold text-xl disabled:opacity-50 flex items-center gap-3 text-slate-900"
        >
          {isGenerating ? <div className="animate-spin w-6 h-6 border-4 border-black border-t-transparent rounded-full" /> : <Paintbrush size={24} />}
          {isGenerating ? 'Drawing...' : 'Create Story'}
        </button>
      </div>

      {/* Main Grids wrapper */}
      <div className="z-10 w-full max-w-7xl space-y-12">
        
        {/* Row 1: Genres */}
        <div className="bg-white p-8 md:p-12 relative border-4 border-[#111] shadow-[12px_12px_0px_#111] transform rotate-[-0.5deg]">
          <h2 className="text-3xl font-bold text-slate-900 font-display mb-8 flex items-center gap-4 uppercase tracking-wider">
            <span className="bg-blue-400 text-black border-4 border-black w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[4px_4px_0px_#111] transform rotate-[-5deg]">1</span>
            Choose a World
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
            {GENRES.map(g => (
              <div 
                key={g.id} onClick={() => setGenre(g.id)}
                className={`loud-card h-48 md:h-56 ${genre === g.id ? 'selected' : ''}`}
              >
                <img src={g.image} alt={g.label} />
                <div className="loud-card-overlay">
                  <span className="text-white font-display text-2xl tracking-wide" style={{ textShadow: '2px 2px 0px #111' }}>{g.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Art Styles */}
        <div className="bg-white p-8 md:p-12 relative border-4 border-[#111] shadow-[12px_12px_0px_#111] transform rotate-[0.5deg]">
          <h2 className="text-3xl font-bold text-slate-900 font-display mb-8 flex items-center gap-4 uppercase tracking-wider">
            <span className="bg-purple-400 text-black border-4 border-black w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[4px_4px_0px_#111] transform rotate-[5deg]">2</span>
            Pick an Art Style
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
            {STYLES.map(s => (
              <div 
                key={s.id} onClick={() => setArtStyle(s.id)}
                className={`loud-card h-56 md:h-64 ${artStyle === s.id ? 'selected' : ''}`}
              >
                <img src={s.image} alt={s.label} />
                <div className="loud-card-overlay">
                  <span className="text-white font-display text-2xl tracking-wider uppercase" style={{ textShadow: '2px 2px 0px #111' }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CreationHub;
