import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import AboutPage from "./pages/AboutPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import SettingsPage from "./pages/SettingsPage";
import FontLoader from "./utils/FontLoader";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { StoriesProvider } from "./contexts/StoriesContext";
import { getFontFamily } from "./config/fontConfig";
import { convertToUCSUR } from "./utils/ucsurConverter";
import { fontOptions, defaultAsciiFont, defaultUcsurFont } from "./config/fontConfig";

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
}

function getInstanceFromUrl(): string {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Check for subdomain
  const subdomain = hostname.split('.')[0];
  if (subdomain !== 'akesi' && subdomain !== 'www') {
    return subdomain;
  }
  
  // Check for path-based instance
  const pathParts = pathname.split('/');
  if (pathParts.length > 1 && pathParts[1]) {
    return pathParts[1];
  }
  
  return 'default';
}

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();
  const [instance] = useState(getInstanceFromUrl());

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const renderText = useCallback(
    (text: string, isEnglish: boolean = false) => {
      if (isEnglish || settings.render === "latin") {
        return <span style={{ fontFamily: "sans-serif" }}>{text}</span>;
      }

      let processedText = text;
      if (settings.render === "sitelen_pona" && settings.useUCSUR) {
        processedText = convertToUCSUR(text);
      }

      return (
        <span style={{ fontFamily: getFontFamily(settings.sitelenPonaFont) }}>
          {processedText}
        </span>
      );
    },
    [settings.render, settings.useUCSUR, settings.sitelenPonaFont]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "\\":
          updateSettings({
            render: settings.render === "latin" ? "sitelen_pona" : "latin",
          });
          break;
        case "u":
          const newUseUCSUR = !settings.useUCSUR;
          const currentFont = fontOptions.find(font => font.value === settings.sitelenPonaFont);
          let newFont = settings.sitelenPonaFont;
          
          if (currentFont) {
            if (newUseUCSUR && !currentFont.ucsurCompatible) {
              newFont = defaultUcsurFont;
            } else if (!newUseUCSUR && !currentFont.asciiCompatible) {
              newFont = defaultAsciiFont;
            }
          }
          
          updateSettings({ useUCSUR: newUseUCSUR, sitelenPonaFont: newFont });
          break;
        case "[":
          cycleFont(-1);
          break;
        case "]":
          cycleFont(1);
          break;
        case "?":
          updateSettings({ showHints: !settings.showHints });
          break;
        default:
          break;
      }
    },
    [settings, updateSettings]
  );

  const cycleFont = useCallback((direction: number) => {
    if (settings.render === 'latin') return; // Do nothing if latin rendering is selected

    const availableFonts = fontOptions.filter(font => 
      (settings.useUCSUR && font.ucsurCompatible) ||
      (!settings.useUCSUR && font.asciiCompatible)
    );

    const currentIndex = availableFonts.findIndex(font => font.value === settings.sitelenPonaFont);
    const newIndex = (currentIndex + direction + availableFonts.length) % availableFonts.length;
    const newFont = availableFonts[newIndex].value;

    updateSettings({ sitelenPonaFont: newFont });
  }, [settings.render, settings.useUCSUR, settings.sitelenPonaFont, updateSettings]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
            <Route path="/create" element={<CreateStoryPage />} />
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
      <StoriesProvider instance={getInstanceFromUrl()}>
        <AppContent />
      </StoriesProvider>
    </SettingsProvider>
  );
}

export default App;
