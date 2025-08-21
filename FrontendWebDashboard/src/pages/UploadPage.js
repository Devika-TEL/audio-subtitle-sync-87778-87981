import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import FileDropzone from "../components/FileDropzone";
import Toast from "../components/Toast";
import { apiPostForm } from "../api/client";

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onVideoFiles = (files) => {
    const vid = files.find((f) => f.type.startsWith("video/") || /\.(mp4|mkv|mov|avi)$/i.test(f.name));
    setVideoFile(vid || null);
  };

  const onSubtitleFiles = (files) => {
    const sub = files.find((f) => /\.(srt|vtt|ass|ssa|dfxp|ttml|sbv)$/i.test(f.name));
    setSubtitleFile(sub || null);
  };

  const submit = async (mode) => {
    if (!videoFile) {
      setMessage("Please select a video file first.");
      return;
    }
    if (!["quality_check", "reposition"].includes(mode)) {
      setMessage("Invalid mode selected.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("video", videoFile);
      if (subtitleFile) fd.append("subtitle", subtitleFile);
      fd.append("mode", mode); // "quality_check" or "reposition"
      const resp = await apiPostForm("/upload", fd);
      // Expect { id, sessionId?, status }
      const sessionId = resp.sessionId || resp.id;
      setMessage("Upload successful. Processing started.");
      // Navigate to preview page for this session
      if (sessionId) navigate(`/preview/${encodeURIComponent(sessionId)}`);
      setSubtitleFile(null);
      setVideoFile(null);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container
      title="Upload for QC/Repositioning"
      description="Upload a video and optional subtitle file to run quality checks or reposition captions away from burnt-in text."
      actions={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" disabled={!videoFile || busy} onClick={() => submit("quality_check")}>
            ✅ Start Quality Check
          </button>
          <button className="btn" disabled={!videoFile || busy} onClick={() => submit("reposition")}>
            🔀 Reposition via Burnt-in Detection
          </button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div>
          <h2>Video</h2>
          <FileDropzone label="Drop a video file here or click to select" onFiles={onVideoFiles} accept="video/*,.mp4,.mov,.mkv,.avi" />
          {videoFile ? <p>Selected: {videoFile.name}</p> : <p>No video selected.</p>}
        </div>
        <div>
          <h2>Subtitle (optional)</h2>
          <FileDropzone label="Drop a subtitle file here or click to select" onFiles={onSubtitleFiles} accept=".srt,.vtt,.ass,.ssa,.dfxp,.ttml,.sbv" />
          {subtitleFile ? <p>Selected: {subtitleFile.name}</p> : <p>No subtitle selected.</p>}
        </div>
      </div>
      <Toast message={message} onClose={() => setMessage("")} type={message.startsWith("Error") ? "error" : "info"} />
    </Container>
  );
}
