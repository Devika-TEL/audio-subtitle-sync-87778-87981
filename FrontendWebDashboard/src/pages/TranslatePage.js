import { useEffect, useState } from "react";
import Container from "../components/Container";
import Toast from "../components/Toast";
import { apiGet, apiPostJson } from "../api/client";

const LANGS = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
];

export default function TranslatePage() {
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState("");
  const [targets, setTargets] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const list = await apiGet("/subtitles");
      setSubs(Array.isArray(list) ? list : []);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleLang = (code) => {
    setTargets((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const submit = async () => {
    if (!selected || targets.length === 0) {
      setMessage("Select a source subtitle and at least one target language.");
      return;
    }
    setBusy(true);
    try {
      const resp = await apiPostJson(`/subtitles/${selected}/translate`, { targets });
      setMessage(`Translation job started: #${resp.id}`);
      setTargets([]);
      setSelected("");
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container
      title="Request Translations"
      description="Translate a subtitle file into one or more target languages."
      actions={<button className="btn" onClick={submit} disabled={busy}>🚀 Request Translation</button>}
    >
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label>
            <div>Select source subtitle:</div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border-color, #e9ecef)" }}
            >
              <option value="">-- choose --</option>
              {subs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || `Subtitle ${s.id}`} ({s.language || "n/a"})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <div>Target languages:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {LANGS.map((l) => (
              <label key={l.code} style={{ border: "1px solid var(--border-color, #e9ecef)", padding: "6px 10px", borderRadius: 8 }}>
                <input
                  type="checkbox"
                  checked={targets.includes(l.code)}
                  onChange={() => toggleLang(l.code)}
                  style={{ marginRight: 6 }}
                />
                {l.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <Toast message={message} onClose={() => setMessage("")} type={message.startsWith("Error") ? "error" : "success"} />
    </Container>
  );
}
