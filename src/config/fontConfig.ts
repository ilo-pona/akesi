export interface FontOption {
  value: string;
  label: string;
  ucsurCompatible: boolean;
  asciiCompatible: boolean;
  englishCompatible: boolean;
  url: string | null;
}

export const fontOptions: FontOption[] = [
  {
    value: "nasin-nanpa",
    label: "nasin nanpa",
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
    url: "/fonts/nasin-nanpa-4.0.1-UCSUR.otf",
  },
  {
    value: "Fairfax Pona HD",
    label: "Fairfax Pona HD",
    ucsurCompatible: true,
    asciiCompatible: true,
    englishCompatible: false,
    url: "http://localhost:8002/fonts/FairfaxPonaHD.ttf"
  },
  {
    value: "linjapona-Regular",
    label: "linja pona",
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
    url: "/fonts/linja-pona-4.9.otf",
  },
  {
    value: "sitelen pona pona",
    label: "sitelen pona pona",
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
    url: "/fonts/sitelen-pona-pona.otf",
  },
  {
    value: "sans_serif",
    label: "Sans Serif",
    ucsurCompatible: false,
    asciiCompatible: false,
    englishCompatible: true,
    url: null,
  },
];

export const defaultAsciiFont = "nasin nanpa";
export const defaultUcsurFont = "Fairfax Pona HD";
export const defaultEnglishFont = "sans_serif";

export const defaultRenderMode: "ascii" | "sitelen_pona" = "ascii";

export function getFontClass(font: string): string {
  switch (font) {
    case "nasin_nanpa":
      return "font-nasin-nanpa";
    case "Fairfax Pona HD":
      return "font-fairfax-pona-hd";
    case "linjapona-Regular":
      return "font-linja-pona";
    case "sitelen pona pona":
      return "font-sitelen-pona-pona";
    default:
      return "font-sans";
  }
}

export function getFontFamily(font: string): string {
  const selectedFont = fontOptions.find(option => option.value === font);
  return selectedFont ? selectedFont.value : 'sans-serif';
}
