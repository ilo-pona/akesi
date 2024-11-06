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
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_COOLDOWN = 30000; // 30 seconds
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasOlderStories, setHasOlderStories] = useState(true);
  const [hasNewerStories, setHasNewerStories] = useState(false);
  const { stories: cachedStories, setStories: setCachedStories } = useStories();
  const location = useLocation();
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(0);

  var instance = window.location.hostname.split('.')[0];
  if(instance === "akesi") {
    instance = "default";
  }
  console.log("instance", instance);

  useEffect(() => {
    const pageNumber = page ? parseInt(page, 10) : 1;
    setCurrentPage(pageNumber);
  }, [page]);

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentPage(1);
    }
  }, [location]);

  const fetchStories = useCallback(async (page: number) => {
    if(loading) {
      return;
    }

    const now = Date.now();
    if (retryAttempts >= MAX_RETRY_ATTEMPTS && now - lastErrorTime < RETRY_COOLDOWN) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    try {
      if (!cachedStories) {
        setLoading(true);
      }
      const skip = (cachedStories?.data.length || 0);
      const limit = STORIES_PER_PAGE * PAGES_TO_FETCH + 1;
      console.log("fetching stories: skip", skip, limit, skip+limit, "for page", page);
      const response = await fetch(
        `${config.apiBaseUrl}/stories?skip=${skip}&limit=${limit}&instance=${instance}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const data = await response.json();
      console.log("fetched ", data.length,"stories, expected:", limit);
      if (data.length < limit) {
        setFinished(true);
      }

      // Process image URLs using the configurable image prefix
      const processedData = data.map((story: Story) => ({
        ...story,
        imageUrl: story.imageUrl.startsWith("http")
          ? story.imageUrl
          : `${config.imagePrefix}${story.imageUrl}`,
      }));

      setStories((prevStories) => {
        const allStories = [...prevStories, ...processedData];
        // Remove duplicates based on story ID
        const uniqueStories = Array.from(
          new Map(allStories.map((story) => [story.id, story])).values()
        );
        return uniqueStories;
      });

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

      setHasOlderStories(data.length > STORIES_PER_PAGE * PAGES_TO_FETCH);
      setHasNewerStories(page > 1);
      setLoading(false);
    } catch (err) {
      setError("Error fetching stories. Please try again later.");
      setLoading(false);
      setRetryAttempts(prev => prev + 1);
      setLastErrorTime(Date.now());
    }
  }, [loading, setCachedStories, cachedStories, retryAttempts, lastErrorTime]);

  useEffect(() => {
    const currentTime = Date.now();
    const shouldFetchNewStories =
      !finished && 
      retryAttempts < MAX_RETRY_ATTEMPTS &&
      (currentTime - lastErrorTime >= RETRY_COOLDOWN) &&
      (
        !cachedStories ||
        cachedStories.data.length === 0 ||
        cachedStories.data.length < currentPage * STORIES_PER_PAGE
      );
    console.log("useEffect. Do we need new?", shouldFetchNewStories, "we have", cachedStories?.data.length || 0, currentPage * STORIES_PER_PAGE, "needed; page", currentPage, currentPage*STORIES_PER_PAGE);
    if (shouldFetchNewStories) {
      fetchStories(currentPage);
    } else {
      setStories(cachedStories?.data);
      setHasOlderStories(
        (cachedStories?.data.length || 0) >= currentPage * STORIES_PER_PAGE
      );
      setHasNewerStories(currentPage > 1);
      setLoading(false);
    }

    // Prefetch stories for the next page
    if (shouldFetchNewStories && currentPage < (cachedStories?.data.length || 0) / STORIES_PER_PAGE) {
      fetchStories(currentPage + 1);
    }
  }, [currentPage, fetchStories, cachedStories, retryAttempts, lastErrorTime]);

  const currentStories = stories?.slice(
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

  const resetRetryState = () => {
    setRetryAttempts(0);
    setLastErrorTime(0);
    setError(null);
  };

  return (
    <div className="text-size-base">
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
          {retryAttempts >= MAX_RETRY_ATTEMPTS && (
            <button 
              onClick={resetRetryState}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <EnhancedText text="Try Again" isEnglish={true} />
            </button>
          )}
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
