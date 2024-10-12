import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Story } from '../types/Story'
import { config } from '../config';

type StoriesState = {
  stories: Story[];
  loading: boolean;
  error: string | null;
};

type StoriesAction =
  | { type: 'FETCH_STORIES_START' }
  | { type: 'FETCH_STORIES_SUCCESS'; payload: Story[] }
  | { type: 'FETCH_STORIES_FAILURE'; payload: string };

const initialState: StoriesState = {
  stories: [],
  loading: true,
  error: null,
};

const storiesReducer = (state: StoriesState, action: StoriesAction): StoriesState => {
  switch (action.type) {
    case 'FETCH_STORIES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_STORIES_SUCCESS':
      return { ...state, loading: false, stories: action.payload };
    case 'FETCH_STORIES_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const StoriesContext = createContext<{
  state: StoriesState;
  dispatch: React.Dispatch<StoriesAction>;
} | undefined>(undefined);

export const StoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storiesReducer, initialState);

  useEffect(() => {
    const fetchStories = async () => {
      dispatch({ type: 'FETCH_STORIES_START' });
      try {
        const response = await fetch(`${config.apiBaseUrl}/stories`);
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const data = await response.json();
        dispatch({ type: 'FETCH_STORIES_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_STORIES_FAILURE', payload: 'Error fetching stories. Please try again later.' });
      }
    };

    fetchStories();
  }, []);

  return <StoriesContext.Provider value={{ state, dispatch }}>{children}</StoriesContext.Provider>;
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};

