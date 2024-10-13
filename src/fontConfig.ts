export interface FontOption {
  value: string;
  label: string;
  ucsurCompatible: boolean;
  asciiCompatible: boolean;
  englishCompatible: boolean;
}

export const fontOptions: FontOption[] = [
  {
    value: 'nasin_nanpa',
    label: 'nasin nanpa',
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
  },
  {
    value: 'linja_pona',
    label: 'linja pona',
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
  },
  {
    value: 'sitelen_pona_pona',
    label: 'sitelen pona pona',
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
  },
  {
    value: 'ucsur_font_1',
    label: 'UCSUR Font 1',
    ucsurCompatible: true,
    asciiCompatible: false,
    englishCompatible: false,
  },
  {
    value: 'ucsur_font_2',
    label: 'UCSUR Font 2',
    ucsurCompatible: true,
    asciiCompatible: false,
    englishCompatible: false,
  },
  {
    value: 'sans_serif',
    label: 'Sans Serif',
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: true,
  },
];

export const defaultAsciiFont = 'linja_pona';
export const defaultUcsurFont = 'ucsur_font_1';
export const defaultEnglishFont = 'sans_serif';

export const defaultRenderMode: 'ascii' | 'sitelen_pona' = 'ascii';

}
