import React from 'react';
import { tokiPonaDictionary, TokiPonaWord } from '../data/tokiPonaDictionary';
import { EnhancedText } from './EnhancedText';

interface WordHintProps {
  word: string;
  position: { x: number; y: number };
}

const WordHint: React.FC<WordHintProps> = ({ word, position }) => {
  // Trim punctuation from the start and end of the word
  const trimmedWord = word.replace(/^[^\w\s]+|[^\w\s]+$/g, '').toLowerCase();
  
  const wordInfo: TokiPonaWord | undefined = tokiPonaDictionary.find(w => w.word === trimmedWord);

  if (!wordInfo) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded p-2 shadow-lg w-64"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 20}px`,
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333',
      }}
    >
      <div className="flex items-center mb-2">
        <span className="mr-2 text-2xl">{wordInfo.glyph}</span>
        <span className="font-bold">
          <EnhancedText text={wordInfo.word} />
        </span>
      </div>
      <p className="text-sm">
        <EnhancedText text={wordInfo.definition} isEnglish={true} />
      </p>
    </div>
  );
};

export default WordHint;
