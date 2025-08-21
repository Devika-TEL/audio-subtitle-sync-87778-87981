import { useEffect, useState } from "react";
import Container from "../components/Container";
import { apiGet } from "../api/client";

export default function AdminPage() {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);

  const load = async () => {
    try {
      const m = await apiGet("/admin/metrics");
      setMetrics(m);
    } catch {
      setMetrics(null);
    }
    try {
      const l = await apiGet("/admin/logs");
      setLogs(Array.isArray(l) ? l : []);
    } catch {
      setLogs([]);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <Container
      title="Admin Dashboard"
      description="System metrics and recent audit events."
    >
      <div style={{ display: "grid", gap: 16 }}>
        <section>
          <h2>Metrics</h2>
          {!metrics ? <p>No metrics available.</p> : (
            <pre style={{ background: "rgba(0,0,0,0.05)", padding: 12, borderRadius: 8, overflow: "auto" }}>
{JSON.stringify(metrics, null, 2)}
            </pre>
          )}
        </section>
        <section>
          <h2>Audit Logs</h2>
          {logs.length === 0 ? <p>No logs.</p> : (
            <ul>
              {logs.map((log, idx) => (
                <li key={idx}>
                  <code>{log.timestamp}</code> — {log.message}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
}
