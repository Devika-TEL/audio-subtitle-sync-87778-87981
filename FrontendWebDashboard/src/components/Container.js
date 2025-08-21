export default function Container({ title, description, actions, children }) {
  return (
    <section className="container" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      {title ? (
        <header style={{ marginBottom: 12 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>{title}</h1>
          {description ? (
            <p style={{ marginTop: 6, color: "var(--text-secondary, #61dafb)" }}>{description}</p>
          ) : null}
          {actions ? <div style={{ marginTop: 8 }}>{actions}</div> : null}
        </header>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
