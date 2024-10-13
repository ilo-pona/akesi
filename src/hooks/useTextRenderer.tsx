import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { getFontFamily } from '../config/fontConfig';
import { convertToUCSUR } from '../utils/ucsurConverter';

export const useTextRenderer = () => {
  const { settings } = useSettings();

  const renderText = useCallback((text: string, isEnglish: boolean = false) => {
    if (isEnglish) {
      return { fontFamily: 'sans-serif', text };
    }
    
    let processedText = text;
    if (settings.render === 'sitelen_pona' && settings.useUCSUR) {
      processedText = convertToUCSUR(text);
    }
    
    return { fontFamily: getFontFamily(settings.font), text: processedText };
  }, [settings.render, settings.useUCSUR, settings.font]);

  return renderText;
};