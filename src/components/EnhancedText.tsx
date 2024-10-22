import React, { useState, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import WordHint from './WordHint';
import { useTextRenderer } from '../hooks/useTextRenderer'
import { tokiPonaDictionary } from '../data/tokiPonaDictionary';

const UCSUR_START_CARTOUCHE = JSON.parse(`"\\uDB86\\uDD90"`);
const UCSUR_END_CARTOUCHE= JSON.parse(`"\\uDB86\\uDD91"`); 

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
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      const regex = /(\[.*?\]|\{.*?\}|\n)/g;
      const parts = paragraph.split(regex);

      const processedParts = parts.map((part, index) => {
        if (part === '\n') {
          return <br key={`br-${paragraphIndex}-${index}`} />;
        } else if (part.startsWith('{') && part.endsWith('}')) {
          return <LatinText key={`latin-${paragraphIndex}-${index}`} text={part.slice(1, -1)} />;
        } else if (part.startsWith('[') && part.endsWith(']')) {
          const content = part.slice(1, -1);
          const [latin, tokiPona] = content.split('|').map(s => s.trim());
          
          if (tokiPona) {
            return isEnglish ? latin : wrapCartouche(`[${tokiPona}]`, settings.useUCSUR && settings.render !== 'latin');
          } else if (content.split(' ').every(word => isLegalTokiPonaWord(word))) {
            return isEnglish ? content.slice(0, 4).toLowerCase() : wrapCartouche(part, settings.useUCSUR && settings.render !== 'latin');
          } else {
            return isEnglish ? content : wrapCartouche(`[${content.toUpperCase()}]`, settings.useUCSUR && settings.render !== 'latin');
          }
        } else {
          const { text: processedPart } = renderText(part, isEnglish);
          return processedPart;
        }
      });

      return (
        <div key={`p-${paragraphIndex}`} style={{ marginBottom: '1em' }}>
          {processedParts}
        </div>
      );
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
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
      }}
      onClick={handleWordInteraction}
      onMouseMove={handleWordInteraction}
      onMouseLeave={handleMouseLeave}
    >
      {processedTextParts}
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

// Helper function to wrap text in UCSUR cartouche delimiters if needed
function wrapCartouche(text: string, useUCSUR: boolean): string {
  if (useUCSUR) {
    return `${UCSUR_START_CARTOUCHE}${text.slice(1, -1)}${UCSUR_END_CARTOUCHE}`;
  }
  return text;
}
