import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { fontOptions } from '../config/fontConfig';

const FontLoader: React.FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    const loadFont = async (url: string, fontFamily: string) => {
      const font = new FontFace(fontFamily, `url(${url})`);
      await font.load();
      document.fonts.add(font);
    };

    const selectedFont = fontOptions.find(font => font.value === settings.font);
    if (selectedFont && selectedFont.url) {
      loadFont(selectedFont.url, selectedFont.value);
    }
  }, [settings.font]);

  return null;
};

export default FontLoader;
