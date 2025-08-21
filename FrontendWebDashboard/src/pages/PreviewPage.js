import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/Container";
import Toast from "../components/Toast";
import { apiGet, apiDownload } from "../api/client";

/**
 * PreviewPage
 * - Fetches preview metadata, updated cues, and burnt-in detections for a session
 * - Renders a video element and overlays:
 *   - current subtitle text (basic rendering)
 *   - burnt-in detection boxes (as semi-transparent red rectangles)
 * - Allows downloading the corrected/repositioned subtitle file
 */
export default function PreviewPage() {
  const { sessionId } = useParams();
  const videoRef = useRef(null);
  const [message, setMessage] = useState("");
  const [meta, setMeta] = useState(null);
  const [cues, setCues] = useState([]);
  const [detections, setDetections] = useState([]); // [{ start, end, boxes: [{ x, y, w, h }] }]
  const [currentCue, setCurrentCue] = useState(null);

  // Fetch metadata and data
  const load = useCallback(async () => {
    try {
      const m = await apiGet(`/preview/${encodeURIComponent(sessionId)}`);
      setMeta(m || null);
    } catch (e) {
      setMessage(`Error loading preview: ${e.message}`);
    }
    try {
      const c = await apiGet(`/sessions/${encodeURIComponent(sessionId)}/subtitles`);
      setCues(Array.isArray(c?.cues) ? c.cues : []);
    } catch (e) {
      // In preview, cues might not yet be ready for some time; don't spam an error
    }
    try {
      const d = await apiGet(`/sessions/${encodeURIComponent(sessionId)}/detections`);
      setDetections(Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : []);
    } catch (e) {
      // Same rationale as above
    }
  }, [sessionId]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  // Helpers to parse SRT-like timestamps "HH:MM:SS,mmm"
  const parseTime = useCallback((s) => {
    if (!s || typeof s !== "string") return 0;
    const m = s.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
    if (!m) return 0;
    const [, hh, mm, ss, ms] = m.map(Number);
    return hh * 3600 + mm * 60 + ss + ms / 1000;
  }, []);

  const simpleCues = useMemo(() => {
    // Normalize cues into { startSec, endSec, text }
    return cues.map((c) => ({
      startSec: typeof c.start === "number" ? c.start : parseTime(c.start),
      endSec: typeof c.end === "number" ? c.end : parseTime(c.end),
      text: c.text || "",
    }));
  }, [cues, parseTime]);

  // Track current cue with timeupdate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handler = () => {
      const t = video.currentTime || 0;
      const cur = simpleCues.find((c) => t >= c.startSec && t <= c.endSec) || null;
      setCurrentCue(cur);
    };
    video.addEventListener("timeupdate", handler);
    return () => video.removeEventListener("timeupdate", handler);
  }, [simpleCues]);

  // Determine current detections (show any detection intersecting current time)
  const currentBoxes = useMemo(() => {
    const video = videoRef.current;
    if (!video) return [];
    const t = video.currentTime || 0;
    const list = detections.filter((d) => {
      const start = typeof d.start === "number" ? d.start : parseTime(d.start);
      const end = typeof d.end === "number" ? d.end : parseTime(d.end);
      return t >= start && t <= end;
    });
    return list.flatMap((d) => d.boxes || []);
  }, [detections, parseTime]);

  const onDownload = async () => {
    try {
      await apiDownload(`/sessions/${encodeURIComponent(sessionId)}/download`, `session-${sessionId}.srt`);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  };

  return (
    <Container
      title="Preview"
      description="Video playback with subtitle overlay and burnt-in detections."
      actions={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={onDownload}>⬇️ Download Corrected Subtitles</button>
        </div>
      }
    >
      {!meta ? <p>Loading session…</p> : (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
            <video
              ref={videoRef}
              controls
              src={meta.video_url || meta.video || meta.stream_url}
              style={{ width: "100%", borderRadius: 8, background: "black" }}
            />
            {/* Overlay container */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
              }}
            >
              {/* Burnt-in detection boxes */}
              {currentBoxes.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: `${(b.x || 0) * 100}%`,
                    top: `${(b.y || 0) * 100}%`,
                    width: `${(b.w || 0) * 100}%`,
                    height: `${(b.h || 0) * 100}%`,
                    border: "2px solid rgba(255,0,0,0.8)",
                    background: "rgba(255,0,0,0.15)",
                    borderRadius: 4,
                  }}
                  title="Burnt-in detection"
                />
              ))}

              {/* Simple subtitle text overlay (bottom center) */}
              {currentCue?.text ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "6%",
                    transform: "translateX(-50%)",
                    maxWidth: "90%",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 6,
                    textAlign: "center",
                    lineHeight: 1.4,
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                  }}
                >
                  {currentCue.text}
                </div>
              ) : null}
            </div>
          </div>
          {/* Info */}
          <div style={{ color: "var(--text-secondary, #61dafb)" }}>
            <div>Session: <code>{sessionId}</code></div>
            <div>Detections loaded: {detections.length}</div>
            <div>Cues loaded: {cues.length}</div>
          </div>
        </div>
      )}
      <Toast message={message} onClose={() => setMessage("")} type={message.startsWith("Error") ? "error" : "info"} />
    </Container>
  );
}
