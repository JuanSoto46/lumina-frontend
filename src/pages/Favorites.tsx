/**
 * The `Favorites` component displays a list of user's favorite videos.
 * This page is only accessible to authenticated users and shows their saved videos.
 */
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

interface FavoriteVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  addedAt: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");

  /**
   * Loads the user's favorite videos from the API
   */
  async function loadFavorites() {
    try {
      setLoading(true);
      // TODO: Implement API call to get user favorites
      // const data = await api.getFavorites();
      // setFavorites(data);
      
      // Placeholder data for now
      setFavorites([]);
      setMsg("Aún no tienes videos favoritos.");
      setMsgType("info");
    } catch (e: any) {
      setMsg(e.message || "Error al cargar los favoritos.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Removes a video from favorites
   * @param videoId - The ID of the video to remove from favorites
   */
  async function removeFavorite(videoId: string) {
    try {
      // TODO: Implement API call to remove favorite
      // await api.removeFavorite(videoId);
      setFavorites(favorites.filter(fav => fav.id !== videoId));
      setMsg("Video eliminado de favoritos.");
      setMsgType("success");
    } catch (e: any) {
      setMsg(e.message || "Error al eliminar de favoritos.");
      setMsgType("error");
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  // Check if user is authenticated
  if (!localStorage.getItem("token")) {
    return (
      <div className="favorites-container">
        <div className="favorites-card">
          <h2>Acceso denegado</h2>
          <p>Por favor inicia sesión para ver tus videos favoritos.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="favorites-card">
          <h2>Cargando favoritos...</h2>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="favorites-container" 
      role="main" 
      aria-labelledby="favorites-title" 
      lang="es"
    >
      <div className="favorites-card">
        <h1 id="favorites-title" className="favorites-title">
          Mis Videos Favoritos
        </h1>
        
        <p className="favorites-description">
          Aquí encontrarás todos los videos que has guardado como favoritos.
        </p>

        {msg && (
          <div className={`favorites-message ${msgType}`} role="status" aria-live="polite">
            {msg}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">❤️</div>
            <h3>No tienes videos favoritos aún</h3>
            <p>Explora videos y marca tus favoritos para verlos aquí.</p>
            <a href="/pexels" className="btn-primary">
              Explorar Videos
            </a>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((video) => (
              <div key={video.id} className="favorite-item">
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="video-overlay">
                    <button 
                      className="play-btn"
                      onClick={() => window.open(video.url, '_blank')}
                      aria-label={`Reproducir ${video.title}`}
                    >
                      ▶️
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFavorite(video.id)}
                      aria-label={`Eliminar ${video.title} de favoritos`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="video-info">
                  <h4 className="video-title">{video.title}</h4>
                  <span className="added-date">
                    Agregado: {new Date(video.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}