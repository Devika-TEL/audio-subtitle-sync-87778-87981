import { useEffect, useState } from "react";
import { apiGet, apiDownload } from "../api/client";
import ProgressBar from "./ProgressBar";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await apiGet("/jobs");
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load jobs");
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {error ? <div role="alert" style={{ color: "tomato", marginBottom: 8 }}>{error}</div> : null}
      <div role="list" aria-label="Processing jobs">
        {jobs.length === 0 ? <p>No jobs yet.</p> : null}
        {jobs.map((j) => (
          <div role="listitem" key={j.id} style={{
            border: "1px solid var(--border-color, #e9ecef)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 10
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <strong>{j.type || "job"}</strong> • <span>#{j.id}</span>
                <div style={{ fontSize: 12, color: "var(--text-secondary, #61dafb)" }}>
                  status: {j.status}{j.error ? ` • error: ${j.error}` : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {j.download_path ? (
                  <button
                    className="btn"
                    onClick={() => apiDownload(j.download_path, j.output_name || `job-${j.id}.zip`)}
                  >
                    ⬇️ Download
                  </button>
                ) : null}
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <ProgressBar value={j.progress ?? 0} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
