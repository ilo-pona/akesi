export interface TokiPonaWord {
  word: string;
  ucsur: string;
  glyph: string;
  definition: string;
}

export const tokiPonaDictionary: TokiPonaWord[] = [
  {
    word: 'a',
    ucsur: '\uF1900',
    glyph: 'https://raw.githubusercontent.com/kreativekorp/sitelen-pona-pona/main/glyphs/a.svg',
    definition: 'ah, ha, uh, oh, ooh, aw, well (emotion or emphasis)'
  },
  {
    word: 'akesi',
    ucsur: '\uF1901',
    glyph: 'https://raw.githubusercontent.com/kreativekorp/sitelen-pona-pona/main/glyphs/akesi.svg',
    definition: 'reptile, amphibian'
  },
  {
    word: 'ala',
    ucsur: '\uF1902',
    glyph: 'https://raw.githubusercontent.com/kreativekorp/sitelen-pona-pona/main/glyphs/ala.svg',
    definition: 'no, not, zero'
  },
  // Add more words here...
];