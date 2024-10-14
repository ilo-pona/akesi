import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useStories } from "../contexts/StoriesContext";
import { EnhancedText } from "../components/EnhancedText";

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    state: { stories, loading, error },
  } = useStories();

  if (loading) {
    return <div><EnhancedText text="Loading..." isEnglish={true} /></div>;
  }

  if (error) {
    return <div><EnhancedText text={`Error: ${error}`} isEnglish={true} /></div>;
  }

  const story = stories.find((s) => s.id === id);

  if (!story) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4"><EnhancedText text={story.title} /></h1>
      <img
        src={story.imageUrl}
        alt={story.title}
        className="w-full h-64 object-cover mb-6 rounded-lg"
      />
      <div className="mb-4 text-gray-600">
        <p>
          <EnhancedText text="tenpo:" isEnglish={false} /> <EnhancedText text={story.date} isEnglish={true} />
        </p>
        <a
          href={story.originalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          <EnhancedText text="Source" isEnglish={true} />
        </a>
      </div>
      <div className="prose prose-lg mb-8"><EnhancedText text={story.content} /></div>
      <Link to="/" className="text-green-600 hover:underline">
        <EnhancedText text="← o tawa tomo" isEnglish={false} />
      </Link>
    </div>
  );
};

export default StoryPage;
