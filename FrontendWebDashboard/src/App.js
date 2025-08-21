import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";

// PUBLIC_INTERFACE
function App() {
  /** Root app component setting up routing and minimal layout for QC/Repositioning only. */
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header" style={{ minHeight: "auto", paddingBottom: 16 }}>
          <Navbar />
        </header>
        <main style={{ paddingTop: 12, paddingBottom: 40 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/preview/:sessionId" element={<PreviewPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
