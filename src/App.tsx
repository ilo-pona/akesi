import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import SettingsPage from "./pages/SettingsPage";
import { SettingsProvider } from "./contexts/SettingsContext";
import { StoriesProvider } from "./contexts/StoriesContext";

function App() {
  return (
    <SettingsProvider>
      <StoriesProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/story/:id" element={<StoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </StoriesProvider>
    </SettingsProvider>
  );
}

export default App;
