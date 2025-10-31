import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SubtitleViewer from '../components/SubtitleViewer';
import VideoSubtitleOverlay from '../components/VideoSubtitleOverlay';
import { PexelsVideo as PexelsVideoType, VideoSubtitles } from '../types/video.types';
import '../styles.scss';

/**
 * Represents the response structure from Pexels API search endpoints
 */
interface PexelsResponse {
  /** Current page number */
  page: number;
  /** Number of results per page */
  per_page: number;
  /** Array of video objects */
  videos: PexelsVideoType[];
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
 * - Video modal for detailed viewing and playbook
 * - Quick action buttons for common search categories
 * - Automatic subtitles support
 * 
 * @returns {JSX.Element} The rendered Pexels page component
 */
const Pexels: React.FC = () => {
  console.log('Pexels component rendering...');

  // Verify authentication
  const isAuthenticated = !!localStorage.getItem("token");

  const [videos, setVideos] = useState<PexelsVideoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideoType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savingFavorite, setSavingFavorite] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'en'>('es');
  
  // Video subtitle overlay states
  const [showSubtitleOverlay, setShowSubtitleOverlay] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // 🔥 Cargar favoritos del usuario cuando se monta el componente
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await api.favorites.getAll(); // GET /favorites
        const favoriteIds = favorites.map((f: any) => parseInt(f.id, 10)); // ids en número
        setLikedVideos(new Set(favoriteIds)); // sincroniza el estado local con los del backend
        console.log("❤️ Favoritos cargados:", favoriteIds);
      } catch (err) {
        console.error("❌ Error al cargar favoritos:", err);
      }
    };

    loadFavorites();
  }, []);

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

  // Reload videos when language changes
  useEffect(() => {
    if (isAuthenticated && videos.length > 0) {
      console.log(`Language changed to ${selectedLanguage}, reloading videos...`);
      loadPopularVideos();
    }
  }, [selectedLanguage]);

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
   * Loads popular videos from the backend Pexels API with automatic subtitles
   */
  const loadPopularVideos = async () => {
    console.log(`=== LOADING POPULAR VIDEOS (${selectedLanguage.toUpperCase()}) ===`);
    setLoading(true);
    setError(null);
    try {
      console.log(`Calling frontend-optimized API for popular videos in ${selectedLanguage}...`);
      const data: PexelsVideoType[] = await api.pexels.getVideosForFrontend(selectedLanguage);
      console.log('Frontend API response received:', {
        videoCount: data.length,
        language: selectedLanguage,
        hasSubtitles: data.filter(v => v.hasSubtitles).length,
        sampleVideo: data[0] ? {
          id: data[0].id,
          hasSubtitles: data[0].hasSubtitles,
          hasAudio: data[0].hasAudio,
          language: data[0].subtitles?.language,
          segmentCount: data[0].subtitles?.segments?.length || 0
        } : null
      });
      setVideos(data);
    } catch (err) {
      console.error('Error loading popular videos:', err);
      
      // Traducir mensajes de error al español
      let errorMessage = 'Error al cargar videos populares';
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
        } else if (err.message.includes('not configured')) {
          errorMessage = 'Servicio no disponible temporalmente.';
        } else {
          errorMessage = `Error al cargar videos: ${err.message}`;
        }
      }
      
      setError(errorMessage);
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
      console.log(`Searching videos with query: ${query}, terms: ${terms}, language: ${selectedLanguage}`);
      const data: PexelsResponse = await api.pexels.searchVideos(query, terms, 20, selectedLanguage);
      console.log('Search response received:', {
        videoCount: data.videos.length,
        language: selectedLanguage,
        hasSubtitles: data.videos.filter(v => v.hasSubtitles).length
      });
      setVideos(data.videos);
    } catch (err) {
      console.error('Error searching videos:', err);
      
      // Traducir mensajes de error al español
      let errorMessage = 'Error al buscar videos';
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
        } else if (err.message.includes('not configured')) {
          errorMessage = 'Servicio de búsqueda no disponible temporalmente.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Términos de búsqueda inválidos. Intenta con otras palabras.';
        } else {
          errorMessage = `Error en la búsqueda: ${err.message}`;
        }
      }
      
      setError(errorMessage);
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
   * @param {PexelsVideoType} video - The video object to display in the modal
   */
  const openVideoModal = async (video: PexelsVideoType) => {
    try {
      console.log('Opening video modal for:', video.id);
      // Get complete video details
      const fullVideo: PexelsVideoType = await api.pexels.getVideoById(video.id);
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
  const toggleLike = async (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const alreadyLiked = likedVideos.has(videoId);

    // Update the heart visually immediately
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (alreadyLiked) newLiked.delete(videoId);
      else newLiked.add(videoId);
      return newLiked;
    });

    if (alreadyLiked) {
      await removeFromFavorites(videoId);
    } else {
      await addToFavorites(videoId);
    }
  };

  /**
   * Reloads the current video with subtitles in the new language
   */
  const reloadCurrentVideoWithLanguage = async (newLanguage: 'es' | 'en') => {
    if (!selectedVideo) return;
    
    try {
      console.log(`Reloading video ${selectedVideo.id} with language: ${newLanguage}`);
      
      // Call the API with the new language parameter
      const updatedVideo = await api.pexels.getVideoById(selectedVideo.id, newLanguage);
      
      if (updatedVideo) {
        console.log('Video reloaded with new subtitles:', {
          id: updatedVideo.id,
          language: newLanguage,
          hasSubtitles: !!updatedVideo.subtitles,
          subtitleLanguage: updatedVideo.subtitles?.language,
          segmentCount: updatedVideo.subtitles?.segments?.length || 0
        });
        
        // Update the selected video with new subtitles
        setSelectedVideo(updatedVideo);
        
        // Also update the video in the videos array if it exists there
        setVideos(prevVideos => 
          prevVideos.map(video => 
            video.id === updatedVideo.id ? updatedVideo : video
          )
        );
      }
    } catch (error) {
      console.error('Error reloading video with new language:', error);
    }
  };

  /**
   * Handles language change in video modal
   */
  const handleVideoLanguageChange = (newLanguage: 'es' | 'en') => {
    setSelectedLanguage(newLanguage);
    reloadCurrentVideoWithLanguage(newLanguage);
  };


  /**
   * Adds a video to user's favorites in backend
   */
  const addToFavorites = async (videoId: number) => {
    if (savingFavorite === videoId) return; // 🚫 evita doble petición
    setSavingFavorite(videoId);

    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    // ✅ Obtener el archivo de video reproducible (.mp4)
    const bestFile = getBestVideoFile(video.video_files);

    try {
      await api.favorites.add({
        id: video.id.toString(),
        title: `Video por ${video.user.name}`,
        url: bestFile?.link || video.video_files[0]?.link,
        thumbnail: video.image,
      });
      console.log("✅ Added to favorites");
    } catch (err) {
      console.error("❌ Error adding to favorites:", err);
    } finally {
      setSavingFavorite(null);
    }
  };


  /**
   * Adds a video to user's favorites in backend
   */
  const addToFavorites = async (videoId: number) => {
    if (savingFavorite === videoId) return; // 🚫 evita doble petición
    setSavingFavorite(videoId);

    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    // ✅ Obtener el archivo de video reproducible (.mp4)
    const bestFile = getBestVideoFile(video.video_files);

    try {
      await api.favorites.add({
        id: video.id.toString(),
        title: `Video por ${video.user.name}`,
        url: bestFile?.link || video.video_files[0]?.link,
        thumbnail: video.image,
      });
      console.log("✅ Added to favorites");
    } catch (err) {
      console.error("❌ Error adding to favorites:", err);
    } finally {
      setSavingFavorite(null);
    }
  };

  /**
   * Removes a video from user's favorites in backend
   */
  const removeFromFavorites = async (videoId: number) => {
    try {
      await api.favorites.remove(videoId.toString());
      console.log("🗑️ Removed from favorites");
    } catch (err) {
      console.error("❌ Error removing from favorites:", err);
    }
  };
  /**
   * Removes a video from user's favorites in backend
   */
  const removeFromFavorites = async (videoId: number) => {
    try {
      await api.favorites.remove(videoId.toString());
      console.log("🗑️ Removed from favorites");
    } catch (err) {
      console.error("❌ Error removing from favorites:", err);
    }
  };
  /**
   * Checks if a video is liked
   * @param {number} videoId - The ID of the video to check
   * @returns {boolean} True if the video is liked
   */
  const isLiked = (videoId: number) => {
    return likedVideos.has(videoId);
  };

  /** Interface for the structure of a comment */
  interface Comment {
    _id: string;
    content: string;
    user: {
      _id: string;
      firstName: string;
    };
    videoId: string;
    createdAt: string;
    updatedAt: string;
  }

  /** State for the current video's comment list */
  const [comments, setComments] = useState<Comment[]>([]);

  /** State for the new comment being written */
  const [newComment, setNewComment] = useState("");

  /** ID of the comment being edited, null if no active edit */
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  /** Temporary content while editing a comment */
  const [editContent, setEditContent] = useState("");

  /** 
   * Effect to load comments when a video is selected
   * Executes every time selectedVideo changes
   */
  useEffect(() => {
    if (selectedVideo) {
      api.comments.getByVideo(selectedVideo.id.toString())
        .then(setComments)
        .catch(error => {
          console.error("Error loading comments:", error);
        });
    }
  }, [selectedVideo]);

  /**
   * Adds a new comment to the current video
   * @returns {Promise<void>} Promise that resolves when the comment is added
   */
  const handleAddComment = async (): Promise<void> => {
    if (!newComment.trim() || !selectedVideo) return;

    try {
      const comment = await api.comments.add({
        videoId: selectedVideo.id.toString(),
        content: newComment.trim()
      });
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  /**
   * Deletes a specific comment
   * @param {string} id - ID of the comment to delete
   * @returns {Promise<void>} Promise that resolves when the comment is deleted
   */
  const handleDeleteComment = async (id: string): Promise<void> => {
    try {
      await api.comments.remove(id);
      setComments(comments.filter(c => c._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  /**
   * Prepares the interface for editing a comment
   * @param {Comment} comment - The comment to edit
   */
  const handleEditComment = (comment: Comment): void => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  /**
   * Updates the content of an existing comment
   * @param {string} id - ID of the comment to update
   * @returns {Promise<void>} Promise that resolves when the comment is updated
   */
  const handleUpdateComment = async (id: string): Promise<void> => {
    if (!editContent.trim()) return;

    try {
      const updated = await api.comments.update(id, { content: editContent.trim() });
      // Preserve the user information from the original comment
      const originalComment = comments.find(c => c._id === id);
      if (originalComment) {
        const updatedWithUser = {
          ...updated,
          user: originalComment.user // Keep original user info
        };
        setComments(comments.map(c => (c._id === id ? updatedWithUser : c)));
      }
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("❌ Error updating comment:", error);
    }
  };

  /**
   * User's personal rating for the selected video (1-5).
   * Stored locally to reflect the UI state immediately after the user interacts.
   * @type {number}
   */
  const [userRating, setUserRating] = useState<number>(0);

  /**
   * Average rating for the selected video across all users.
   * Displayed in the modal as the current aggregated score.
   * @type {number}
   */
  const [averageRating, setAverageRating] = useState<number>(0);

  /**
   * Load ratings when a video is selected (modal opens). This effect fetches both:
   *  - the average rating for the video
   *  - the current user's rating for the video
   * Results are stored in `averageRating` and `userRating` respectively.
   */
  useEffect(() => {
    if (selectedVideo) {
      api.ratings.getAverage(selectedVideo.id.toString())
        .then((res) => setAverageRating(res.average))
        .catch((err) => console.error("Error fetching rating:", err));

      // fetch current user's rating for this video
      api.ratings.getUserRating(selectedVideo.id.toString())
        .then((res) => setUserRating(res.rating))
        .catch((err) => console.error("Error fetching user rating:", err));
    }
  }, [selectedVideo]);

  /**
   * Submit a user rating for the selected video.
   * This function updates the UI optimistically (sets `userRating` immediately),
   * then sends the rating to the server and refreshes the average rating.
   * @param {number} value - Rating value between 1 and 5
   * @returns {Promise<void>}
   */
  const handleRating = async (value: number): Promise<void> => {
    if (!selectedVideo) return;
    try {
      // Optimistic UI update
      setUserRating(value);
      await api.ratings.rateVideo(selectedVideo.id.toString(), value);
      const res = await api.ratings.getAverage(selectedVideo.id.toString());
      setAverageRating(res.average);
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  /**
   * Remove the current user's rating for the selected video.
   * After deletion, resets local `userRating` to 0 and refreshes the average rating.
   * @returns {Promise<void>}
   */
  const handleRemoveRating = async (): Promise<void> => {
    if (!selectedVideo) return;
    try {
      await api.ratings.removeUserRating(selectedVideo.id.toString());
      setUserRating(0);
      const res = await api.ratings.getAverage(selectedVideo.id.toString());
      setAverageRating(res.average);
    } catch (err) {
      console.error("Error removing rating:", err);
    }
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
              <div className="header-controls">
                {selectedVideo.subtitles && selectedVideo.subtitles.segments.length > 0 && (
                  <button
                    className={`subtitle-toggle-btn ${showSubtitleOverlay ? 'active' : ''}`}
                    onClick={() => setShowSubtitleOverlay(!showSubtitleOverlay)}
                    title={showSubtitleOverlay ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
                  >
                    📝 {showSubtitleOverlay ? 'CC ON' : 'CC OFF'}
                  </button>
                )}
                <button className="close-button" onClick={closeModal}>×</button>
              </div>
            </div>

            <div className="video-player">
              {getBestVideoFile(selectedVideo.video_files) ? (
                <div className="video-container">
                  <video
                    ref={videoRef}
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
                  
                  {/* Video overlay controls */}
                  <div className="video-overlay-controls">
                    {/* Language selector for subtitles */}
                    <div className="video-language-selector">
                      <label htmlFor="video-language-select" title="Cambiar idioma de subtítulos">
                        🌐
                      </label>
                      <select
                        id="video-language-select"
                        value={selectedLanguage}
                        onChange={(e) => handleVideoLanguageChange(e.target.value as 'es' | 'en')}
                        className="video-language-select"
                        title="Cambiar idioma de subtítulos"
                      >
                        <option value="es">🇪🇸 ES</option>
                        <option value="en">🇺🇸 EN</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Subtitle Overlay */}
                  {selectedVideo.subtitles && selectedVideo.subtitles.segments.length > 0 && (
                    <VideoSubtitleOverlay
                      segments={selectedVideo.subtitles.segments}
                      visible={showSubtitleOverlay}
                      videoRef={videoRef}
                      language={selectedVideo.subtitles.language}
                    />
                  )}
                </div>
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

            {/* ⭐ Sistema de calificación */}
            <div className="rating-section">
              <div className="average-rating">
                <h3>⭐ Calificación promedio</h3>
                <p className="average-value">{averageRating.toFixed(1)} / 5</p>
              </div>

              <hr className="rating-divider" />

              <div className="user-rating">
                <h3>Tu calificación</h3>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRating(star)}
                      style={{
                        cursor: "pointer",
                        color: userRating >= star ? "#ffd700" : "#555",
                        fontSize: "1.8rem",
                        marginRight: "5px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {userRating > 0 && (
                  <button
                    className="remove-rating-btn"
                    onClick={() => handleRemoveRating()}
                  >
                    Quitar calificación ✖
                  </button>
                )}
              </div>
            </div>

            {/* 📝 Subtítulos */}
            <div className="subtitles-section">
              <SubtitleViewer 
                videoId={selectedVideo.id.toString()}
                videoUrl={selectedVideo.video_files[0]?.link || ''}
                automaticSubtitles={selectedVideo.subtitles || null}
                hasAudio={selectedVideo.hasAudio || false}
                audioStatus={selectedVideo.audioStatus || 'unknown'}
              />
            </div>

            {/* 🗨️ Sección de comentarios */}
            <div className="comments-section">
              <h3>Comentarios</h3>

              <div className="add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                />
                <button onClick={handleAddComment}>Enviar</button>
              </div>

              <ul className="comments-list">
                {comments.map((c) => (
                  <li key={c._id}>
                    <p><strong>{c.user.firstName}:</strong></p>

                    {editingCommentId === c._id ? (
                      <div className="edit-comment">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <button onClick={() => handleUpdateComment(c._id)}>💾 Guardar</button>
                        <button onClick={() => setEditingCommentId(null)}>❌ Cancelar</button>
                      </div>
                    ) : (
                      <p>{c.content}</p>
                    )}

                    {c.user._id === JSON.parse(atob(localStorage.getItem("token")!.split(".")[1])).id && (
                      <div className="comment-actions">
                        <button onClick={() => handleEditComment(c)}>✏️</button>
                        <button onClick={() => handleDeleteComment(c._id)}>🗑️</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pexels;