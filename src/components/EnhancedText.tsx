import React, { useState, useCallback } from "react";
import { useSettings } from "../contexts/SettingsContext";
import WordHint from "./WordHint";
import { useTextRenderer } from "../hooks/useTextRenderer";
import { tokiPonaDictionary, unorthodoxies } from "../data/tokiPonaDictionary";
import { TokenizedText } from "../types/TokenizedText";
import marked from "marked";

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

  const getWordFromXY = (x: number, y: number) => {
    let range;
    let text = "";
    if (document.caretPositionFromPoint) {
      range = document.caretPositionFromPoint(x, y);
      if (range ) {
        text = range.offsetNode.textContent || "";
      }
    } else {
      range = document.caretRangeFromPoint(x, y);
      if(range) {
        text = range.startContainer.textContent || "";
      }
    }
    const offset: number = range?.offset || range.endOffset;;
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
  }

  const handleWordInteraction = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (!settings.showHints) return;

      const word = getWordFromXY(event.clientX, event.clientY);
        if (word) {
          if (unorthodoxies.has(word)) { 
            setSelectedWord(unorthodoxies.get(word));
          } else {
            setSelectedWord(word);
          }
          setHintPosition({ x: event.clientX, y: event.clientY });
        } else {
          setSelectedWord(null);
          setHintPosition(null);
        }
    },
    [settings.showHints]
  );

  const handleMouseLeave = useCallback(() => {
    setSelectedWord(null);
    setHintPosition(null);
  }, []);

  const processText = (text: string | TokenizedText[], isEnglish: boolean) => {
    if (typeof text === "string") {
      return processStringText(text, isEnglish);
    } else {
      return processTokenizedText(text.slice(), isEnglish);
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

  const parseAttributes = (attrString) => {
    const attributes = {};
    attrString.split(" ").forEach((attr) => {
      const [key, value] = attr.split("=");
      if (value === undefined) {
        return;
      }
      attributes[key] = value.replace(/"/g, ""); // Remove quotes from the value
    });
    return attributes;
  };

  const processTokenizedText = (
    tokens: TokenizedText[],
    isEnglish: boolean
  ) => {
    const result = [];
    var i = 0;
    while (tokens.length > 0) {
      const token = tokens.shift();
      i++;
      if (token.type === "markdown") {
        if (token.content.startsWith("/")) {
          return result;
        } else if (token.content.startsWith("img")) {
          var imgAttributes = parseAttributes(token.content);
          result.push(
            <img key={`image-${i}`} {...imgAttributes} />
          );
        }
        switch (token.content) {
          case "em":
          case "strong":
            result.push(
              <strong key={`bold_start-${i}`}>
                {processTokenizedText(tokens, isEnglish)}
              </strong>
            );
            break;
          case "i":
            result.push(
              <em key={`italic_start-${i}`}>
                {processTokenizedText(tokens, isEnglish)}
              </em>
            );
            break;
          case "h1":
            result.push(
              <h1 className="text-3xl" key={`heading1_start-${i}`}>
                {processTokenizedText(tokens, isEnglish)}
              </h1>
            );
            break;
          case "h2":
            result.push(
              <h2 className="text-2xl" key={`heading2_start-${i}`}>
                {processTokenizedText(tokens, isEnglish)}
              </h2>
            );
            break;
          case "h3":
            result.push(
              <h3 className="text-2xl" key={`heading3_start-${i}`}>
                {processTokenizedText(tokens, isEnglish)}
              </h3>
            );
            break;
          case "del":
            result.push(
              <del className="line-through" key={`strikethrough_start-${i}`}>
                {processTokenizedText(token.content, isEnglish)}
              </del>
            );
            break;
          case "img":
            result.push(
              <img key={`image-${i}`} src={token.content} alt="inline image" />
            );
            break;
          case "table":
            result.push(
              <table key={`table-${i}`} className="border-collapse border">
                {processTokenizedText(tokens, isEnglish)}
              </table>
            );
            break;
          case "tr":
            result.push(
              <tr key={`tr-${i}`}>
                {processTokenizedText(tokens, isEnglish)}
              </tr>
            );
            break;
          case "td":
            result.push(
              <td key={`td-${i}`} className="border p-2">
                {processTokenizedText(tokens, isEnglish)}
              </td>
            );
            break;
          case "th":
            result.push(
              <th key={`th-${i}`} className="border p-2 font-bold">
                {processTokenizedText(tokens, isEnglish)}
              </th>
            );
            break;
          default:
            if (!token.content.startsWith("/")) {
              const Tag = token.content;
              result.push(
                <Tag key={`generic-${i}`}>
                  {processTokenizedText(tokens, isEnglish)}
                </Tag>
              );
            }
            break;
        }
      }

      switch (token.type) {
        case "tokipona":
          result.push(renderTokiPona(token.content, isEnglish, i));
          break;
        case "escaped":
          result.push(<LatinText key={`escaped-${i}`} text={token.content} />);
          break;
        case "name":
          result.push(renderName(token, isEnglish, i));
          break;
        case "illegal":
        case "error":
          result.push(<LatinText key={`error-${i}`} text={token.content} />);
          break;
        default:
          break;
      }
    }

    return result;
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
      className={`${(!isEnglish && settings.render !== "latin") ? "sitelen-pona" : "text-size-base"}`}
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
  if (unorthodoxies.has(lowercaseWord)) {
    return true;
  }

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
