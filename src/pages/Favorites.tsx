import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import "../styles.scss";

interface FavoriteVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  addedAt: string;
  duration?: number;
  width?: number;
  height?: number;
  video_files?: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");
  const [selectedVideo, setSelectedVideo] = useState<FavoriteVideo | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar favoritos desde el backend
  async function loadFavorites() {
    try {
      setLoading(true);
      const data = await api.favorites.getAll();
      setFavorites(data);
      if (data.length === 0) {
        setMsg("Aún no tienes videos favoritos.");
        setMsgType("info");
      } else {
        setMsg("");
      }
    } catch (e: any) {
      setMsg(e.message || "Error al cargar los favoritos.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  // Eliminar un favorito
  async function removeFavorite(videoId: string) {
    try {
      await api.favorites.remove(videoId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== videoId));
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

  // Verificación de autenticación
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

  // 🔥 Abre el modal con el video seleccionado
  const openModal = (video: FavoriteVideo) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  // 🔥 Cierra el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  return (
    <section className="favorites-container" role="main" aria-labelledby="favorites-title" lang="es">
      <div className="favorites-card">
        <h1 id="favorites-title" className="favorites-title">Mis Videos Favoritos</h1>
        <p className="favorites-description">Aquí encontrarás todos los videos que has guardado como favoritos.</p>

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
            <a href="/pexels" className="btn-primary">Explorar Videos</a>
          </div>
        ) : (
          <div className="videos-grid">
            {favorites.map((video) => (
              <div key={video.id} className="video-card" onClick={() => openModal(video)}>
                <div className="video-thumb-wrap">
                  <img src={video.thumbnail} alt={video.title} className="video-thumb" />
                  <div className="video-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <div className="video-bottom-bar">
                  <div className="info-left">
                    <div className="video-title">{video.title}</div>
                    <div className="video-meta">
                      <span className="added-date">
                        Agregado: {new Date(video.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="info-right">
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(video.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎬 Modal de video */}
      {showModal && selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedVideo.title}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>

            <div className="video-player">
              <video
                controls
                autoPlay
                preload="metadata"
                className="video-element"
                poster={selectedVideo.thumbnail}
              >
                <source src={selectedVideo.url} type="video/mp4" />
                Tu navegador no soporta el elemento video.
              </video>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
