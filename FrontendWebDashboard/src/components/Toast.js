import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(id);
  }, [message, onClose, duration]);

  if (!message) return null;
  const bg = type === "error" ? "tomato" : type === "success" ? "seagreen" : "slateblue";

  return (
    <div role="status" aria-live="polite"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        background: bg,
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 2000
      }}>
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: 10,
          background: "rgba(255,255,255,0.2)",
          color: "#fff",
          border: "none",
          padding: "4px 8px",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Close
      </button>
    </div>
  );
}
