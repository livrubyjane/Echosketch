import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import axios from 'axios'
import CreationHub from './components/CreationHub'
import StoryboardCanvas from './components/StoryboardCanvas'
import GhostPreloader from './components/GhostPreloader'

// Localhost Backend URL
const API_URL = 'http://localhost:8000';

function App() {
  const [view, setView] = useState('hub'); // 'hub' | 'storyboard'
  const [currentStory, setCurrentStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  const handleGenerateStory = async ({ text, genre, artStyle }) => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/generate-story-arc`, {
        text,
        genre,
        art_style: artStyle
      });
      setCurrentStory({
        story_id: response.data.story_id,
        genre,
        art_style: artStyle,
        panels: response.data.panels
      });
      setView('storyboard');
    } catch (error) {
      console.error("Failed to generate story:", error);
      const errorMsg = error.response?.data?.detail || "Magic interrupted! Please ensure the backend is running on localhost:8000.";
      alert(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueStory = async () => {
    if (!currentStory) return;
    setIsContinuing(true);
    try {
      const response = await axios.post(`${API_URL}/continue-story`, {
        story_id: currentStory.story_id,
        genre: currentStory.genre,
        art_style: currentStory.art_style,
        previous_panels: currentStory.panels
      });
      
      setCurrentStory(prev => ({
        ...prev,
        panels: [...prev.panels, ...response.data.panels]
      }));
    } catch (error) {
      console.error("Failed to continue story:", error);
      const errorMsg = error.response?.data?.detail || "The next chapter is lost in the void! Check the backend.";
      alert(errorMsg);
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <GhostPreloader>
      <div className="min-h-screen text-white font-sans selection:bg-purple-500/30">
        <AnimatePresence mode="wait">
          {view === 'hub' ? (
            <CreationHub 
              key="hub-view" 
              onGenerate={handleGenerateStory} 
            />
          ) : (
            <StoryboardCanvas 
              key="storyboard-view" 
              story={currentStory} 
              onContinue={handleContinueStory}
              isContinuing={isContinuing}
            />
          )}
        </AnimatePresence>
      </div>
    </GhostPreloader>
  )
}

export default App
