import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { fontOptions } from '../config/fontConfig';
import { config } from '../config';

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
      const fontUrl = selectedFont.url.startsWith('http') 
        ? selectedFont.url 
        : `${config.fontPrefix}${selectedFont.url}`;
      loadFont(fontUrl, selectedFont.value);
    }
  }, [settings.font]);

  return null;
};

export default FontLoader;
