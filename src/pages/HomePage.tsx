import React, { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import { EnhancedText } from "../components/EnhancedText";
import { useSettings } from "../contexts/SettingsContext";
import { Story } from "../types/Story";
import { config } from "../config";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStories } from "../contexts/StoriesContext";

const STORIES_PER_PAGE = 6;
const PAGES_TO_FETCH = 3;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const [askedFor, setAskedFor] = useState(-10);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasOlderStories, setHasOlderStories] = useState(true);
  const [hasNewerStories, setHasNewerStories] = useState(false);
  const { stories: cachedStories, setStories: setCachedStories } = useStories();
  const location = useLocation();
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();

  useEffect(() => {
    const pageNumber = page ? parseInt(page, 10) : 1;
    setCurrentPage(pageNumber);
  }, [page]);

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentPage(1);
    }
  }, [location]);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * STORIES_PER_PAGE;
      const limit = STORIES_PER_PAGE * PAGES_TO_FETCH + 1;
      console.log("fetching", skip, limit, cachedStories?.data.length);
      setAskedFor(limit + cachedStories?.data.length);
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

      setStories(processedData); // Don't accumulate, just set the new batch
      setCachedStories((prevCache) => {
        const existingStories = prevCache?.data || [];
        const allStories = [...existingStories, ...processedData];
        // Remove duplicates based on story ID
        const uniqueStories = Array.from(
          new Map(allStories.map((story) => [story.id, story])).values()
        );
        return {
          data: uniqueStories,
          timestamp: Date.now(),
        };
      });

      const newHasOlderStories =
        data.length > STORIES_PER_PAGE * PAGES_TO_FETCH;
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
    const shouldFetchNewStories =
      !cachedStories ||
      cachedStories.data.length === 0 ||
      currentTime - cachedStories.timestamp >= CACHE_DURATION ||
      cachedStories.data.length < currentPage * STORIES_PER_PAGE;
    console.log(
      cachedStories?.data.length,
      currentPage * STORIES_PER_PAGE,
      shouldFetchNewStories,
      askedFor
    );
    const datalen = cachedStories?.data.length || 0;
    if (shouldFetchNewStories && askedFor <= datalen) {
      fetchStories();
    } else {
      setStories(cachedStories.data);
      setHasOlderStories(
        cachedStories.data.length >= currentPage * STORIES_PER_PAGE
      );
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
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      navigate(`/page/${newPage}`);
    }
  };

  const handleNewerStories = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    navigate(newPage === 1 ? "/" : `/page/${newPage}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        <EnhancedText text="sona sin pi toki pona" isEnglish={false} />
      </h1>
      {loading ? (
        <div>
          <EnhancedText text="Loading stories..." isEnglish={true} />
        </div>
      ) : error ? (
        <div className="text-red-500">
          <EnhancedText text={error} isEnglish={true} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentStories.map((story, index) => (
              <StoryCard key={`${story.id}-${index}`} story={story} />
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={hasNewerStories ? handleNewerStories : undefined}
              className={`px-4 py-2 rounded ${
                hasNewerStories
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasNewerStories}
            >
              <EnhancedText text="lipu sin" isEnglish={false} />
            </button>
            <button
              onClick={hasOlderStories ? handleOlderStories : undefined}
              className={`px-4 py-2 rounded ${
                hasOlderStories
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
