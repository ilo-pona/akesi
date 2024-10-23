import React, { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import { EnhancedText } from "../components/EnhancedText";
import { useSettings } from "../contexts/SettingsContext";
import { Story } from "../types/Story";
import { config } from "../config";
import { useLocation } from "react-router-dom";
import { useStories } from "../contexts/StoriesContext";

const STORIES_PER_PAGE = 4;
const PAGES_TO_FETCH = 2;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasOlderStories, setHasOlderStories] = useState(true);
  const [hasNewerStories, setHasNewerStories] = useState(false);
  const { stories: cachedStories, setStories: setCachedStories } = useStories();
  const location = useLocation();

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (location.pathname === "/newest") {
      setCurrentPage(1);
    }
  }, [location]);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * STORIES_PER_PAGE;
      const limit = STORIES_PER_PAGE * PAGES_TO_FETCH;
      const response = await fetch(
        `${config.apiBaseUrl}/stories?skip=${skip}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const data = await response.json();

      // Process image URLs using the configurable image prefix
      const processedData = data.map((story: Story) => ({
        ...story,
        imageUrl: story.imageUrl.startsWith("http")
          ? story.imageUrl
          : `${config.imagePrefix}${story.imageUrl}`,
      }));

      setStories(prevStories => {
        const newStories = [...prevStories, ...processedData];
        const uniqueStories = Array.from(new Set(newStories.map(s => s.id)))
          .map(id => newStories.find(s => s.id === id)!);
        return uniqueStories;
      });
      
      setCachedStories(prevCachedStories => {
        const newData = prevCachedStories ? [...prevCachedStories.data, ...processedData] : processedData;
        const uniqueData = Array.from(new Set(newData.map(s => s.id)))
          .map(id => newData.find(s => s.id === id)!);
        return { data: uniqueData, timestamp: Date.now() };
      });

      const newHasOlderStories = data.length === STORIES_PER_PAGE * PAGES_TO_FETCH;
      const newHasNewerStories = currentPage > 1;
      setHasOlderStories(newHasOlderStories);
      setHasNewerStories(newHasNewerStories);
      setLoading(false);
      
    } catch (err) {
      setError("Error fetching stories. Please try again later.");
      setLoading(false);
    }
  }, [currentPage, setCachedStories]);

  useEffect(() => {
    const currentTime = Date.now();
    const shouldFetchNewStories = !cachedStories ||
      cachedStories.data.length === 0 ||
      currentTime - cachedStories.timestamp >= CACHE_DURATION;
      //  ||
      // cachedStories.data.length < currentPage * STORIES_PER_PAGE;

    if (shouldFetchNewStories) {
      fetchStories();
    } else {
      setStories(cachedStories.data);
      setHasOlderStories(cachedStories.data.length > currentPage * STORIES_PER_PAGE);
      setHasNewerStories(currentPage > 1);
      setLoading(false);
    }
  }, [currentPage, fetchStories, cachedStories]);

  const currentStories = stories.slice(
    (currentPage - 1) * STORIES_PER_PAGE,
    currentPage * STORIES_PER_PAGE
  );


  const handleOlderStories = () => {
    if (hasOlderStories) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleNewerStories = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        <EnhancedText text="sona sin pi toki pona" isEnglish={false} />
      </h1>
      {loading ? (
        <div><EnhancedText text="Loading stories..." isEnglish={true} /></div>
      ) : error ? (
        <div className="text-red-500"><EnhancedText text={error} isEnglish={true} /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentStories.map((story, index) => (
              <StoryCard
                key={`${story.id}-${index}`}
                story={story}
              />
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={hasNewerStories ? handleNewerStories : undefined}
              className={`px-4 py-2 rounded ${
                hasNewerStories
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasNewerStories}
            >
              <EnhancedText text="lipu sin" isEnglish={false} />
            </button>
            <button
              onClick={hasOlderStories ? handleOlderStories : undefined}
              className={`px-4 py-2 rounded ${
                hasOlderStories
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasOlderStories}
            >
              <EnhancedText text="lipu pini" isEnglish={false} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
