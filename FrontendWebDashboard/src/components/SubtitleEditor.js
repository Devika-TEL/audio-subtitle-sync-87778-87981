import { useEffect, useRef, useState } from "react";

/**
 * A minimal, accessible subtitle editor that supports:
 * - listing cues
 * - editing text
 * - adjusting start/end (text inputs)
 * It expects a simple cues structure: [{ id, start, end, text }]
 */
export default function SubtitleEditor({ initialCues = [], onChange }) {
  const [cues, setCues] = useState(initialCues);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onChange && onChange(cues);
  }, [cues, onChange]);

  const updateCue = (idx, patch) => {
    setCues((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const addCue = () => {
    setCues((prev) => [
      ...prev,
      { id: crypto.randomUUID(), start: "00:00:00,000", end: "00:00:01,000", text: "" },
    ]);
  };

  const deleteCue = (idx) => {
    setCues((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button className="btn" onClick={addCue}>➕ Add cue</button>
      </div>
      <div>
        {cues.length === 0 ? <p>No cues yet.</p> : null}
        {cues.map((cue, idx) => (
          <div key={cue.id || idx}
               style={{
                 border: "1px solid var(--border-color, #e9ecef)",
                 borderRadius: 8,
                 padding: 10,
                 marginBottom: 8
               }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <label>
                <span style={{ display: "block", fontSize: 12 }}>Start</span>
                <input
                  aria-label="Cue start"
                  value={cue.start}
                  onChange={(e) => updateCue(idx, { start: e.target.value })}
                  style={{ padding: 6, borderRadius: 6, border: "1px solid var(--border-color, #e9ecef)" }}
                />
              </label>
              <label>
                <span style={{ display: "block", fontSize: 12 }}>End</span>
                <input
                  aria-label="Cue end"
                  value={cue.end}
                  onChange={(e) => updateCue(idx, { end: e.target.value })}
                  style={{ padding: 6, borderRadius: 6, border: "1px solid var(--border-color, #e9ecef)" }}
                />
              </label>
              <div style={{ marginLeft: "auto" }}>
                <button className="btn" onClick={() => deleteCue(idx)}>🗑️ Delete</button>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <textarea
                aria-label="Cue text"
                rows={3}
                value={cue.text}
                onChange={(e) => updateCue(idx, { text: e.target.value })}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid var(--border-color, #e9ecef)",
                  fontFamily: "inherit"
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
