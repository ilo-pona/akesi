import React, { useState, useCallback } from "react";
import { useSettings } from "../contexts/SettingsContext";
import WordHint from "./WordHint";
import { useTextRenderer } from "../hooks/useTextRenderer";
import { tokiPonaDictionary } from "../data/tokiPonaDictionary";
import { TokenizedText } from "../types/TokenizedText";

const UCSUR_START_CARTOUCHE = JSON.parse(`"\\uDB86\\uDD90"`);
const UCSUR_END_CARTOUCHE = JSON.parse(`"\\uDB86\\uDD91"`);

interface EnhancedTextProps {
  text: string | TokenizedText[];
  isEnglish?: boolean;
  removeExtraSpace?: boolean;
}

const LatinText: React.FC<{ text: string }> = ({ text }) => (
  <span style={{ fontFamily: "sans-serif" }}>{text}</span>
);

export const EnhancedText: React.FC<EnhancedTextProps> = ({
  text,
  isEnglish = false,
  removeExtraSpace = false,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hintPosition, setHintPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { settings } = useSettings();
  const renderText = useTextRenderer();

  const handleWordInteraction = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (!settings.showHints) return;

      const range = document.caretPositionFromPoint(
        event.clientX,
        event.clientY
      );
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

  const processText = (text: string | TokenizedText[], isEnglish: boolean) => {
    if (typeof text === "string") {
      return processStringText(text, isEnglish);
    } else {
      return processTokenizedText(text, isEnglish);
    }
  };

  const processStringText = (text: string, isEnglish: boolean) => {
    const paragraphs = text.split(/\n\s*\n/);

    return paragraphs.map((paragraph, paragraphIndex) => {
      const updatedParagraph = paragraph.replace(
        /\b(?!\[)[A-Z][A-Za-z]*(?!\])\b/g,
        (match) => `[${match}]`
      );
      const regex = /(\[.*?\]|\{.*?\}|\n)/g;
      const parts = updatedParagraph.split(regex);

      const processedParts = parts.map((part, index) => {
        if (part === "\n") {
          return <br key={`br-${paragraphIndex}-${index}`} />;
        } else if (part.startsWith("{") && part.endsWith("}")) {
          return (
            <LatinText
              key={`latin-${paragraphIndex}-${index}`}
              text={part.slice(1, -1)}
            />
          );
        } else if (part.startsWith("[") && part.endsWith("]")) {
          const content = part.slice(1, -1);
          const [latin, tokiPona] = content.split("|").map((s) => s.trim());

          if (tokiPona) {
            return isEnglish || settings.render === "latin"
              ? latin
              : wrapCartouche(
                  `[${tokiPona.toUpperCase()}]`,
                  settings.useUCSUR && settings.render !== "latin"
                );
          } else if (
            content.split(" ").every((word) => isLegalTokiPonaWord(word))
          ) {
            return isEnglish || settings.render === "latin"
              ? content
              : wrapCartouche(
                  `[${content.toUpperCase()}]`,
                  settings.useUCSUR && settings.render !== "latin"
                );
          } else {
            return isEnglish || settings.render === "latin"
              ? content
              : wrapCartouche(
                  `[${content.toUpperCase()}]`,
                  settings.useUCSUR && settings.render !== "latin"
                );
          }
        } else {
          const { text: processedPart } = renderText(part, isEnglish);
          return processedPart;
        }
      });

      // Remove extra space at the end if removeExtraSpace is true
      if (removeExtraSpace) {
        const lastPart = processedParts[processedParts.length - 1];
        if (typeof lastPart === "string") {
          processedParts[processedParts.length - 1] = lastPart.trimEnd();
        }
      }

      return (
        <p key={`p-${paragraphIndex}`} style={{ margin: "0.5em 0" }}>
          {processedParts}
        </p>
      );
    });
  };

  const processTokenizedText = (
    tokens: TokenizedText[],
    isEnglish: boolean
  ) => {
    return tokens.map((token, index) => {
      switch (token.type) {
        case "tokipona":
          return renderTokiPona(token.content, isEnglish, index);
        case "escaped":
          return <LatinText key={`escaped-${index}`} text={token.content} />;
        case "name":
          return renderName(token, isEnglish, index);
        case "illegal":
        case "error":
          return <LatinText key={`error-${index}`} text={token.content} />;
        default:
          return null;
      }
    });
  };

  const renderTokiPona = (
    content: string,
    isEnglish: boolean,
    index: number
  ) => {
    const { text: processedPart } = renderText(content, isEnglish);
    return (
      <React.Fragment key={`tokipona-${index}`}>{processedPart}</React.Fragment>
    );
  };

  const renderName = (
    token: { name: string; toki_name?: string },
    isEnglish: boolean,
    index: number
  ) => {
    const content = token.content.toki_name || token.content.name;
    return isEnglish || settings.render === "latin"
      ? token.content.name
      : wrapCartouche(
          token.content.toki_name
            ? `[${content}]`
            : `[${content.toUpperCase()}]`,
          settings.useUCSUR && settings.render !== "latin",
          `name-${index}`
        );
  };

  const { fontFamily } = renderText("", isEnglish);
  const processedTextParts = processText(text, isEnglish);

  // Determine which font to use based on isEnglish and the current render mode
  const currentFont =
    isEnglish || settings.render === "latin"
      ? "sans-serif"
      : settings.sitelenPonaFont;

  return (
    <div
      style={{
        fontFamily: currentFont,
        whiteSpace: removeExtraSpace ? "normal" : "pre-wrap",
      }}
      onClick={handleWordInteraction}
      onMouseMove={handleWordInteraction}
      onMouseLeave={handleMouseLeave}
    >
      {processedTextParts}
      {settings.showHints && selectedWord && hintPosition && (
        <WordHint word={selectedWord} position={hintPosition} />
      )}
    </div>
  );
};

// Helper function to check if a word is a legal Toki Pona word
function isLegalTokiPonaWord(word: string): boolean {
  // Convert the word to lowercase for case-insensitive comparison
  const lowercaseWord = word.toLowerCase();

  // Check if the word exists in the tokiPonaDictionary
  return tokiPonaDictionary.some((entry) => entry.word === lowercaseWord);
}

// Helper function to wrap text in UCSUR cartouche delimiters if needed
function wrapCartouche(
  text: string,
  useUCSUR: boolean,
  index?: string
): string {
  if (useUCSUR) {
    return `${UCSUR_START_CARTOUCHE}${text.slice(1, -1)}${UCSUR_END_CARTOUCHE}`;
  }
  return text;
}
