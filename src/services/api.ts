const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function http(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.message || `HTTP ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

export const api = {
  signup: (data: any) => http("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: async (email: string, password: string) => {
    const data = await http("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("token", data.token);
    return data;
  },
  me: () => http("/api/users/me"),
  updateMe: (data: any) => http("/api/users/me", { method: "PUT", body: JSON.stringify(data) }),
  deleteMe: () => http("/api/users/me", { method: "DELETE" }),
  forgot: (email: string) => http("/api/auth/forgot", { method: "POST", body: JSON.stringify({ email }) }),
  reset: (email: string, token: string, newPassword: string) =>
    http("/api/auth/reset", { method: "POST", body: JSON.stringify({ email, token, newPassword }) }),
  logout: () => { localStorage.removeItem("token"); return { ok: true }; }
};
