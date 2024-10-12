import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

type RenderType = 'latin' | 'sitelen_pona';
type FontType = 'nasin_nampa' | 'linja_pona' | 'sitelen_pona_pona';

interface Settings {
  render: RenderType;
  useUCSUR: boolean;
  font: FontType;
  showHints: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = Cookies.get('akesiSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          render: 'latin',
          useUCSUR: false,
          font: 'nasin_nampa',
          showHints: false,
        };
  });

  useEffect(() => {
    Cookies.set('akesiSettings', JSON.stringify(settings), { expires: 365 });
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};