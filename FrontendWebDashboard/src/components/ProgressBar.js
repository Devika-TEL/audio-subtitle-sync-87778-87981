export default function ProgressBar({ value = 0, label }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div aria-label={label || "Progress"} aria-valuenow={pct} role="progressbar"
      aria-valuemin={0} aria-valuemax={100}
      style={{ width: "100%", background: "rgba(0,0,0,0.1)", borderRadius: 8, height: 12 }}>
      <div style={{
        width: `${pct}%`,
        height: "100%",
        background: "var(--text-secondary, #61dafb)",
        borderRadius: 8,
        transition: "width 0.2s ease"
      }} />
    </div>
  );
}
