import React, { useState, useEffect } from "react";
import StoryCard from "../components/StoryCard";
import { useSettings } from "../contexts/SettingsContext";
import { Story } from "../types/Story"; // Assuming you have a Story type defined
import { config } from "../config";

const STORIES_PER_PAGE = 5;

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/stories`); // Use the API base URL from config
        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }
        const data = await response.json();
        setStories(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching stories. Please try again later.");
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const getFontClass = () => {
    switch (settings.font) {
      case "nasin_nampa":
        return "font-nasin-nanpa";
      case "linja_pona":
        return "font-linja-pona";
      case "sitelen_pona_pona":
        return "font-sitelen-pona-pona";
      default:
        return "";
    }
  };

  const indexOfLastStory = currentPage * STORIES_PER_PAGE;
  const indexOfFirstStory = indexOfLastStory - STORIES_PER_PAGE;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);

  const totalPages = Math.ceil(stories.length / STORIES_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={getFontClass()}>
      <h1 className="text-3xl font-bold mb-8">Latest Good News in Toki Pona</h1>
      {loading ? (
        <p>Loading stories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentStories.map((story, index) => (
              <StoryCard key={`${story.id}-${index}`} story={story} />
            ))}
          </div>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
