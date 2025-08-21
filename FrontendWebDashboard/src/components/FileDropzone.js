import { useRef, useState } from "react";

export default function FileDropzone({ label = "Drag & drop files here, or click to select", onFiles, accept }) {
  const inputRef = useRef(null);
  const [isOver, setIsOver] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length && onFiles) onFiles(files);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length && onFiles) onFiles(files);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        aria-label={label}
        style={{
          border: "2px dashed var(--border-color, #e9ecef)",
          background: isOver ? "rgba(0,0,0,0.05)" : "transparent",
          padding: 24,
          borderRadius: 12,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <strong>{label}</strong>
        <p style={{ margin: "8px 0 0", color: "var(--text-secondary, #61dafb)" }}>
          {accept ? `Accepted: ${accept}` : "Any file"}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        multiple
        onChange={onChange}
        aria-hidden="true"
      />
    </div>
  );
}
