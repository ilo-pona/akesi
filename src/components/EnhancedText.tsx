import React, { useState, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import WordHint from './WordHint';
import { useTextRenderer } from '../hooks/useTextRenderer'
import { tokiPonaDictionary } from '../data/tokiPonaDictionary';

interface EnhancedTextProps {
  text: string;
  isEnglish?: boolean;
}

const LatinText: React.FC<{ text: string }> = ({ text }) => (
  <span style={{ fontFamily: 'sans-serif' }}>{text}</span>
);

export const EnhancedText: React.FC<EnhancedTextProps> = ({ text, isEnglish = false }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hintPosition, setHintPosition] = useState<{ x: number; y: number } | null>(null);
  const { settings } = useSettings();
  const renderText = useTextRenderer();

  const handleWordInteraction = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (!settings.showHints) return;

      const range = document.caretPositionFromPoint(event.clientX, event.clientY);
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
    [settings.showHints]
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

  const processText = (text: string, isEnglish: boolean) => {
    const regex = /(\[.*?\]|\{.*?\})/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return <LatinText key={index} text={part.slice(1, -1)} />;
      } else if (part.startsWith('[') && part.endsWith(']')) {
        const content = part.slice(1, -1);
        const [latin, tokiPona] = content.split('|').map(s => s.trim());
        
        if (tokiPona) {
          return isEnglish ? latin : `[${tokiPona}]`;
        } else if (content.split(' ').every(word => isLegalTokiPonaWord(word))) {
          return isEnglish ? content.slice(0, 4).toLowerCase() : part;
        } else {
          return isEnglish ? content : `[${content.toUpperCase()}]`;
        }
      } else {
        const { text: processedPart } = renderText(part, isEnglish);
        return processedPart;
      }
    });
  };

  const { fontFamily } = renderText('', isEnglish);
  const processedTextParts = processText(text, isEnglish);

  // Determine which font to use based on isEnglish and the current render mode
  const currentFont = isEnglish || settings.render === 'latin'
    ? 'sans-serif'
    : settings.sitelenPonaFont;

  return (
    <span 
      style={{ 
        fontFamily: currentFont,
        display: 'inline',
      }}
      onClick={handleWordInteraction}
      onMouseMove={handleWordInteraction}
      onMouseLeave={handleMouseLeave}
    >
      {processedTextParts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
      {settings.showHints && selectedWord && hintPosition && (
        <WordHint word={selectedWord} position={hintPosition} />
      )}
    </span>
  );
};

// Helper function to check if a word is a legal Toki Pona word
function isLegalTokiPonaWord(word: string): boolean {
  // Convert the word to lowercase for case-insensitive comparison
  const lowercaseWord = word.toLowerCase();
  
  // Check if the word exists in the tokiPonaDictionary
  return tokiPonaDictionary.some(entry => entry.word === lowercaseWord);
}
