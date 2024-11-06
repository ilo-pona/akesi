import React, { createContext, useContext, useState } from 'react';
import { Story } from '../types/Story';

interface CachedStories {
  data: Story[];
  timestamp: number;
}

interface StoriesContextType {
  stories: CachedStories | null;
  setStories: React.Dispatch<React.SetStateAction<CachedStories | null>>;
  instance: string;
}

export const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const StoriesProvider: React.FC<{ children: React.ReactNode; instance: string }> = ({ 
  children, 
  instance 
}) => {
  const [stories, setStories] = useState<CachedStories | null>(null);

  return (
    <StoriesContext.Provider value={{ stories, setStories, instance }}>
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};
