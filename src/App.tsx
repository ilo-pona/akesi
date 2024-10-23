import React, { useState, useCallback } from "react";
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
  const { settings } = useSettings();

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
