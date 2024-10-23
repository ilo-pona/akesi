import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSettings } from "../contexts/SettingsContext";
import { Story } from "../types/Story";
import { EnhancedText } from "./EnhancedText";

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const { settings } = useSettings();
  const location = useLocation();

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

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${getFontClass()}`}
    >
      <Link to={`/story/${story.id}`} state={{ from: location.pathname }}>
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-48 object-cover hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="p-4">
        <Link to={`/story/${story.id}`} state={{ from: location.pathname }}>
          <h2 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors">
            <EnhancedText text={story.title} />
          </h2>
        </Link>
        <div className="text-gray-600 mb-2">
          <EnhancedText text={story.summary} />
        </div>
        <div className="text-sm text-gray-500 mb-2">
          <EnhancedText text={story.date.substring(0, 10)} isEnglish={true} />
        </div>
        <div className="flex justify-between items-center">
          <Link
            to={`/story/${story.id}`}
            className="text-green-600 hover:underline"
          >
            <EnhancedText text="o lukin e ale" isEnglish={false} />
          </Link>
          <a
            href={story.originalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            <EnhancedText text="Source" isEnglish={true} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
