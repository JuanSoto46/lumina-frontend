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

  /** Methods for managing user's favorite videos */
  favorites: {
    /**
     * Retrieves all favorite videos for the current user
     * @returns {Promise<Array<{id: string, title: string, url: string, thumbnail: string}>>} List of favorite videos
     */
    async getAll() {
      return http("/api/favorites");
    },

    /**
     * Adds a video to favorites
     * @param {Object} video - Information about the video to add
     * @param {string} video.id - Unique identifier of the video
     * @param {string} video.title - Title of the video
     * @param {string} video.url - URL of the video
     * @param {string} video.thumbnail - URL of the video thumbnail
     * @returns {Promise<{id: string, success: boolean}>} Operation result
     */
    async add(video: { id: string; title: string; url: string; thumbnail: string }) {
      return http("/api/favorites", {
        method: "POST",
        body: JSON.stringify(video),
      });
    },

    /**
     * Removes a video from favorites
     * @param {string} id - ID of the video to remove from favorites
     * @returns {Promise<{success: boolean}>} Operation result
     */
    async remove(id: string) {
      return http(`/api/favorites/${id}`, {
        method: "DELETE",
      });
    },
  },

  /** Methods for managing video comments */
  comments: {
    /**
     * Retrieves all comments for a specific video
     * @param {string} videoId - ID of the video to get comments from
     * @returns {Promise<Array<{id: string, content: string, userId: string, createdAt: string}>>} List of comments
     */
    getByVideo: (videoId: string) => http(`/api/comments/${videoId}`),

    /**
     * Adds a new comment to a video
     * @param {Object} data - Comment data
     * @param {string} data.videoId - ID of the video to comment on
     * @param {string} data.content - Content of the comment
     * @returns {Promise<{id: string, content: string, userId: string, createdAt: string}>} Created comment
     */
    add: (data: { videoId: string; content: string }) =>
      http(`/api/comments`, { method: "POST", body: JSON.stringify(data) }),

    /**
     * Updates an existing comment
     * @param {string} id - ID of the comment to update
     * @param {Object} data - New comment data
     * @param {string} data.content - New content for the comment
     * @returns {Promise<{id: string, content: string, userId: string, updatedAt: string}>} Updated comment
     */
    update: (id: string, data: { content: string }) =>
      http(`/api/comments/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    /**
     * Deletes a comment
     * @param {string} id - ID of the comment to delete
     * @returns {Promise<{success: boolean}>} Operation result
     */
    remove: (id: string) =>
      http(`/api/comments/${id}`, { method: "DELETE" }),
  },

  ratings: {
    /**
     * Methods for managing video ratings
     */
    /**
     * Submit a rating for a video by the current user.
     * @param {string} videoId - ID of the video being rated
     * @param {number} rating - Rating value (1-5)
     * @returns {Promise<any>} Server response (usually contains success flag or the saved rating)
     */
    async rateVideo(videoId: string, rating: number) {
      return http("/api/ratings", {
        method: "POST",
        body: JSON.stringify({ videoId, rating }),
      });
    },

    /**
     * Get the average rating for a video across all users.
     * @param {string} videoId - ID of the video
     * @returns {Promise<{average: number}>} Object with `average` field (number)
     */
    async getAverage(videoId: string) {
      return http(`/api/ratings/${videoId}`);
    },

    /**
     * Get the current user's rating for a given video.
     * @param {string} videoId - ID of the video
     * @returns {Promise<{rating: number}>} Object with `rating` field (number, 0 if none)
     */
    async getUserRating(videoId: string) { 
      return http(`/api/ratings/${videoId}/user`);
    },

    /**
     * Remove the current user's rating for a video.
     * @param {string} videoId - ID of the video
     * @returns {Promise<any>} Server response (usually success flag)
     */
    async removeUserRating(videoId: string) { 
      return http(`/api/ratings/${videoId}`, { method: "DELETE" });
    },
  },

};
