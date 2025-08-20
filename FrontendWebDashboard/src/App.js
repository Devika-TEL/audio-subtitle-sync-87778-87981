import React, { useEffect, useState } from "react";
import "./App.css";
import RepositionSubtitle from "./components/RepositionSubtitle";

// PUBLIC_INTERFACE
function App() {
  /** Root App component wiring theme toggling and hosting the feature page. */
  const [theme, setTheme] = useState("light");

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark theme. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <div className="hero">
          <h1 className="title">Audio-Subtitle Sync Dashboard</h1>
          <p className="subtitle">
            Reposition subtitles to avoid overlap and improve compliance
          </p>
        </div>

        <RepositionSubtitle />
      </header>
    </div>
  );
}

export default App;
