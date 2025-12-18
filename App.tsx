
import React, { useState, useEffect } from 'react';
import { Story, AppState, StoryGenerationConfig } from './types';
import Header from './components/Header';
import Library from './components/Library';
import StoryGenerator from './components/StoryGenerator';
import StoryReader from './components/StoryReader';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.LIBRARY);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('masal-diyari-stories');
    if (saved) {
      setStories(JSON.parse(saved));
    }
  }, []);

  const saveStory = (newStory: Story) => {
    const updated = [newStory, ...stories];
    setStories(updated);
    localStorage.setItem('masal-diyari-stories', JSON.stringify(updated));
  };

  const deleteStory = (id: string) => {
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    localStorage.setItem('masal-diyari-stories', JSON.stringify(updated));
  };

  const handleStartGenerate = () => {
    setCurrentState(AppState.GENERATING);
  };

  const handleStoryCreated = (story: Story) => {
    saveStory(story);
    setActiveStory(story);
    setCurrentState(AppState.READING);
  };

  const handleOpenStory = (story: Story) => {
    setActiveStory(story);
    setCurrentState(AppState.READING);
  };

  const handleBackToLibrary = () => {
    setCurrentState(AppState.LIBRARY);
    setActiveStory(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onHome={handleBackToLibrary} 
        onNew={handleStartGenerate}
        showButtons={currentState !== AppState.GENERATING}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {currentState === AppState.LIBRARY && (
          <Library 
            stories={stories} 
            onOpen={handleOpenStory} 
            onDelete={deleteStory}
            onStartNew={handleStartGenerate}
          />
        )}

        {currentState === AppState.GENERATING && (
          <StoryGenerator 
            onCancel={handleBackToLibrary} 
            onComplete={handleStoryCreated} 
          />
        )}

        {currentState === AppState.READING && activeStory && (
          <StoryReader 
            story={activeStory} 
            onBack={handleBackToLibrary} 
          />
        )}
      </main>

      <footer className="py-4 text-center text-blue-400 text-sm">
        © 2024 Masal Diyarı - Yapay Zeka ile Büyülü Hikayeler
      </footer>
    </div>
  );
};

export default App;
