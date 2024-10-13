import React, { useState, useEffect } from "react";
import StoryCard from "../components/StoryCard";
import { EnhancedText } from "../components/EnhancedText";
import { useSettings } from "../contexts/SettingsContext";
import { Story } from "../types/Story";
import { config } from "../config";
import { useLocation } from "react-router-dom";

const STORIES_PER_PAGE = 4;
const PAGES_TO_FETCH = 2;

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasOlderStories, setHasOlderStories] = useState(true);
  const [hasNewerStories, setHasNewerStories] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/newest") {
      setCurrentPage(1);
    }
  }, [location]);

  useEffect(() => {
    const fetchStories = async () => {
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

        setStories(processedData);
        setHasOlderStories(data.length > STORIES_PER_PAGE);
        setHasNewerStories(currentPage > 1);
        setLoading(false);
      } catch (err) {
        setError("Error fetching stories. Please try again later.");
        setLoading(false);
      }
    };

    fetchStories();
  }, [currentPage]);

  const currentStories = stories.slice(0, STORIES_PER_PAGE);

  const handleOlderStories = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
        <p><EnhancedText text="Loading stories..." isEnglish={true} /></p>
      ) : error ? (
        <p className="text-red-500"><EnhancedText text={error} isEnglish={true} /></p>
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
          <div className="flex justify-center space-x-4">
            {hasNewerStories && (
              <button
                onClick={handleNewerStories}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <EnhancedText text="lipu sin" isEnglish={false} />
              </button>
            )}
            {hasOlderStories && (
              <button
                onClick={handleOlderStories}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <EnhancedText text="lipu pini" isEnglish={false} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
