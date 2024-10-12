import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useStories } from '../contexts/StoriesContext';
import WordHint from '../components/WordHint';

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: { stories, loading, error } } = useStories();
  const { settings } = useSettings();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const story = stories.find((s) => s.id === id);

  if (!story) {
    return <Navigate to="/" replace />;
  }

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

  const renderContent = (content: string) => {
    return content.split(/\s+/).map((word, index) => (
      <React.Fragment key={index}>
        <WordHint word={word} />
        {' '}
      </React.Fragment>
    ));
  };

  return (
    <div className={`max-w-3xl mx-auto ${getFontClass()}`}>
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      <img src={story.imageUrl} alt={story.title} className="w-full h-64 object-cover mb-6 rounded-lg" />
      <div className="mb-4 text-gray-600">
        <p>Date: {story.date}</p>
        <a href={story.originalLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Original source
        </a>
      </div>
      <div className="prose prose-lg mb-8">{renderContent(story.content)}</div>
      <Link to="/" className="text-green-600 hover:underline">← Back to Home</Link>
    </div>
  );
};

export default StoryPage;
