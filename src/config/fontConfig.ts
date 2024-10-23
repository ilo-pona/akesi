export interface FontOption {
  value: string;
  label: string;
  ucsurCompatible: boolean;
  asciiCompatible: boolean;
  englishCompatible: boolean;
  url: string | null;
  creator: string | null;
  link: string | null;
}

export const fontOptions: FontOption[] = [
  {
    value: "nasin-nanpa",
    label: "nasin nanpa",
    ucsurCompatible: true,
    asciiCompatible: true,
    englishCompatible: false,
    url: "nasin-nanpa-4.0.1.otf",
    creator: "ETBCOR",
    link: "https://github.com/ETBCOR/nasin-nanpa",
  },
  {
    value: "Fairfax Pona HD",
    label: "Fairfax Pona HD",
    ucsurCompatible: true,
    asciiCompatible: true,
    englishCompatible: false,
    url: "FairfaxPonaHD.ttf",
    creator: "Kreative Korporation",
    link: "https://www.kreativekorp.com/software/fonts/fairfaxhd",
  },
  {
    value: "linja pona",
    label: "linja pona",
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
    url: "linja-pona-4.9.otf",
    creator: "jan Same",
    link: "https://github.com/janSame/linja-pona",
  },
  {
    value: "sitelen-pona",
    label: "sitelen pona pona",
    ucsurCompatible: false,
    asciiCompatible: true,
    englishCompatible: false,
    url: "sitelen-pona-pona.otf",
    creator: "Jack Humbert",
    link: "https://jackhumbert.github.io/sitelen-pona-pona/",
  },
  {
    value: "nasin-sitelen-pu",
    label: "nasin sitelen pu mono",
    ucsurCompatible: true,
    asciiCompatible: true,
    englishCompatible: false,
    url: "NasinSitelenPuMono.otf",
    creator: "Lipu Linku",
    link: "https://github.com/lipu-linku/nasin-sitelen",
  },
  {
    value: "sitelen seli kiwen asuki",
    label: "sitelen seli kiwen asuki",
    ucsurCompatible: true,
    asciiCompatible: true,
    englishCompatible: false,
    url: "sitelenselikiwenasuki.ttf",
    creator: "Kreative Korporation",
    link: "https://github.com/kreativekorp/sitelen-seli-kiwen",
  },
  {
    value: "sans_serif",
    label: "Sans Serif",
    ucsurCompatible: false,
    asciiCompatible: false,
    englishCompatible: true,
    url: null,
    creator: null,
    link: null,
  },
];

export const defaultAsciiFont = "nasin-nanpa";
export const defaultUcsurFont = "nasin-nanpa";
export const defaultEnglishFont = "sans_serif";

export const defaultRenderMode: "ascii" | "sitelen_pona" = "ascii";

export function getFontFamily(font: string): string {
  const selectedFont = fontOptions.find((option) => option.value === font);
  return selectedFont ? selectedFont.value : "sans-serif";
}
