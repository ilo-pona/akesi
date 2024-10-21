import React, { useEffect, useState, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { fontOptions, defaultAsciiFont, defaultUcsurFont, defaultEnglishFont } from '../config/fontConfig';
import { config } from '../config';

const FontLoader: React.FC = () => {
  const { settings } = useSettings();
  const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

  const loadFont = useCallback(async (url: string, fontFamily: string) => {
    if (loadedFonts.includes(fontFamily)) {
      console.log(`Font already loaded: ${fontFamily}`);
      return;
    }
    console.log(`Attempting to load font: ${fontFamily} from ${url}`);
    try {
      const font = new FontFace(fontFamily, `url(${url})`);
      await font.load();
      document.fonts.add(font);
      console.log(`Font loaded successfully: ${fontFamily}`);
      setLoadedFonts(prev => [...prev, fontFamily]);
    } catch (error) {
      console.error(`Error loading font ${fontFamily}:`, error);
    }
  }, [loadedFonts]);

  const loadSelectedFont = useCallback((fontSetting: string) => {
    const selectedFont = fontOptions.find(font => font.value === fontSetting);
    if (selectedFont) {
      if (selectedFont.url) {
        const fontUrl = selectedFont.url.startsWith('http') 
          ? selectedFont.url 
          : `${config.fontPrefix}${selectedFont.url}`;
        loadFont(fontUrl, selectedFont.value);
      } else {
        console.log(`Skipping font load for system font: ${selectedFont.value}`);
      }
    } else {
      console.warn(`Font not found for setting: ${fontSetting}`);
    }
  }, [loadFont]);

  useEffect(() => {
    const fontsToLoad = new Set([
      defaultAsciiFont,
      defaultUcsurFont,
      settings.sitelenPonaFont
    ]);

    fontsToLoad.forEach(font => loadSelectedFont(font));
  }, [settings.sitelenPonaFont, loadSelectedFont]);

  useEffect(() => {
    console.log('Currently loaded fonts:', loadedFonts);
  }, [loadedFonts]);

  return null;
};

export default FontLoader;
