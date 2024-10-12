import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import { SettingsProvider } from "./contexts/SettingsContext";
import { StoriesProvider } from "./contexts/StoriesContext";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsProvider>
      <StoriesProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header openSettings={openSettings} />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/newest" element={<HomePage />} />
                <Route path="/" element={<Navigate to="/newest" replace />} />
                <Route path="/story/:id" element={<StoryPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
            {isSettingsOpen && <SettingsPage onClose={closeSettings} />}
          </div>
        </Router>
      </StoriesProvider>
    </SettingsProvider>
  );
}

export default App;
