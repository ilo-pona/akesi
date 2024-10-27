import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { useStories } from "../contexts/StoriesContext";
import { EnhancedText } from "../components/EnhancedText";
import { config } from "../config";

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { stories } = useStories();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchStory = async () => {
      if (stories?.data) {
        const foundStory = stories.data.find((s) => s.id === id);
        if (foundStory) {
          setStory(foundStory);
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await fetch(`${config.apiBaseUrl}/stories/${id}`);
        if (!response.ok) {
          throw new Error("Story not found");
        }
        const fetchedStory = await response.json();
        setStory(fetchedStory);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id, stories]);

  if (isLoading) {
    return (
      <div>
        <EnhancedText text="Loading..." isEnglish={true} />
      </div>
    );
  }

  if (!story) {
    return <Navigate to="/" replace />;
  }

  const getImageUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${config.imagePrefix}${url}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        <EnhancedText text={story.title} />
      </h1>
      <div className="text-sm text-gray-600 mb-4">
        <EnhancedText
          text={`tan: ${story.author}`}
          isEnglish={false}
          removeExtraSpace={true}
        />
      </div>
      <img
        src={getImageUrl(story.imageUrl)}
        alt={story.title}
        className="w-full max-h-96 object-contain mb-6 rounded-lg"
      />
      <div className="mb-4 text-gray-600">
        <div>
          <EnhancedText
            text={`tenpo: {${story.date.substring(0, 10)}}`}
            isEnglish={false}
          />
        </div>
        <a
          href={story.originalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          <EnhancedText text="Source" isEnglish={true} />
        </a>
      </div>
      <div className="prose prose-lg mb-8">
        <EnhancedText text={story.tokenised ? story.tokenised: story.content} />
      </div>
      <Link
        to={location.state?.from || "/"}
        className="text-green-600 hover:underline"
      >
        <EnhancedText text="← o tawa tomo" isEnglish={false} />
      </Link>
    </div>
  );
};

export default StoryPage;
