 /**
  * Simple API client wrapping fetch with JSON handling and environment-based base URL.
  * Uses REACT_APP_API_BASE_URL from environment. The orchestrator should set it in .env.
  */

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  if (!res.ok) {
    let detail = "Request failed";
    try {
      const data = isJson ? await res.json() : await res.text();
      detail = data?.detail || data || res.statusText;
    } catch {
      // ignore
    }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  if (isJson) return res.json();
  return res.blob();
}

// PUBLIC_INTERFACE
export async function apiGet(path, options = {}) {
  /** Perform a GET request to the backend API. */
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPostJson(path, body = {}, options = {}) {
  /** Perform a POST request with JSON body. */
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPostForm(path, formData, options = {}) {
  /** Perform a POST request with multipart/form-data using FormData. */
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiDownload(path, filenameHint = "download") {
  /** Download a file (blob) from the given API path and trigger browser save. */
  const blob = await apiGet(path, { headers: { Accept: "*/*" } });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filenameHint;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL. */
  return API_BASE_URL;
}
