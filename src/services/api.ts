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

  /** Métodos para gestionar videos favoritos del usuario */
  favorites: {
    /**
     * Obtiene todos los videos favoritos del usuario actual
     * @returns {Promise<Array<{id: string, title: string, url: string, thumbnail: string}>>} Lista de videos favoritos
     */
    async getAll() {
      return http("/api/favorites");
    },

    /**
     * Añade un video a favoritos
     * @param {Object} video - Información del video a añadir
     * @param {string} video.id - ID único del video
     * @param {string} video.title - Título del video
     * @param {string} video.url - URL del video
     * @param {string} video.thumbnail - URL de la miniatura del video
     * @returns {Promise<{id: string, success: boolean}>} Resultado de la operación
     */
    async add(video: { id: string; title: string; url: string; thumbnail: string }) {
      return http("/api/favorites", {
        method: "POST",
        body: JSON.stringify(video),
      });
    },

    /**
     * Elimina un video de favoritos
     * @param {string} id - ID del video a eliminar de favoritos
     * @returns {Promise<{success: boolean}>} Resultado de la operación
     */
    async remove(id: string) {
      return http(`/api/favorites/${id}`, {
        method: "DELETE",
      });
    },
  },

  /** Métodos para gestionar comentarios en videos */
  comments: {
    /**
     * Obtiene todos los comentarios de un video específico
     * @param {string} videoId - ID del video del cual obtener los comentarios
     * @returns {Promise<Array<{id: string, content: string, userId: string, createdAt: string}>>} Lista de comentarios
     */
    getByVideo: (videoId: string) => http(`/api/comments/${videoId}`),

    /**
     * Añade un nuevo comentario a un video
     * @param {Object} data - Datos del comentario
     * @param {string} data.videoId - ID del video a comentar
     * @param {string} data.content - Contenido del comentario
     * @returns {Promise<{id: string, content: string, userId: string, createdAt: string}>} Comentario creado
     */
    add: (data: { videoId: string; content: string }) =>
      http(`/api/comments`, { method: "POST", body: JSON.stringify(data) }),

    /**
     * Actualiza un comentario existente
     * @param {string} id - ID del comentario a actualizar
     * @param {Object} data - Nuevos datos del comentario
     * @param {string} data.content - Nuevo contenido del comentario
     * @returns {Promise<{id: string, content: string, userId: string, updatedAt: string}>} Comentario actualizado
     */
    update: (id: string, data: { content: string }) =>
      http(`/api/comments/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    /**
     * Elimina un comentario
     * @param {string} id - ID del comentario a eliminar
     * @returns {Promise<{success: boolean}>} Resultado de la operación
     */
    remove: (id: string) =>
      http(`/api/comments/${id}`, { method: "DELETE" }),
  },
};
