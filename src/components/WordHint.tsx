import React from "react";
import { tokiPonaDictionary, TokiPonaWord } from "../data/tokiPonaDictionary";
import { useSettings } from "../contexts/SettingsContext";
import { getFontFamily, defaultAsciiFont, defaultUcsurFont } from "../config/fontConfig";
import { convertToUCSUR } from "../utils/ucsurConverter";

interface WordHintProps {
  word: string;
  position: { x: number; y: number };
}

const WordHint: React.FC<WordHintProps> = ({ word, position }) => {
  const { settings } = useSettings();
  var trimmedWord = word;
  const wordInfo: TokiPonaWord | undefined = tokiPonaDictionary.find(
    (w) => {
      if (settings.useUCSUR) {
        const codePoint = JSON.parse(`"${w.ucsur}"`);
        return codePoint === word  || w.word === word;
      } else {
        trimmedWord = word.replace(/^[^\w\s]+|[^\w\s]+$/g, "").toLowerCase();
        return w.word === trimmedWord;
      }
    }
  );
  if (!wordInfo) {
    return null;
  }

  const getDisplayFont = () => {
    if (settings.render === 'latin' || (settings.render === 'sitelen_pona' && !settings.useUCSUR)) {
      return getFontFamily(settings.sitelenPonaFont) || defaultAsciiFont;
    } else {
      return getFontFamily(settings.sitelenPonaFont) || defaultUcsurFont;
    }
  };

  const displayWord = settings.useUCSUR ? convertToUCSUR(trimmedWord) : trimmedWord;

  return (
    <div
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
        <span style={{ marginRight: "8px", fontSize: "24px", fontFamily: getDisplayFont() }}>
          {displayWord}
        </span>
        <span style={{ fontWeight: "bold" }}>{wordInfo.word}</span>
      </div>
      <div style={{ fontSize: "12px", margin: 0, fontWeight: "normal" }}>
        {wordInfo.definition}
      </div>
    </div>
  );
};

export default WordHint;
