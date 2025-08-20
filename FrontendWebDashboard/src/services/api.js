//
// API service for interacting with the BackendService
//

// PUBLIC_INTERFACE
export function getBackendBaseUrl() {
  /** Get backend base URL from environment for configuring API requests.
   * This reads REACT_APP_BACKEND_BASE_URL from the environment if set.
   * If not provided, it falls back to same-origin requests.
   */
  const envUrl =
    process.env.REACT_APP_BACKEND_BASE_URL ||
    // Optional runtime injection (if hosting injects window var)
    (typeof window !== "undefined" && window.REACT_APP_BACKEND_BASE_URL) ||
    "";

  // Return empty string to use same-origin when not provided.
  return (envUrl || "").trim();
}

/**
 * Join base URL and path segments ensuring there is only one slash.
 */
function joinUrl(base, path) {
  if (!base) return path;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = path.startsWith("/") ? path : `/${path}`;
  return `${baseClean}${pathClean}`;
}

/**
 * Attempt to extract filename from Content-Disposition header.
 */
function extractFilenameFromDisposition(disposition) {
  if (!disposition) return null;
  // content-disposition: attachment; filename="name.srt"
  const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(disposition);
  if (match && match[1]) {
    try {
      // Decode RFC5987 encoding if present
      return decodeURIComponent(match[1].replace(/\"/g, ""));
    } catch {
      return match[1].replace(/\"/g, "");
    }
  }
  return null;
}

/**
 * Read a blob as text (for error responses).
 */
function readBlobAsText(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsText(blob);
  });
}

// PUBLIC_INTERFACE
export function repositionSubtitles(videoFile, subtitleFile, onProgress) {
  /** Upload video and subtitle to backend /reposition endpoint with progress events.
   *
   * Args:
   * - videoFile: File object of the source video (required)
   * - subtitleFile: File object of the subtitle to be repositioned (required)
   * - onProgress: function(progress: { percent: number, stage: 'uploading'|'processing' }) (optional)
   *
   * Returns:
   *   { promise, abort }
   *   - promise resolves to { blob, filename } where blob is the repositioned subtitle file data.
   *   - abort() cancels the in-flight request.
   *
   * Notes:
   * - Uses XMLHttpRequest to support upload progress events.
   * - Backend base URL is configured via REACT_APP_BACKEND_BASE_URL; falls back to same-origin.
   */
  if (!videoFile || !subtitleFile) {
    throw new Error("Both video and subtitle files are required.");
  }

  const baseUrl = getBackendBaseUrl();
  const url = joinUrl(baseUrl, "/reposition");

  const formData = new FormData();
  formData.append("video", videoFile, videoFile.name);
  formData.append("subtitle", subtitleFile, subtitleFile.name);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType = "blob";

  // Track upload progress
  if (xhr.upload && typeof onProgress === "function") {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress({ percent, stage: "uploading" });
        // When upload reaches 100%, backend may still process
        if (percent >= 100) {
          onProgress({ percent, stage: "processing" });
        }
      }
    };
  }

  const promise = new Promise((resolve, reject) => {
    xhr.onload = async () => {
      const status = xhr.status;
      if (status >= 200 && status < 300) {
        const disposition = xhr.getResponseHeader("Content-Disposition");
        const contentType = xhr.getResponseHeader("Content-Type") || "";
        let filename =
          extractFilenameFromDisposition(disposition) ||
          // If we can't infer, use the original subtitle extension
          (subtitleFile && subtitleFile.name
            ? `repositioned_${subtitleFile.name}`
            : contentType.includes("vtt")
            ? "repositioned_subtitle.vtt"
            : "repositioned_subtitle.srt");

        resolve({ blob: xhr.response, filename });
      } else {
        let message = `Upload failed with status ${status}`;
        try {
          const text = await readBlobAsText(xhr.response);
          if (text) {
            message = `${message}: ${text}`;
          }
        } catch {
          // ignore parse errors
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload. Please try again."));
    };
    xhr.onabort = () => {
      reject(new Error("Upload was cancelled by the user."));
    };

    try {
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });

  const abort = () => {
    try {
      xhr.abort();
    } catch {
      // ignore
    }
  };

  return { promise, abort };
}
