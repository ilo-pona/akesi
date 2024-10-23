import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import FontLoader from "./utils/FontLoader";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { StoriesProvider } from "./contexts/StoriesContext";
import { getFontFamily } from './config/fontConfig';
import { convertToUCSUR } from "./utils/ucsurConverter";

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const renderText = useCallback((text: string, isEnglish: boolean = false) => {
    if (isEnglish || settings.render === 'latin') {
      return <span style={{ fontFamily: 'sans-serif' }}>{text}</span>;
    }
    
    let processedText = text;
    if (settings.render === 'sitelen_pona' && settings.useUCSUR) {
      processedText = convertToUCSUR(text);
    }
    
    return <span style={{ fontFamily: getFontFamily(settings.sitelenPonaFont) }}>{processedText}</span>;
  }, [settings.render, settings.useUCSUR, settings.sitelenPonaFont]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case '\\':
        updateSettings({ render: settings.render === 'latin' ? 'sitelen_pona' : 'latin' });
        break;
      case 'u':
        updateSettings({ useUCSUR: !settings.useUCSUR });
        break;
      case '[':
        cycleFont(-1);
        break;
      case ']':
        cycleFont(1);
        break;
      case '?':
        updateSettings({ showHints: !settings.showHints });
        break;
      default:
        break;
    }
  }, [settings, updateSettings]);

  const cycleFont = (direction: number) => {
    const fonts = ['nasin-nanpa', 'Fairfax Pona HD', 'linja pona', 'sitelen-pona', 'nasin-sitelen-pu', 'sitelen seli kiwen asuki'];
    const currentIndex = fonts.indexOf(settings.sitelenPonaFont);
    const newIndex = (currentIndex + direction + fonts.length) % fonts.length;
    updateSettings({ sitelenPonaFont: fonts[newIndex] });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Router>
      <FontLoader />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header openSettings={openSettings} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/page/:page" element={<HomePage />} />
            <Route path="/story/:id" element={<StoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        {isSettingsOpen && <SettingsPage onClose={closeSettings} />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <SettingsProvider>
      <StoriesProvider>
        <AppContent />
      </StoriesProvider>
    </SettingsProvider>
  );
}

export default App;
