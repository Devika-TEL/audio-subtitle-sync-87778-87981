import { Link } from "react-router-dom";
import Container from "../components/Container";
import { getApiBaseUrl } from "../api/client";

export default function HomePage() {
  return (
    <Container
      title="Audio-Subtitle Sync Platform"
      description="Upload videos, validate and correct subtitles, generate and translate captions, and manage your assets."
    >
      <div style={{ marginBottom: 16, color: "var(--text-secondary, #61dafb)" }}>
        Backend API: {getApiBaseUrl()}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <Link className="btn" to="/upload">📤 Upload</Link>
        <Link className="btn" to="/jobs">📈 Jobs</Link>
        <Link className="btn" to="/manage">🗂️ Manage Subtitles</Link>
        <Link className="btn" to="/translate">🌐 Translate</Link>
        <Link className="btn" to="/admin">🛠️ Admin</Link>
      </div>
    </Container>
  );
}
