import { Link } from "react-router-dom";
import Container from "../components/Container";
import { getApiBaseUrl, apiGet } from "../api/client";
import { useState } from "react";
import Toast from "../components/Toast";

export default function HomePage() {
  const [message, setMessage] = useState("");

  const testConnectivity = async () => {
    try {
      const res = await apiGet("/api/hello");
      const msg = typeof res === "string" ? res : res?.message || "OK";
      setMessage(`Backend connectivity OK: ${msg}`);
    } catch (e) {
      setMessage(
        `Failed to contact backend at ${getApiBaseUrl()}: ${e.message}. ` +
          "Ensure REACT_APP_API_BASE_URL in .env points to your backend (e.g., http://localhost:3001)."
      );
    }
  };

  return (
    <Container
      title="Subtitle Quality Check & Repositioning"
      description="Upload your video and optional subtitle file to run QC checks and reposition captions away from burnt-in text. Preview results and download corrected subtitles."
      actions={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={testConnectivity} aria-label="Test Backend">
            🧪 Test Backend
          </button>
        </div>
      }
    >
      <div style={{ marginBottom: 16, color: "var(--text-secondary, #61dafb)" }}>
        Backend API: <code>{getApiBaseUrl()}</code>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <Link className="btn" to="/upload">📤 Upload and Start</Link>
      </div>
      <Toast
        message={message}
        onClose={() => setMessage("")}
        type={message.startsWith("Failed") ? "error" : "info"}
      />
    </Container>
  );
}
