export const API_BASE = import.meta.env.VITE_API_BASE || "https://urboven-backend-1.onrender.com";

// Generic GET
async function getJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { Accept: "application/json" }, ...opts });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

export async function fetchProperties({ q = "", page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("search", q);
  params.set("page", String(page));
  params.set("page_size", String(pageSize));
  return getJSON(`${API_BASE}/api/properties/?${params.toString()}`);
}

export async function fetchProperty(id) {
  return getJSON(`${API_BASE}/api/properties/${id}/`);
}


export async function apiRegister({ name, email, password }) {
  const res = await fetch(`${API_BASE}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, email, password, first_name: name || "" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Signup failed");
  }
  return res.json().catch(() => ({}));
}

export async function apiLogin({ email, password }) {
  const res = await fetch(`${API_BASE}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON_STRINGIFY({ username: email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json(); // {access, refresh}
}

export async function apiMe(access) {
  const res = await fetch(`${API_BASE}/api/me/`, { headers: { Authorization: `Bearer ${access}` } });
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}