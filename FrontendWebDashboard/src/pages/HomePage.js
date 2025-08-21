import { Link } from "react-router-dom";
import Container from "../components/Container";
import { getApiBaseUrl } from "../api/client";

export default function HomePage() {
  return (
    <Container
      title="Subtitle Quality Check & Repositioning"
      description="Upload your video and optional subtitle file to run QC checks and reposition captions away from burnt-in text. Preview results and download corrected subtitles."
    >
      <div style={{ marginBottom: 16, color: "var(--text-secondary, #61dafb)" }}>
        Backend API: {getApiBaseUrl()}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <Link className="btn" to="/upload">📤 Upload and Start</Link>
      </div>
    </Container>
  );
}
