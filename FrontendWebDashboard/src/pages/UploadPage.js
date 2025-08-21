import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import FileDropzone from "../components/FileDropzone";
import Toast from "../components/Toast";
import { apiPostForm, apiGet } from "../api/client";

/**
 * UploadPage
 * Allows selecting a video and optional subtitle file then triggers backend processing
 * via /upload with mode = "quality_check" or "reposition".
 * On success, navigates to preview page to see overlays and updated cues.
 */
export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastMode, setLastMode] = useState(null);
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  // Test connectivity with backend /api/hello endpoint and show result in a toast.
  const testBackend = async () => {
    try {
      const res = await apiGet("/api/hello");
      // Expecting a JSON like { message: "..." } or a string
      const msg = typeof res === "string" ? res : res?.message || "OK";
      setMessage(`Backend says: ${msg}`);
    } catch (e) {
      setMessage(`Error contacting backend: ${e.message}`);
    }
  };

  const onVideoFiles = (files) => {
    const vid = files.find(
      (f) => f.type.startsWith("video/") || /\.(mp4|mkv|mov|avi|webm)$/i.test(f.name)
    );
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
    setLastMode(mode);
    try {
      const fd = new FormData();
      fd.append("video", videoFile, videoFile.name);
      if (subtitleFile) fd.append("subtitle", subtitleFile, subtitleFile.name);
      fd.append("mode", mode); // "quality_check" or "reposition"

      // PUBLIC_INTERFACE
      // The /upload endpoint is expected to return { id, sessionId?, status }
      const resp = await apiPostForm("/upload", fd);
      const sessionId = resp?.sessionId || resp?.id;
      if (!sessionId) {
        throw new Error("No sessionId returned from server.");
      }
      setMessage(
        `Upload successful. ${mode === "reposition" ? "Repositioning" : "Quality check"} job started.`
      );

      // Navigate to preview page for this session
      navigate(`/preview/${encodeURIComponent(sessionId)}`);
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
          <button
            className="btn"
            aria-label="Start Quality Check"
            disabled={!videoFile || busy}
            onClick={() => submit("quality_check")}
          >
            ✅ Start Quality Check
          </button>
          <button
            className="btn"
            aria-label="Start Repositioning"
            disabled={!videoFile || busy}
            onClick={() => submit("reposition")}
          >
            🔀 Reposition via Burnt-in Detection
          </button>
          <button
            className="btn"
            aria-label="Test Backend connectivity"
            onClick={testBackend}
            disabled={busy}
            title="Calls /api/hello on the backend and displays the response."
          >
            🧪 Test Backend
          </button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>Video</h2>
          <FileDropzone
            label="Drop a video file here or click to select"
            onFiles={onVideoFiles}
            accept="video/*,.mp4,.mov,.mkv,.avi,.webm"
          />
          {videoFile ? (
            <p aria-live="polite">Selected: {videoFile.name}</p>
          ) : (
            <p aria-live="polite">No video selected.</p>
          )}
        </div>
        <div>
          <h2 style={{ marginBottom: 8 }}>Subtitle (optional)</h2>
          <FileDropzone
            label="Drop a subtitle file here or click to select"
            onFiles={onSubtitleFiles}
            accept=".srt,.vtt,.ass,.ssa,.dfxp,.ttml,.sbv"
          />
          {subtitleFile ? (
            <p aria-live="polite">Selected: {subtitleFile.name}</p>
          ) : (
            <p aria-live="polite">No subtitle selected.</p>
          )}
        </div>
      </div>
      <div style={{ marginTop: 8, color: "gray", fontSize: 14 }}>
        {busy
          ? `Uploading and starting ${lastMode || "job"}…`
          : "Choose a mode to start processing after selecting your files."}
      </div>
      <Toast
        message={message}
        onClose={() => setMessage("")}
        type={message.startsWith("Error") ? "error" : "info"}
      />
    </Container>
  );
}
