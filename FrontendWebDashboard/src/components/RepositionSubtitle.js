import React, { useEffect, useMemo, useRef, useState } from "react";
import { repositionSubtitles } from "../services/api";

// Allowed subtitle extensions for user-friendly selection and validation
const ALLOWED_SUB_EXTS = [
  ".srt",
  ".vtt",
  ".ass",
  ".ssa",
  ".scc",
  ".ttml",
  ".dfxp",
  ".sbv",
  ".sub",
  ".txt",
];

// PUBLIC_INTERFACE
export default function RepositionSubtitle() {
  /** Subtitle Repositioning UI component.
   * Provides:
   * - Video and subtitle file selection
   * - Upload and progress tracking to backend /reposition
   * - Error feedback
   * - Download button for the returned subtitle file
   */
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("idle"); // 'idle' | 'uploading' | 'processing' | 'done' | 'error'
  const [error, setError] = useState("");

  const [result, setResult] = useState(null); // { blob, filename, url }
  const abortRef = useRef(null);

  const subtitleAcceptAttr = useMemo(
    () => ALLOWED_SUB_EXTS.join(","),
    []
  );

  useEffect(() => {
    // Cleanup created object URLs to avoid leaks
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const onSelectVideo = (e) => {
    setError("");
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const onSelectSubtitle = (e) => {
    setError("");
    const file = e.target.files?.[0] || null;
    setSubtitleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setProgress(0);
    setStage("uploading");
    setIsUploading(true);

    try {
      const { promise, abort } = repositionSubtitles(
        videoFile,
        subtitleFile,
        ({ percent, stage }) => {
          if (typeof percent === "number") setProgress(percent);
          if (stage) setStage(stage);
        }
      );
      abortRef.current = abort;

      const { blob, filename } = await promise;
      const url = URL.createObjectURL(blob);
      setResult({ blob, filename, url });
      setStage("done");
    } catch (err) {
      setError(err?.message || "Unexpected error occurred.");
      setStage("error");
    } finally {
      setIsUploading(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current();
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setSubtitleFile(null);
    setProgress(0);
    setStage("idle");
    setError("");
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setResult(null);
  };

  const handleDownload = () => {
    if (!result?.url) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.filename || "repositioned_subtitle.srt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isReady = Boolean(videoFile && subtitleFile && !isUploading);

  return (
    <div className="container">
      <div className="card" role="region" aria-label="Subtitle Repositioning">
        <h2 className="title">Subtitle Repositioning</h2>
        <p className="description">
          Upload your video and its subtitle file. The backend will reposition
          subtitles to avoid overlaps with burnt-in text and improve compliance.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label htmlFor="video-input" className="label">
              Video file
            </label>
            <input
              id="video-input"
              type="file"
              accept="video/*"
              onChange={onSelectVideo}
              disabled={isUploading}
              aria-describedby="video-help"
            />
            <div id="video-help" className="help-text">
              Accepted: Any common video format (e.g., mp4, mov, mkv)
            </div>
            {videoFile && (
              <div className="file-name" aria-live="polite">
                Selected: {videoFile.name}
              </div>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="subtitle-input" className="label">
              Subtitle file
            </label>
            <input
              id="subtitle-input"
              type="file"
              accept={subtitleAcceptAttr}
              onChange={onSelectSubtitle}
              disabled={isUploading}
              aria-describedby="subtitle-help"
            />
            <div id="subtitle-help" className="help-text">
              Accepted: {ALLOWED_SUB_EXTS.join(", ")}
            </div>
            {subtitleFile && (
              <div className="file-name" aria-live="polite">
                Selected: {subtitleFile.name}
              </div>
            )}
          </div>

          <div className="actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isReady}
              aria-disabled={!isReady}
            >
              {isUploading ? "Uploading..." : "Reposition Subtitles"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={isUploading && !result}
            >
              Reset
            </button>
            {isUploading && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {(isUploading || stage === "processing") && (
          <div className="progress" aria-live="polite">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progress}
              style={{ width: `${progress}%` }}
            />
            <div className="progress-label">
              {stage === "processing"
                ? "Processing on server..."
                : `Uploading: ${progress}%`}
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {stage === "done" && result && (
          <div className="result-card">
            <div className="result-row">
              <div>
                <div className="result-title">Repositioned subtitle ready</div>
                <div className="result-filename">{result.filename}</div>
              </div>
              <div className="result-actions">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                  Process another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
