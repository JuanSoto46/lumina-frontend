import React, { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import "../styles.scss";

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

/** Respect reduced motion preference for autoplay/animations */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** Format seconds into MM:SS (kept helper) */
function fmt(duration: number) {
  const m = Math.floor(duration / 60);
  const s = duration % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const Pexels: React.FC = () => {
  // Auth
  const isAuthenticated = !!localStorage.getItem("token");

  // Original state (kept)
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savingFavorite, setSavingFavorite] = useState<number | null>(null);

  // New: collections for rails + active category filter
  const [popular, setPopular] = useState<PexelsVideo[]>([]);
  const [nature, setNature] = useState<PexelsVideo[]>([]);
  const [technology, setTechnology] = useState<PexelsVideo[]>([]);
  const [city, setCity] = useState<PexelsVideo[]>([]);
  /** When set, show only that category rail and hide others/grid */
  const [activeCategory, setActiveCategory] = useState<
    "popular" | "nature" | "technology" | "city" | null
  >(null);

  // Modal focus trap
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await api.favorites.getAll();
        const favoriteIds = favorites.map((f: any) => parseInt(f.id, 10));
        setLikedVideos(new Set(favoriteIds));
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };
    loadFavorites();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) window.location.href = "/login";
  }, [isAuthenticated]);

  // Initial load (popular grid + category rails)
  useEffect(() => {
    if (!isAuthenticated) return;
    const bootstrap = async () => {
      setLoading(true);
      setError(null);
      try {
        // Grid uses popular initially
        const pop: PexelsVideo[] = await api.pexels.getPopularVideos();
        setVideos(pop);
        setPopular(pop);

        // Rails content
        const [n, t, c] = await Promise.all([
          api.pexels.searchVideos("nature", "", 24) as unknown as PexelsResponse,
          api.pexels.searchVideos("technology", "", 24) as unknown as PexelsResponse,
          api.pexels.searchVideos("city", "", 24) as unknown as PexelsResponse,
        ]);
        setNature(n.videos || []);
        setTechnology(t.videos || []);
        setCity(c.videos || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar videos");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [isAuthenticated]);

  /** Loads popular into the grid (kept) */
  const loadPopularVideos = async () => {
    setActiveCategory("popular");
    setSearchQuery("");
    setLoading(true);
    setError(null);
    try {
      const data: PexelsVideo[] = await api.pexels.getPopularVideos();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar videos populares");
    } finally {
      setLoading(false);
    }
  };

  /** Search results go to the grid and hide rails */
  const searchVideos = async (query: string, terms?: string) => {
    if (!query.trim() && !terms?.trim()) return;
    setActiveCategory(null); // hide rails when searching
    setLoading(true);
    setError(null);
    try {
      const data: PexelsResponse = await api.pexels.searchVideos(query, terms, 20);
      setVideos(data.videos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar videos");
    } finally {
      setLoading(false);
    }
  };

  /** Helper: pick best file */
  const getBestVideoFile = (videoFiles?: Array<any>) => {
    if (!videoFiles || videoFiles.length === 0) return null;
    const hd = videoFiles.find((file) => file.quality === "hd");
    const sd = videoFiles.find((file) => file.quality === "sd");
    return hd || sd || videoFiles[0];
  };

  /** Modal open with optional focus origin */
  const openVideoModal = async (video: PexelsVideo, triggerBtn?: HTMLButtonElement | null) => {
    try {
      const fullVideo: PexelsVideo = await api.pexels.getVideoById(video.id);
      setSelectedVideo(fullVideo);
      setShowModal(true);
    } catch {
      setSelectedVideo(video);
      setShowModal(true);
    } finally {
      if (triggerBtn) lastTriggerRef.current = triggerBtn;
    }
  };

  /** Modal close + focus return */
  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
    lastTriggerRef.current?.focus();
  };

  /** Focus trap + close with Esc */
  useEffect(() => {
    if (!showModal) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeModal(); }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    first?.focus();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showModal]);

  /** Toggle favorites (kept) */
  const toggleLike = async (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedVideos.has(videoId);
    setLikedVideos((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(videoId) : next.add(videoId);
      return next;
    });
    if (alreadyLiked) await removeFromFavorites(videoId);
    else await addToFavorites(videoId);
  };

  /** Add to favorites (kept) */
  const addToFavorites = async (videoId: number) => {
    if (savingFavorite === videoId) return;
    setSavingFavorite(videoId);
    const all = [...popular, ...nature, ...technology, ...city, ...videos];
    const video = all.find((v) => v.id === videoId);
    if (!video) { setSavingFavorite(null); return; }
    const bestFile = getBestVideoFile(video.video_files);
    try {
      await api.favorites.add({
        id: video.id.toString(),
        title: `Video por ${video.user.name}`,
        url: bestFile?.link || video.video_files[0]?.link,
        thumbnail: video.image,
      });
    } catch (err) {
      console.error("Error adding to favorites:", err);
    } finally {
      setSavingFavorite(null);
    }
  };

  /** Remove from favorites (kept) */
  const removeFromFavorites = async (videoId: number) => {
    try {
      await api.favorites.remove(videoId.toString());
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

  /** Check liked (kept) */
  const isLiked = (videoId: number) => likedVideos.has(videoId);

  /** Category handlers: show only one rail and also update grid to match */
  const setOnlyCategory = (k: "popular" | "nature" | "technology" | "city") => {
    setSearchQuery("");
    setActiveCategory(k);
    switch (k) {
      case "popular": setVideos(popular); break;
      case "nature": setVideos(nature); break;
      case "technology": setVideos(technology); break;
      case "city": setVideos(city); break;
    }
  };

  // Guard render
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="loading">
          <p>Redirigiendo al login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pexels-page">
      <div className="container">
        {/* Spanish UI, English comments */}
        <header className="pexels-hero">
          <h1>Explora videos</h1>
          <p>Descubre categorías en carruseles y usa el buscador si quieres algo específico.</p>
        </header>

        {/* Search (kept) */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) searchVideos(searchQuery.trim()); }}
          className="search-form"
          role="search"
          aria-label="Buscar videos"
        >
          <div className="search-input-group">
            <label htmlFor="q" className="visually-hidden">Buscar</label>
            <input
              id="q"
              type="search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); if (e.target.value) setActiveCategory(null); }}
              placeholder="Buscar videos…"
              className="search-input"
              aria-describedby="search-help"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "Buscando…" : "Buscar"}
            </button>
          </div>
          <p id="search-help" className="sr-help">Ejemplos: naturaleza, tecnología, ciudad</p>
        </form>

        {/* Quick actions now act as category filters */}
        <div className="quick-actions" role="group" aria-label="Categorías">
          <button onClick={() => setOnlyCategory("popular")} className={`quick-action-btn ${activeCategory === "popular" ? "is-active" : ""}`} disabled={loading}>Popular</button>
          <button onClick={() => setOnlyCategory("nature")} className={`quick-action-btn ${activeCategory === "nature" ? "is-active" : ""}`} disabled={loading}>Naturaleza</button>
          <button onClick={() => setOnlyCategory("technology")} className={`quick-action-btn ${activeCategory === "technology" ? "is-active" : ""}`} disabled={loading}>Tecnología</button>
          <button onClick={() => setOnlyCategory("city")} className={`quick-action-btn ${activeCategory === "city" ? "is-active" : ""}`} disabled={loading}>Ciudad</button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="close-error" aria-label="Cerrar">×</button>
          </div>
        )}

        {/* Rails:
            - If activeCategory is null and there is no search, show ALL rails
            - If activeCategory is set, show ONLY that rail
            - If searchQuery has text, rails are hidden */}
        {!searchQuery.trim() && (
          <>
            {(activeCategory === null || activeCategory === "popular") && (
              <section className="rail" aria-label="Popular">
                <div className="rail-head">
                  <h2 className="rail-title">Popular</h2>
                </div>
                <div className="rail-ctrls rail-overlay-ctrls" aria-hidden="false">
                  <button className="rail-btn rail-prev" aria-label="Anterior" onClick={() => document.getElementById("rail-pop")?.scrollBy({ left: -Math.round((document.getElementById("rail-pop")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>‹</button>
                  <button className="rail-btn rail-next" aria-label="Siguiente" onClick={() => document.getElementById("rail-pop")?.scrollBy({ left: Math.round((document.getElementById("rail-pop")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>›</button>
                </div>
                <div id="rail-pop" className="rail-track">
                  {popular.map((v) => (
                    <article key={v.id} className="video-card rail-card">
                      <button type="button" className="thumb-trigger" onClick={(e) => openVideoModal(v, e.currentTarget)}>
                        <div className="rail-thumb">
                          <img src={v.image} alt={`Miniatura del video por ${v.user.name}`} loading="lazy" />
                          <span className="rail-duration" aria-hidden="true">{fmt(v.duration)}</span>
                          <div className="rail-overlay" aria-hidden="true"><div className="rail-play">▶</div></div>
                        </div>
                      </button>
                      <div className="rail-info">
                        <div className="rail-title" title={`Video por ${v.user.name}`}>Video por {v.user.name}</div>
                        <button
                          type="button"
                          className={`rail-heart ${isLiked(v.id) ? "liked" : ""}`}
                          aria-pressed={isLiked(v.id)}
                          aria-label={isLiked(v.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                          onClick={(e) => toggleLike(v.id, e)}
                        >
                          {isLiked(v.id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {(activeCategory === null || activeCategory === "nature") && (
              <section className="rail" aria-label="Naturaleza">
                <div className="rail-head"><h2 className="rail-title">Naturaleza</h2></div>
                <div className="rail-ctrls rail-overlay-ctrls">
                  <button className="rail-btn rail-prev" aria-label="Anterior" onClick={() => document.getElementById("rail-nat")?.scrollBy({ left: -Math.round((document.getElementById("rail-nat")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>‹</button>
                  <button className="rail-btn rail-next" aria-label="Siguiente" onClick={() => document.getElementById("rail-nat")?.scrollBy({ left: Math.round((document.getElementById("rail-nat")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>›</button>
                </div>
                <div id="rail-nat" className="rail-track">
                  {nature.map((v) => (
                    <article key={v.id} className="video-card rail-card">
                      <button type="button" className="thumb-trigger" onClick={(e) => openVideoModal(v, e.currentTarget)}>
                        <div className="rail-thumb">
                          <img src={v.image} alt={`Miniatura del video por ${v.user.name}`} loading="lazy" />
                          <span className="rail-duration" aria-hidden="true">{fmt(v.duration)}</span>
                          <div className="rail-overlay" aria-hidden="true"><div className="rail-play">▶</div></div>
                        </div>
                      </button>
                      <div className="rail-info">
                        <div className="rail-title" title={`Video por ${v.user.name}`}>Video por {v.user.name}</div>
                        <button type="button" className={`rail-heart ${isLiked(v.id) ? "liked" : ""}`} aria-pressed={isLiked(v.id)} onClick={(e) => toggleLike(v.id, e)}>
                          {isLiked(v.id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {(activeCategory === null || activeCategory === "technology") && (
              <section className="rail" aria-label="Tecnología">
                <div className="rail-head"><h2 className="rail-title">Tecnología</h2></div>
                <div className="rail-ctrls rail-overlay-ctrls">
                  <button className="rail-btn rail-prev" aria-label="Anterior" onClick={() => document.getElementById("rail-tech")?.scrollBy({ left: -Math.round((document.getElementById("rail-tech")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>‹</button>
                  <button className="rail-btn rail-next" aria-label="Siguiente" onClick={() => document.getElementById("rail-tech")?.scrollBy({ left: Math.round((document.getElementById("rail-tech")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>›</button>
                </div>
                <div id="rail-tech" className="rail-track">
                  {technology.map((v) => (
                    <article key={v.id} className="video-card rail-card">
                      <button type="button" className="thumb-trigger" onClick={(e) => openVideoModal(v, e.currentTarget)}>
                        <div className="rail-thumb">
                          <img src={v.image} alt={`Miniatura del video por ${v.user.name}`} loading="lazy" />
                          <span className="rail-duration" aria-hidden="true">{fmt(v.duration)}</span>
                          <div className="rail-overlay" aria-hidden="true"><div className="rail-play">▶</div></div>
                        </div>
                      </button>
                      <div className="rail-info">
                        <div className="rail-title" title={`Video por ${v.user.name}`}>Video por {v.user.name}</div>
                        <button type="button" className={`rail-heart ${isLiked(v.id) ? "liked" : ""}`} aria-pressed={isLiked(v.id)} onClick={(e) => toggleLike(v.id, e)}>
                          {isLiked(v.id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {(activeCategory === null || activeCategory === "city") && (
              <section className="rail" aria-label="Ciudad">
                <div className="rail-head"><h2 className="rail-title">Ciudad</h2></div>
                <div className="rail-ctrls rail-overlay-ctrls">
                  <button className="rail-btn rail-prev" aria-label="Anterior" onClick={() => document.getElementById("rail-city")?.scrollBy({ left: -Math.round((document.getElementById("rail-city")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>‹</button>
                  <button className="rail-btn rail-next" aria-label="Siguiente" onClick={() => document.getElementById("rail-city")?.scrollBy({ left: Math.round((document.getElementById("rail-city")?.clientWidth || 0) * 0.9), behavior: "smooth" })}>›</button>
                </div>
                <div id="rail-city" className="rail-track">
                  {city.map((v) => (
                    <article key={v.id} className="video-card rail-card">
                      <button type="button" className="thumb-trigger" onClick={(e) => openVideoModal(v, e.currentTarget)}>
                        <div className="rail-thumb">
                          <img src={v.image} alt={`Miniatura del video por ${v.user.name}`} loading="lazy" />
                          <span className="rail-duration" aria-hidden="true">{fmt(v.duration)}</span>
                          <div className="rail-overlay" aria-hidden="true"><div className="rail-play">▶</div></div>
                        </div>
                      </button>
                      <div className="rail-info">
                        <div className="rail-title" title={`Video por ${v.user.name}`}>Video por {v.user.name}</div>
                        <button type="button" className={`rail-heart ${isLiked(v.id) ? "liked" : ""}`} aria-pressed={isLiked(v.id)} onClick={(e) => toggleLike(v.id, e)}>
                          {isLiked(v.id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Original grid (kept). Still shows current 'videos' (popular, category or search). */}
        <div className="videos-grid" aria-label="Resultados">
          {videos.map((video) => (
            <div key={video.id} className="video-card" onClick={() => openVideoModal(video)}>
              <div className="video-thumb-wrap">
                <img src={video.image} alt={`Video por ${video.user.name}`} className="video-thumb" loading="lazy" />
                <div className="video-overlay" aria-hidden="true">
                  <div className="play-button">▶</div>
                </div>
                <span className="video-duration">{fmt(video.duration)}</span>
              </div>
              <div className="video-bottom-bar">
                <div className="info-left">
                  <div className="video-title">Video por {video.user.name}</div>
                  <div className="video-meta"><span className="duration">{fmt(video.duration)}</span></div>
                </div>
                <div className="info-right">
                  <button
                    className={`simple-heart ${isLiked(video.id) ? "liked" : ""}`}
                    onClick={(e) => toggleLike(video.id, e)}
                    aria-label={isLiked(video.id) ? "Quitar me gusta" : "Me gusta"}
                  >
                    {isLiked(video.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="spinner"></div>
            <p>Cargando videos…</p>
          </div>
        )}

        {videos.length === 0 && !loading && !error && (
          <div className="no-results">
            <p>No se encontraron videos. Intenta con otra búsqueda.</p>
          </div>
        )}
      </div>

      {/* Original modal (kept) */}
      {showModal && selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div
            ref={dialogRef}
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={`Reproduciendo video por ${selectedVideo.user.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Video por {selectedVideo.user.name}</h2>
              <button className="close-button" onClick={closeModal} aria-label="Cerrar">×</button>
            </div>

            <div className="video-player">
              {getBestVideoFile(selectedVideo.video_files) ? (
                <video
                  controls
                  autoPlay={!prefersReduced}
                  preload="metadata"
                  className="video-element"
                  poster={selectedVideo.image}
                  playsInline
                >
                  <source src={getBestVideoFile(selectedVideo.video_files)?.link} type="video/mp4" />
                  Tu navegador no soporta el elemento video.
                </video>
              ) : (
                <div className="video-error"><p>No se pudo cargar el video</p></div>
              )}
            </div>

            <div className="video-details">
              <p><strong>Duración:</strong> {fmt(selectedVideo.duration)}</p>
              <p><strong>Dimensiones:</strong> {selectedVideo.width}x{selectedVideo.height}</p>

              {selectedVideo.video_files?.length > 0 && (
                <div className="quality-options">
                  <p><strong>Calidades disponibles:</strong></p>
                  <div className="quality-buttons">
                    {selectedVideo.video_files.map((file) => (
                      <a key={file.id} href={file.link} target="_blank" rel="noopener noreferrer" className="quality-btn">
                        {file.quality} ({file.width}x{file.height})
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="external-link">
                <a href={selectedVideo.url} target="_blank" rel="noopener noreferrer" className="pexels-link">
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
