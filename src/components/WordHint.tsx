import React from "react";
import { tokiPonaDictionary, TokiPonaWord } from "../data/tokiPonaDictionary";
import { EnhancedText } from "./EnhancedText";

interface WordHintProps {
  word: string;
  position: { x: number; y: number };
}

const WordHint: React.FC<WordHintProps> = ({ word, position }) => {
  // Trim punctuation from the start and end of the word
  const trimmedWord = word.replace(/^[^\w\s]+|[^\w\s]+$/g, "").toLowerCase();

  const wordInfo: TokiPonaWord | undefined = tokiPonaDictionary.find(
    (w) => w.word === trimmedWord
  );

  if (!wordInfo) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded p-2 shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 20}px`,
        width: "256px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
        color: "#333",
      }}
    >
      <div className="flex items-center mb-2">
        <span className="font-fairfax-pona-hd" style={{ marginRight: "8px", fontSize: "24px" }}>
          {word.toLowerCase()}
        </span>
        <span style={{ fontWeight: "bold" }}>{wordInfo.word}</span>
      </div>
      <p style={{ fontSize: "12px", margin: 0, fontWeight: "normal" }}>
        {wordInfo.definition}
      </p>
    </div>
  );
};

export default WordHint;
