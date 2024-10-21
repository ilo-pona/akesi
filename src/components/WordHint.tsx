import React from "react";
import { tokiPonaDictionary, TokiPonaWord } from "../data/tokiPonaDictionary";
import { useSettings } from "../contexts/SettingsContext";

interface WordHintProps {
  word: string;
  position: { x: number; y: number };
}

const WordHint: React.FC<WordHintProps> = ({ word, position }) => {
  const { settings } = useSettings();

  // Trim punctuation from the start and end of the word
  // const trimmedWord = word.toLowerCase();
  
  const toki = tokiPonaDictionary.find((w) => w.word == "toki"); // get the toki word
  // const aaa = JSON.parse(`"${toki?.ucsur}"`)
  // console.log(toki?.ucsur, word, aaa, word===aaa);
  const wordInfo: TokiPonaWord | undefined = tokiPonaDictionary.find(
    (w) => {
      if (settings.useUCSUR) {
        const codePoint = JSON.parse(`"${w.ucsur}"`);
        return codePoint === word  || w.word === word;
      } else {
        const trimmedWord = word.replace(/^[^\w\s]+|[^\w\s]+$/g, "").toLowerCase();
        return w.word === trimmedWord;
      }
    }
  );
  if (!wordInfo) {
    return null;
  }

  return (
    <span
      className="fixed z-50 inline-block bg-white border border-gray-200 rounded p-2 shadow-lg"
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
          {wordInfo.word.toLowerCase()}
        </span>
        <span style={{ fontWeight: "bold" }}>{wordInfo.word}</span>
      </div>
      <div style={{ fontSize: "12px", margin: 0, fontWeight: "normal" }}>
        {wordInfo.definition}
      </div>
    </span>
  );
};

export default WordHint;
