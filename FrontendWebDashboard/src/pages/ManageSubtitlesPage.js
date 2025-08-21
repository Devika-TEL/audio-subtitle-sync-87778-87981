import { useEffect, useState } from "react";
import Container from "../components/Container";
import SubtitleEditor from "../components/SubtitleEditor";
import Toast from "../components/Toast";
import { apiGet, apiPostJson, apiDownload } from "../api/client";

export default function ManageSubtitlesPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cues, setCues] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const list = await apiGet("/subtitles");
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEditor = async (id) => {
    try {
      setMessage("");
      const data = await apiGet(`/subtitles/${id}`);
      // Expect { cues: [...] }
      setSelected(id);
      setCues(Array.isArray(data?.cues) ? data.cues : []);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const saveEdits = async () => {
    try {
      await apiPostJson(`/subtitles/${selected}`, { cues });
      setMessage("Saved changes successfully.");
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  };

  return (
    <Container
      title="Manage Subtitles"
      description="View, edit, and download your subtitle files."
      actions={
        selected ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={saveEdits}>💾 Save</button>
            <button className="btn" onClick={() => setSelected(null)}>⬅️ Back to list</button>
            <button className="btn" onClick={() => apiDownload(`/subtitles/${selected}/download`, `subtitle-${selected}.srt`)}>⬇️ Download</button>
          </div>
        ) : null
      }
    >
      {!selected ? (
        <div>
          {items.length === 0 ? <p>No subtitles available.</p> : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {items.map((it) => (
              <div key={it.id} style={{
                border: "1px solid var(--border-color, #e9ecef)",
                borderRadius: 8,
                padding: 12
              }}>
                <div style={{ fontWeight: 600 }}>{it.name || `Subtitle ${it.id}`}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary, #61dafb)" }}>
                  lang: {it.language || "n/a"} • format: {it.format || "n/a"}
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => openEditor(it.id)}>✏️ Edit</button>
                  <button className="btn" onClick={() => apiDownload(`/subtitles/${it.id}/download`, it.name || `subtitle-${it.id}.srt`)}>⬇️ Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <SubtitleEditor initialCues={cues} onChange={setCues} />
        </div>
      )}
      <Toast message={message} onClose={() => setMessage("")} type={message.startsWith("Error") ? "error" : "success"} />
    </Container>
  );
}
