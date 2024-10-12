import { tokiPonaDictionary, TokiPonaWord } from '../data/tokiPonaDictionary';

// Create a map for faster lookups
const tokiPonaMap = new Map<string, TokiPonaWord>(
  tokiPonaDictionary.map(word => [word.word, word])
);

// Function to trim punctuation from the start and end of a word
const trimPunctuation = (word: string): [string, string, string] => {
  const startPunctuation = word.match(/^[^\w]+/) || [''];
  const endPunctuation = word.match(/[^\w]+$/) || [''];
  const trimmedWord = word.replace(/^[^\w]+|[^\w]+$/g, '');
  return [startPunctuation[0], trimmedWord, endPunctuation[0]];
};

export function convertToUCSUR(text: string | React.ReactNode): string | React.ReactNode {
  // If text is not a string, return it unchanged
  if (typeof text !== 'string') {
    return text;
  }

  // Split the text into words
  const words = text.split(/\s+/);

  // Convert each word
  const convertedWords = words.map(word => {
    const [startPunct, trimmedWord, endPunct] = trimPunctuation(word);
    const lowerWord = trimmedWord.toLowerCase();
    const entry = tokiPonaMap.get(lowerWord);

    if (entry && entry.ucsur) {
      // Convert the UCSUR escape sequence to an actual Unicode character
      const ucsurChar = JSON.parse(`"${entry.ucsur}"`);
      
      // Preserve the original capitalization
      const convertedWord = trimmedWord === trimmedWord.toUpperCase() ? ucsurChar.toUpperCase() : ucsurChar;
      return startPunct + convertedWord + endPunct;
    }

    // If the word is not in the dictionary, return it unchanged
    return word;
  });

  // Join the words back into a string
  return convertedWords.join(' ');
}
