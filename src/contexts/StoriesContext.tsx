import React, { createContext, useContext, useState } from 'react';
import { Story } from '../types/Story';

interface StoriesContextType {
  stories: { data: Story[]; timestamp: number } | null;
  setStories: React.Dispatch<React.SetStateAction<{ data: Story[]; timestamp: number } | null>>;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const StoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<{ data: Story[]; timestamp: number } | null>(null);

  return (
    <StoriesContext.Provider value={{ stories, setStories }}>
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
