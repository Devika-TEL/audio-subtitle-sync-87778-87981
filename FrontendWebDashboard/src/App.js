import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import JobsPage from "./pages/JobsPage";
import ManageSubtitlesPage from "./pages/ManageSubtitlesPage";
import TranslatePage from "./pages/TranslatePage";
import AdminPage from "./pages/AdminPage";

// PUBLIC_INTERFACE
function App() {
  /** Root app component setting up routing, theme toggling, and layout. */
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme and apply to document element. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header" style={{ minHeight: "auto", paddingBottom: 40 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <Navbar />
        </header>
        <main style={{ paddingTop: 12, paddingBottom: 40 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/manage" element={<ManageSubtitlesPage />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
