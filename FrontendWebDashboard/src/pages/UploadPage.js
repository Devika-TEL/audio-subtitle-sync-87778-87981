import { useState } from "react";
import Container from "../components/Container";
import FileDropzone from "../components/FileDropzone";
import Toast from "../components/Toast";
import { apiPostForm } from "../api/client";

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

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
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("video", videoFile);
      if (subtitleFile) fd.append("subtitle", subtitleFile);
      // mode: "quality_check" or "generate"
      fd.append("mode", mode);
      const resp = await apiPostForm("/upload", fd);
      setJobInfo(resp);
      setMessage("Upload successful. Job started.");
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
      title="Upload Video and Subtitles"
      description="Start a quality check or generate subtitles for your video. Optionally include an existing subtitle file for validation and correction."
      actions={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" disabled={!videoFile || busy} onClick={() => submit("quality_check")}>
            ✅ Start Quality Check
          </button>
          <button className="btn" disabled={!videoFile || busy} onClick={() => submit("generate")}>
            ✨ Generate Subtitles
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
        {jobInfo ? (
          <div style={{ marginTop: 8, padding: 12, border: "1px solid var(--border-color, #e9ecef)", borderRadius: 8 }}>
            <strong>Job started:</strong> #{jobInfo.id} ({jobInfo.status})
          </div>
        ) : null}
      </div>
      <Toast message={message} onClose={() => setMessage("")} type={message.startsWith("Error") ? "error" : "info"} />
    </Container>
  );
}
