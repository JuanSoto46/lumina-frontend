import { api } from "./api";

export const favoritesService = {
  getAll: () => api.favorites.getAll(),
  add: (favorite: { id: string; title: string; url: string; thumbnail: string }) =>
    api.favorites.add(favorite),
  remove: (id: string) => api.favorites.remove(id),
};
