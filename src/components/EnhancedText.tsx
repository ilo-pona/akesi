import React, { useState, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import WordHint from './WordHint';
import { useTextRenderer } from '../hooks/useTextRenderer'

interface EnhancedTextProps {
  text: string;
  isEnglish?: boolean;
}

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

  const { fontFamily, text: processedText } = renderText(text, isEnglish);

  // Determine which font to use based on isEnglish and the current render mode
  const currentFont = isEnglish
    ? settings.latinFont
    : settings.render === 'latin'
    ? settings.latinFont
    : settings.sitelenPonaFont;

  return (
    <span 
      style={{ fontFamily: currentFont }}
      onClick={handleWordInteraction}
      onMouseMove={handleWordInteraction}
      onMouseLeave={handleMouseLeave}
    >
      {processedText}
      {settings.showHints && selectedWord && hintPosition && (
        <WordHint word={selectedWord} position={hintPosition} />
      )}
    </span>
  );
};
