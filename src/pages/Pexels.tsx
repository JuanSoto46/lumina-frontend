import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles.scss';

/**
 * Represents a video object from the Pexels API
 */
interface PexelsVideo {
  /** Unique identifier for the video */
  id: number;
  /** Video width in pixels */
  width: number;
  /** Video height in pixels */
  height: number;
  /** URL to the video page on Pexels */
  url: string;
  /** URL to the video thumbnail image */
  image: string;
  /** Video duration in seconds */
  duration: number;
  /** Information about the video creator */
  user: {
    /** User's unique identifier */
    id: number;
    /** User's display name */
    name: string;
    /** URL to the user's profile on Pexels */
    url: string;
  };
  /** Array of available video files in different qualities */
  video_files: Array<{
    /** File unique identifier */
    id: number;
    /** Video quality (e.g., 'hd', 'sd') */
    quality: string;
    /** File format type */
    file_type: string;
    /** Video width for this quality */
    width: number;
    /** Video height for this quality */
    height: number;
    /** Direct download link to the video file */
    link: string;
  }>;
  /** Array of video preview pictures */
  video_pictures: Array<{
    /** Picture unique identifier */
    id: number;
    /** URL to the picture */
    picture: string;
    /** Picture number in sequence */
    nr: number;
  }>;
}

/**
 * Represents the response structure from Pexels API search endpoints
 */
interface PexelsResponse {
  /** Current page number */
  page: number;
  /** Number of results per page */
  per_page: number;
  /** Array of video objects */
  videos: PexelsVideo[];
  /** Total number of results available */
  total_results: number;
  /** URL to the next page (if available) */
  next_page?: string;
  /** URL of the current request */
  url: string;
}

/**
 * Pexels component - A React functional component that displays a page for viewing and searching videos from the Pexels API.
 * 
 * Features:
 * - Authentication check and redirect to login if not authenticated
 * - Load and display popular videos on page load
 * - Search functionality for finding specific videos
 * - Video modal for detailed viewing and playback
 * - Quick action buttons for common search categories
 * 
 * @returns {JSX.Element} The rendered Pexels page component
 */
const Pexels: React.FC = () => {
  console.log('Pexels component rendering...');
  
  // Verify authentication
  const isAuthenticated = !!localStorage.getItem("token");
  
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('nature');
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
  }, [isAuthenticated]);

  // Load popular videos at startup (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Pexels component mounted, loading popular videos...');
      loadPopularVideos();
    }
  }, [isAuthenticated]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="loading">
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  /**
   * Loads popular videos from the Pexels API
   * Updates the videos state with the fetched data and handles loading/error states
   */
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

  /**
   * Searches for videos using the Pexels API based on query and optional terms
   * @param {string} query - The main search query
   * @param {string} [terms] - Optional additional search terms
   */
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

  /**
   * Handles the search form submission
   * Prevents default form submission and triggers video search if query is not empty
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos(searchQuery.trim());
    }
  };

  /**
   * Opens a modal with detailed video information and playback options
   * Attempts to fetch complete video details, falls back to provided video data if fetch fails
   * @param {PexelsVideo} video - The video object to display in the modal
   */
  const openVideoModal = async (video: PexelsVideo) => {
    try {
      console.log('Opening video modal for:', video.id);
      // Get complete video details
      const fullVideo: PexelsVideo = await api.pexels.getVideoById(video.id);
      setSelectedVideo(fullVideo);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading video details:', err);
      // If it fails, use the video we already have
      setSelectedVideo(video);
      setShowModal(true);
    }
  };

  /**
   * Closes the video modal and resets the selected video state
   */
  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  /**
   * Determines the best quality video file from available options
   * Prioritizes HD quality, then SD, then falls back to the first available file
   * @param {Array<any>} [videoFiles] - Array of video file objects with different qualities
   * @returns {any|null} The best quality video file object or null if none available
   */
  const getBestVideoFile = (videoFiles?: Array<any>) => {
    if (!videoFiles || videoFiles.length === 0) return null;
    
    // Prefer HD quality, then SD, then any other
    const hd = videoFiles.find(file => file.quality === 'hd');
    const sd = videoFiles.find(file => file.quality === 'sd');
    
    return hd || sd || videoFiles[0];
  };

  /**
   * Formats video duration from seconds to MM:SS format
   * @param {number} duration - Duration in seconds
   * @returns {string} Formatted duration string in MM:SS format
   */
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * Toggles the like status of a video
   * @param {number} videoId - The ID of the video to toggle
   * @param {React.MouseEvent} e - The click event
   */
  const toggleLike = (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(videoId)) {
        newLiked.delete(videoId);
      } else {
        newLiked.add(videoId);
      }
      return newLiked;
    });
  };

  /**
   * Checks if a video is liked
   * @param {number} videoId - The ID of the video to check
   * @returns {boolean} True if the video is liked
   */
  const isLiked = (videoId: number) => {
    return likedVideos.has(videoId);
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
                  <button 
                    className={`simple-heart ${isLiked(video.id) ? 'liked' : ''}`}
                    onClick={(e) => toggleLike(video.id, e)}
                    aria-label={isLiked(video.id) ? 'Quitar me gusta' : 'Me gusta'}
                  >
                    {isLiked(video.id) ? '❤️' : '🤍'}
                  </button>
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

      {/* Video playback modal */}
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
