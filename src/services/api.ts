// src/services/api.ts
const BASE = import.meta.env.VITE_API || import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function http(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: "include" });
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // cuerpo vacío, no pasa nada
  }
  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth básicas
  signup: (data: any) => http("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: async (email: string, password: string) => {
    const data = await http("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (data?.token) localStorage.setItem("token", data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    return { ok: true };
  },

  // Perfil
  me: () => http("/api/users/me"),
  updateMe: (data: any) => http("/api/users/me", { method: "PUT", body: JSON.stringify(data) }),
  deleteMe: () => http("/api/users/me", { method: "DELETE" }),

  // Recuperación de contraseña
  forgot: (email: string) => http("/api/auth/forgot", { method: "POST", body: JSON.stringify({ email }) }),

  // OJO: aquí NO va email. Va el token del link y las dos contraseñas.
  reset: (token: string, password: string, confirmPassword: string) =>
    http("/api/auth/reset", { method: "POST", body: JSON.stringify({ token, password, confirmPassword }) }),

  // Cambiar contraseña estando logueado
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    http("/api/users/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    }),

  // endpoints Pexels
  pexels: {
    getPopularVideos: () => http("/api/pexels/videos/popular"),
    searchVideos: (query?: string, terms?: string, per_page: number = 20) => {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (terms) params.append("terms", terms);
      params.append("per_page", String(per_page));
      return http(`/api/pexels/videos/search?${params.toString()}`);
    },
    getVideoById: (id: string | number) => http(`/api/pexels/videos/${id}`),
    healthCheck: () => http("/api/pexels/"),
  },

  favorites: {
    async getAll() {
      return http("/api/favorites");
    },
    async add(video: { id: string; title: string; url: string; thumbnail: string }) {
      return http("/api/favorites", {
        method: "POST",
        body: JSON.stringify(video),
      });
    },
    async remove(id: string) {
      return http(`/api/favorites/${id}`, {
        method: "DELETE",
      });
    },
  },
};
