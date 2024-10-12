import React, { useState, useRef, useEffect } from 'react';
import { tokiPonaDictionary, TokiPonaWord } from '../data/tokiPonaDictionary';
import { useSettings } from '../contexts/SettingsContext';

interface WordHintProps {
  word: string;
}

const WordHint: React.FC<WordHintProps> = ({ word }) => {
  const [showHint, setShowHint] = useState(false);
  const { settings } = useSettings();
  const wordInfo: TokiPonaWord | undefined = tokiPonaDictionary.find(w => w.word === word.toLowerCase());
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hintRef.current && !hintRef.current.contains(event.target as Node)) {
        setShowHint(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!settings.showHints || !wordInfo) {
    return <span>{word}</span>;
  }

  return (
    <span
      ref={hintRef}
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
    >
      {word}
      {showHint && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded p-2 shadow-lg mt-1 w-64 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center mb-2">
            <img src={wordInfo.glyph} alt={wordInfo.word} className="w-8 h-8 mr-2" />
            <span className="font-bold">{wordInfo.word}</span>
          </div>
          <p className="text-sm">{wordInfo.definition}</p>
        </div>
      )}
    </span>
  );
};

export default WordHint;