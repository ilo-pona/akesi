import React, { useCallback, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useStories } from "../contexts/StoriesContext";
import WordHint from "../components/WordHint";

interface StoryPageProps {
  renderText: (text: string, isEnglish?: boolean) => React.ReactNode;
}

const StoryPage: React.FC<StoryPageProps> = ({ renderText }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hintPosition, setHintPosition] = useState<{ x: number; y: number } | null>(null);
  const { id } = useParams<{ id: string }>();
  const {
    state: { stories, loading, error },
  } = useStories();

  const handleWordInteraction = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const range = document.caretPositionFromPoint(
        event.clientX,
        event.clientY
      );
      if (range && range.offsetNode.nodeType === Node.TEXT_NODE) {
        const text = range.offsetNode.textContent || "";
        const word = getWordAtPoint(text, range.offset);
        if (word) {
          setSelectedWord(word);
          setHintPosition({ x: event.clientX, y: event.clientY });
        } else {
          setSelectedWord(null);
          setHintPosition(null);
        }
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setSelectedWord(null);
    setHintPosition(null);
  }, []);

  const getWordAtPoint = (text: string, offset: number): string | null => {
    const beforePoint = text.slice(0, offset);
    const afterPoint = text.slice(offset);
    const wordBefore = beforePoint.match(/\S+$/);
    const wordAfter = afterPoint.match(/^\S+/);
    if (wordBefore || wordAfter) {
      return (
        ((wordBefore && wordBefore[0]) || "") +
        ((wordAfter && wordAfter[0]) || "")
      );
    }
    return null;
  };

  const renderContent = (content: string) => {
    return (
      <div 
        className="word-hint-container relative" 
        onClick={handleWordInteraction}
        onMouseMove={handleWordInteraction}
        onMouseLeave={handleMouseLeave}
      >
        {renderText(content)}
        {selectedWord && hintPosition && (
          <WordHint word={selectedWord} position={hintPosition} />
        )}
      </div>
    );
  };

  if (loading) {
    return <div>{renderText("Loading...", true)}</div>;
  }

  if (error) {
    return <div>{renderText(`Error: ${error}`, true)}</div>;
  }

  const story = stories.find((s) => s.id === id);

  if (!story) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{renderText(story.title)}</h1>
      <img
        src={story.imageUrl}
        alt={story.title}
        className="w-full h-64 object-cover mb-6 rounded-lg"
      />
      <div className="mb-4 text-gray-600">
        <p>
          {renderText("Date:", true)} {renderText(story.date)}
        </p>
        <a
          href={story.originalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {renderText("Original source", true)}
        </a>
      </div>
      <div className="prose prose-lg mb-8">{renderContent(story.content)}</div>
      <Link to="/" className="text-green-600 hover:underline">
        {renderText("← Back to Home", true)}
      </Link>
    </div>
  );
};

export default StoryPage;
