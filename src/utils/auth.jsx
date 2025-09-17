// src/utils/auth.js
const USER_KEY = "user";
const TOKEN_KEY = "token";

export function getUser() {
  try { const u = localStorage.getItem(USER_KEY); return u ? JSON.parse(u) : null; }
  catch { return null; }
}
export function setUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function clearAuth() { localStorage.removeItem(USER_KEY); localStorage.removeItem(TOKEN_KEY); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t) { if (t) localStorage.setItem(TOKEN_KEY, t); }
export function isLoggedIn() { return !!getUser(); }
