import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { Story } from '../types/Story';

interface StoryCardProps {
  story: Story & { title: React.ReactNode };
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const { settings } = useSettings();

  const getFontClass = () => {
    switch (settings.font) {
      case 'nasin_nampa':
        return 'font-nasin-nanpa';
      case 'linja_pona':
        return 'font-linja-pona';
      case 'sitelen_pona_pona':
        return 'font-sitelen-pona-pona';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${getFontClass()}`}>
      <Link to={`/story/${story.id}`}>
        <img src={story.imageUrl} alt={typeof story.title === 'string' ? story.title : 'Story image'} className="w-full h-48 object-cover hover:opacity-80 transition-opacity" />
      </Link>
      <div className="p-4">
        <Link to={`/story/${story.id}`}>
          <h2 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors">{story.title}</h2>
        </Link>
        <p className="text-gray-600 mb-2">{story.summary}</p>
        <p className="text-sm text-gray-500 mb-2">{story.date}</p>
        <div className="flex justify-between items-center">
          <Link to={`/story/${story.id}`} className="text-green-600 hover:underline">
            Read more
          </Link>
          <a href={story.originalLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
            Original source
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
