import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles.scss';

// Interfaces basadas en la respuesta de Pexels API
interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  videos: PexelsVideo[];
  total_results: number;
  next_page?: string;
  url: string;
}

const Pexels: React.FC = () => {
  console.log('Pexels component rendering...');
  
  // Verificar autenticación
  const isAuthenticated = !!localStorage.getItem("token");
  
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('nature');
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideo | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
  }, [isAuthenticated]);

  // Cargar videos populares al inicio (solo si está autenticado)
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Pexels component mounted, loading popular videos...');
      loadPopularVideos();
    }
  }, [isAuthenticated]);

  // No renderizar nada si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="loading">
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  const loadPopularVideos = async () => {
    console.log('loadPopularVideos called');
    setLoading(true);
    setError(null);
    try {
      console.log('Calling API for popular videos...');
      const data: PexelsVideo[] = await api.pexels.getPopularVideos();
      console.log('API response received:', data);
      setVideos(data);
    } catch (err) {
      console.error('Error loading popular videos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar videos populares');
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query: string, terms?: string) => {
    if (!query.trim() && !terms?.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Searching videos with query:', query, 'terms:', terms);
      const data: PexelsResponse = await api.pexels.searchVideos(query, terms, 20);
      console.log('Search response received:', data);
      setVideos(data.videos);
    } catch (err) {
      console.error('Error searching videos:', err);
      setError(err instanceof Error ? err.message : 'Error al buscar videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos(searchQuery.trim());
    }
  };

  const openVideoModal = async (video: PexelsVideo) => {
    try {
      console.log('Opening video modal for:', video.id);
      // Obtener detalles completos del video
      const fullVideo: PexelsVideo = await api.pexels.getVideoById(video.id);
      setSelectedVideo(fullVideo);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading video details:', err);
      // Si falla, usar el video que ya tenemos
      setSelectedVideo(video);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const getBestVideoFile = (videoFiles?: Array<any>) => {
    if (!videoFiles || videoFiles.length === 0) return null;
    
    // Preferir calidad HD, luego SD, luego cualquier otra
    const hd = videoFiles.find(file => file.quality === 'hd');
    const sd = videoFiles.find(file => file.quality === 'sd');
    
    return hd || sd || videoFiles[0];
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pexels-page">
      <div className="container">
        <header className="pexels-header">
          <h1>Videos de Pexels</h1>
          <p>Descubre videos gratuitos de alta calidad</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Buscar videos..."
                className="search-input"
              />
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          <div className="quick-actions">
            <button 
              onClick={loadPopularVideos}
              className="quick-action-btn"
              disabled={loading}
            >
              Videos Populares
            </button>
            <button 
              onClick={() => searchVideos('nature')}
              className="quick-action-btn"
              disabled={loading}
            >
              Naturaleza
            </button>
            <button 
              onClick={() => searchVideos('technology')}
              className="quick-action-btn"
              disabled={loading}
            >
              Tecnología
            </button>
            <button 
              onClick={() => searchVideos('city')}
              className="quick-action-btn"
              disabled={loading}
            >
              Ciudad
            </button>
          </div>
        </header>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card" onClick={() => openVideoModal(video)}>
              <div className="video-thumb-wrap">
                <img src={video.image} alt={`Video by ${video.user.name}`} className="video-thumb" />
                <div className="video-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>

              {/* White info bar like the screenshot */}
              <div className="video-bottom-bar">
                <div className="info-left">
                  <div className="video-title">Video por {video.user.name}</div>
                  <div className="video-meta">
                    <span className="duration">{formatDuration(video.duration)}</span>
                  </div>
                </div>
                <div className="info-right">
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); /* like functionality */ }} aria-label="like">♡</button>
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); openVideoModal(video); }} aria-label="play">▶</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando videos...</p>
          </div>
        )}

        {videos.length === 0 && !loading && !error && (
          <div className="no-results">
            <p>No se encontraron videos. Intenta con otra búsqueda.</p>
          </div>
        )}
      </div>

      {/* Modal de reproducción de video */}
      {showModal && selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Video por {selectedVideo.user.name}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            
            <div className="video-player">
              {getBestVideoFile(selectedVideo.video_files) ? (
                <video
                  controls
                  autoPlay
                  preload="metadata"
                  className="video-element"
                  poster={selectedVideo.image}
                >
                  <source 
                    src={getBestVideoFile(selectedVideo.video_files)?.link} 
                    type="video/mp4" 
                  />
                  Tu navegador no soporta el elemento video.
                </video>
              ) : (
                <div className="video-error">
                  <p>No se pudo cargar el video</p>
                </div>
              )}
            </div>

            <div className="video-details">
              <p><strong>Duración:</strong> {formatDuration(selectedVideo.duration)}</p>
              <p><strong>Dimensiones:</strong> {selectedVideo.width}x{selectedVideo.height}</p>
              
              {selectedVideo.video_files && selectedVideo.video_files.length > 0 && (
                <div className="quality-options">
                  <p><strong>Calidades disponibles:</strong></p>
                  <div className="quality-buttons">
                    {selectedVideo.video_files.map((file) => (
                      <a
                        key={file.id}
                        href={file.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="quality-btn"
                      >
                        {file.quality} ({file.width}x{file.height})
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="external-link">
                <a 
                  href={selectedVideo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pexels-link"
                >
                  Ver en Pexels ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pexels;
