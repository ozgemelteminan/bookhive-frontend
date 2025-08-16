const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5274";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  // Eğer hata dönerse, JSON parse etmeyi dene
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      errorMessage = errJson.message || JSON.stringify(errJson);
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  // Eğer response boşsa (204 No Content) null döndür
  if (res.status === 204) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}
