const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5274";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
    // credentials: "include"   <-- bunu kaldırıyoruz
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}
