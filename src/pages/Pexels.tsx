import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SubtitleViewer from '../components/SubtitleViewer';
import VideoSubtitleOverlay from '../components/VideoSubtitleOverlay';
// import SubtitleGenerator from '../components/SubtitleGenerator'; // ← no usado, lo quito para evitar warnings
import { PexelsVideo as PexelsVideoType, SUPPORTED_SUBTITLE_LANGUAGES } from '../types/video.types';
import '../styles.scss';
import VideoCard from "../components/VideoCard";

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
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideoType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savingFavorite, setSavingFavorite] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');

  // 🔎 Estado para resultados de búsqueda y el término
  const [searchResults, setSearchResults] = useState<PexelsVideoType[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Video subtitle overlay states
  const [showSubtitleOverlay, setShowSubtitleOverlay] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // === HERO + CATEGORÍAS ===
  const [featured, setFeatured] = useState<PexelsVideoType | null>(null);
  const [byCategory, setByCategory] = useState<Record<string, PexelsVideoType[]>>({});
  const [heroList, setHeroList] = useState<PexelsVideoType[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  // Categorías (rieles)
  const CATEGORIES: { key: string; title: string; query?: string }[] = [
    { key: "popular", title: "Tendencias" },
    { key: "nature", title: "Naturaleza", query: "nature" },
    { key: "tech", title: "Tecnología", query: "technology" },
    { key: "city", title: "Ciudades", query: "city" },
  ];

  const railRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const setRailRef = (key: string) => (el: HTMLDivElement | null) => {
    railRefs.current[key] = el;
  };

  const scrollRail = (key: string, dir: "prev" | "next") => {
    const el = (railRefs.current as any)[key] as HTMLDivElement | null;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  const getVideoFromAnyList = (id: number): PexelsVideoType | undefined => {
    if (featured?.id === id) return featured;
    for (const arr of Object.values(byCategory)) {
      const found = arr.find(v => v.id === id);
      if (found) return found;
    }
    // fallback por si usas la búsqueda clásica
    return videos.find(v => v.id === id);
  };

  // Evitar restauración automática del scroll y forzar top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // sube al inicio en cada carga
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // 🔥 Cargar favoritos del usuario cuando se monta el componente
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await api.favorites.getAll(); // GET /favorites
        // Soporta distintos esquemas (id, videoId, _id, nested)
        const favoriteIds = favorites
          .map((f: any) => Number(f.id ?? f.videoId ?? f._id ?? f.video?.id))
          .filter((n: any) => Number.isFinite(n));
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

  // Debug logging for selectedVideo and subtitle overlay
  useEffect(() => {
    if (selectedVideo) {
      console.log('🔍 Subtitle Overlay Debug:', {
        videoId: selectedVideo.id,
        hasSelectedVideo: !!selectedVideo,
        hasSubtitles: !!(selectedVideo as any)?.subtitles,
        segmentsLength: (selectedVideo as any)?.subtitles?.segments?.length || 0,
        showSubtitleOverlay: showSubtitleOverlay,
        subtitleLanguage: (selectedVideo as any)?.subtitles?.language,
        currentSelectedLanguage: selectedLanguage,
        firstSegmentText: (selectedVideo as any)?.subtitles?.segments?.[0]?.text || 'No text',
        overlayCondition: !!((selectedVideo as any).subtitles && (selectedVideo as any).subtitles.segments.length > 0),
        fullSubtitleData: (selectedVideo as any)?.subtitles
      });
    }
  }, [selectedVideo, showSubtitleOverlay, selectedLanguage]);

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
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1) Populares → hero + riel "popular"
    (async () => {
      try {
        const popular: PexelsVideoType[] = await api.pexels.getVideosForFrontend(selectedLanguage);
        setFeatured(popular[0] || null);
        setByCategory(prev => ({ ...prev, popular }));
        setHeroList(popular.slice(0, 6)); // 6 destacados
        setHeroIndex(0);
      } catch (e) {
        console.error("Error cargando populares:", e);
      }
    })();

    // 2) Otras categorías en paralelo
    (async () => {
      const results: Record<string, PexelsVideoType[]> = {};
      await Promise.all(
        CATEGORIES.filter(c => c.query).map(async c => {
          try {
            const r = await api.pexels.searchVideos(c.query!, undefined, 20, selectedLanguage);
            results[c.key] = r.videos || [];
          } catch (e) {
            console.error(`Error cargando ${c.key}:`, e);
            results[c.key] = [];
          }
        })
      );
      setByCategory(prev => ({ ...prev, ...results }));
    })();
  }, [isAuthenticated, selectedLanguage]);

  // cambia cada 6s
  useEffect(() => {
    if (!heroList.length) return;
    const id = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroList.length);
    }, 6000);
    return () => clearInterval(id);
  }, [heroList]);

  useEffect(() => {
    if (heroList.length) setFeatured(heroList[heroIndex] || null);
  }, [heroIndex, heroList]);

  // Escucha “pexels:search” que disparará el Header
  useEffect(() => {
    const onSearch = (e: Event) => {
      const term = (e as CustomEvent).detail?.trim?.() ?? "";
      if (!term) return;
      setSearchTerm(term);
      setError(null);
      setLoading(true);
      api.pexels.searchVideos(term, undefined, 20, selectedLanguage)
        .then((data: any) => setSearchResults(data.videos || []))
        .catch(() => setError("Error en la búsqueda"))
        .finally(() => setLoading(false));
    };

    const onClear = () => {
      setSearchTerm("");
      setSearchResults(null);   // ← vuelve a mostrar hero + rieles
    };

    window.addEventListener("pexels:search", onSearch as any);
    window.addEventListener("pexels:clear", onClear as any);
    return () => {
      window.removeEventListener("pexels:search", onSearch as any);
      window.removeEventListener("pexels:clear", onClear as any);
    };
  }, [selectedLanguage]);

  useEffect(() => {
    if (searchResults === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.dispatchEvent(new Event("pexels:clear"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchResults]);

  // Rotación del hero (pausa si el modal está abierto o la pestaña no está visible)
  useEffect(() => {
    if (!heroList.length || showModal) return;

    let id: number | undefined;
    const tick = () => {
      setHeroIndex((i) => (i + 1) % heroList.length);
    };

    // evita cambiar mientras la pestaña está oculta
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (id) window.clearInterval(id);
        id = undefined;
      } else if (!id) {
        id = window.setInterval(tick, 8000);
      }
    };

    id = window.setInterval(tick, 8000);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (id) window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [heroList, showModal]);

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
        hasSubtitles: (data.videos as any[]).filter((v: any) => v?.hasSubtitles || v?.subtitles?.segments?.length).length
      });
      setVideos(data.videos);
      setSearchResults(data.videos ?? []);
    } catch (err: any) {
      console.error('Error searching videos:', err);
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
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the video modal with complete video details
   * Attempts to fetch complete video details, falls back to provided video data if fetch fails
   * @param {PexelsVideoType} video - The video object to display in the modal
   */
  const openVideoModal = async (video: PexelsVideoType) => {
    try {
      console.log(`🎬 Opening video modal for ID: ${video.id} with language: ${selectedLanguage}`);
      const fullVideo: PexelsVideoType = await api.pexels.getVideoById(video.id, selectedLanguage);
      console.log('📋 Full video data received:', {
        id: fullVideo.id,
        hasSubtitles: !!(fullVideo as any).subtitles,
        subtitleSegments: (fullVideo as any).subtitles?.segments?.length || 0,
        subtitleStructure: (fullVideo as any).subtitles
      });
      setSelectedVideo(fullVideo);
      setShowModal(true);
    } catch (err) {
      console.error('❌ Error loading video details:', err);
      console.log('🔄 Falling back to provided video data:', {
        id: video.id,
        hasSubtitles: !!(video as any).subtitles,
        subtitleSegments: (video as any).subtitles?.segments?.length || 0
      });
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
    e.preventDefault();

    const alreadyLiked = likedVideos.has(videoId);

    // Update the heart visually immediately
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (alreadyLiked) newLiked.delete(videoId);
      else newLiked.add(videoId);
      return newLiked;
    });

    try {
      if (alreadyLiked) {
        await removeFromFavorites(videoId);
      } else {
        await addToFavorites(videoId);
      }
    } catch (err) {
      // revert UI si backend falla
      setLikedVideos(prev => {
        const copy = new Set(prev);
        if (alreadyLiked) copy.add(videoId); else copy.delete(videoId);
        return copy;
      });
    }
  };

  /**
   * Adds a video to user's favorites in backend
   */
  const addToFavorites = async (videoId: number) => {
    if (savingFavorite === videoId) return;
    setSavingFavorite(videoId);

    const video = getVideoFromAnyList(videoId);
    if (!video) { setSavingFavorite(null); return; }

    const bestFile = getBestVideoFile(video.video_files);
    try {
      await api.favorites.add({
        id: String(video.id),
        title: `Video por ${video.user.name}`,
        url: bestFile?.link || video.video_files?.[0]?.link || video.url,
        thumbnail: video.image,
      });
      console.log("✅ Added to favorites");
    } catch (err) {
      console.error("❌ Error adding to favorites:", err);
      throw err;
    } finally {
      setSavingFavorite(null);
    }
  };

  /**
   * Removes a video from user's favorites in backend
   */
  const removeFromFavorites = async (videoId: number) => {
    try {
      await api.favorites.remove(String(videoId));
      console.log("🗑️ Removed from favorites");
    } catch (err) {
      console.error("❌ Error removing from favorites:", err);
      throw err;
    }
  };

  /**
   * Checks if a video is liked
   * @param {number} videoId - The ID of the video to check
   * @returns {boolean} True if the video is liked
   */
  const isLiked = (videoId: number) => likedVideos.has(Number(videoId));

  /**
   * Reloads the current video with subtitles in the new language
   */
  const reloadCurrentVideoWithLanguage = async (newLanguage: string) => {
    if (!selectedVideo) return;

    try {
      console.log(`🔄 Reloading video ${selectedVideo.id} with language: ${newLanguage}`);
      setLoading(true);
      setError('');

      // Strategy 1: Try the standard getVideoById endpoint with language parameter
      try {
        const updatedVideo = await api.pexels.getVideoById(selectedVideo.id, newLanguage);
        if ((updatedVideo as any)?.subtitles?.language === newLanguage) {
          setSelectedVideo(updatedVideo);
          setShowSubtitleOverlay(false);
          setTimeout(() => setShowSubtitleOverlay(true), 100);
          setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('❌ Strategy 1 failed with error:', error);
      }

      // Strategy 2: Use search endpoint which seems to handle language better
      try {
        const searchQuery = selectedVideo.user?.name || 'video';
        const searchResult = await api.pexels.searchVideos(searchQuery, undefined, 1, newLanguage);
        if (searchResult?.videos?.[0]) {
          const candidate = searchResult.videos.find((v: any) => v.id === selectedVideo.id) || searchResult.videos[0];
          if ((candidate as any)?.subtitles?.language === newLanguage) {
            const updatedVideo = { ...selectedVideo, subtitles: (candidate as any).subtitles };
            setSelectedVideo(updatedVideo);
            setShowSubtitleOverlay(false);
            setTimeout(() => setShowSubtitleOverlay(true), 100);
            setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('❌ Strategy 2 failed with error:', error);
      }

      // Strategy 3: Fallback simulated subtitles
      const simulatedSubtitles = createSimulatedSubtitlesForLanguage(newLanguage, selectedVideo);
      const updatedVideo = { ...selectedVideo, subtitles: simulatedSubtitles as any };
      setSelectedVideo(updatedVideo);
      setShowSubtitleOverlay(false);
      setTimeout(() => setShowSubtitleOverlay(true), 100);
      console.log('✅ Strategy 3 successful - Simulated subtitles created');
    } catch (error: any) {
      console.error('❌ All strategies failed:', error);
      setError(`Error al cambiar idioma a ${newLanguage}: ${error?.message ?? 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create simulated subtitles in the requested language
   */
  const createSimulatedSubtitlesForLanguage = (language: string, video: PexelsVideoType) => {
    const duration = video.duration || 30;
    const segments: Array<{ start: number; end: number; text: string; }> = [];
    const segmentDuration = Math.max(3, Math.floor(duration / 6));

    const templates: Record<string, string[]> = {
      es: ["Observamos una escena cautivadora", "La imagen nos revela detalles únicos", "Cada momento captura la esencia visual", "La composición visual es excepcional", "Los elementos se combinan armoniosamente", "Una perspectiva fascinante se despliega"],
      en: ["We observe a captivating scene", "The image reveals unique details", "Each moment captures visual essence", "The visual composition is exceptional", "Elements combine harmoniously", "A fascinating perspective unfolds"],
      fr: ["Nous observons une scène captivante", "L'image révèle des détails uniques", "Chaque moment capture l'essence visuelle", "La composition visuelle est exceptionnelle", "Les éléments se combinent harmonieusement", "Une perspective fascinante se déploie"],
      de: ["Wir beobachten eine fesselnde Szene", "Das Bild enthüllt einzigartige Details", "Jeder Moment erfasst die visuelle Essenz", "Die visuelle Komposition ist außergewöhnlich", "Elemente verbinden sich harmonisch", "Eine faszinierende Perspektive entfaltet sich"],
      it: ["Osserviamo una scena accattivante", "L'immagine rivela dettagli unici", "Ogni momento cattura l'essenza visiva", "La composizione visiva è eccezionale", "Gli elementi si combinano armoniosamente", "Una prospettiva affascinante si sviluppa"],
      pt: ["Observamos uma cena cativante", "A imagem nos revela detalhes únicos", "Cada momento captura a essência visual", "A composição visual é excepcional", "Os elementos se combinam harmoniosamente", "Uma perspectiva fascinante se desenrola"],
      ja: ["魅力的なシーンを観察します", "映像がユニークな詳細を明かします", "各瞬間が視覚的本質を捉えます", "視覚構成は例外的です", "要素が調和よく組み合わさります", "魅力的な視点が展開されます"],
      ko: ["매혹적인 장면을 관찰합니다", "이미지가 독특한 세부사항을 드러냅니다", "각 순간이 시각적 본질을 포착합니다", "시각적 구성이 예외적입니다", "요소들이 조화롭게 결합됩니다", "매혹적인 관점이 펼쳐집니다"],
      zh: ["我们观察到一个迷人的场景", "图像显示独特的细节", "每一刻都捕捉视觉精髓", "视觉构图是例外的", "元素和谐地结合", "迷人的视角展开"],
      ru: ["Мы наблюдаем захватывающую сцену", "Изображение раскрывает уникальные детали", "Каждый момент захватывает визуальную суть", "Визуальная композиция исключительна", "Элементы гармонично сочетаются", "Захватывающая перспектива разворачивается"],
      ar: ["نلاحظ مشهداً آسراً", "الصورة تكشف تفاصيل فريدة", "كل لحظة تلتقط الجوهر البصري", "التركيب البصري استثنائي", "العناصر تتحد بانسجام", "منظور رائع ينكشف"]
    };

    const languageTemplates = templates[language] || templates.es;

    let currentTime = 0;
    let templateIndex = 0;

    while (currentTime < duration && templateIndex < languageTemplates.length) {
      const segmentEnd = Math.min(currentTime + segmentDuration, duration);
      segments.push({
        start: currentTime,
        end: segmentEnd,
        text: languageTemplates[templateIndex]
      });
      currentTime = segmentEnd;
      templateIndex++;
    }

    const srt = segments.map((segment, index) => {
      const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        const pad = (n: number, w = 2) => n.toString().padStart(w, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
      };
      return `${index + 1}\n${formatTime(segment.start)} --> ${formatTime(segment.end)}\n${segment.text}\n`;
    }).join('\n');

    return {
      srt,
      segments,
      language,
      duration,
      hasAudio: false,
      subtitleType: 'visual_description' as const,
      generated: true,
      simulated: true
    };
  };

  /**
   * Handles language change in video modal - Updated to support all languages
   */
  const handleVideoLanguageChange = (newLanguage: string) => {
    console.log(`🌐 Language change requested:`, {
      from: selectedLanguage,
      to: newLanguage,
      currentVideoId: selectedVideo?.id,
      hasCurrentSubtitles: !!(selectedVideo as any)?.subtitles
    });

    setSelectedLanguage(newLanguage);
    reloadCurrentVideoWithLanguage(newLanguage);
  };

  /**
   * Test subtitle generation for debugging language changes
   */
  const testSubtitleGeneration = async (language: string) => {
    try {
      console.log(`🧪 Testing subtitle generation for language: ${language}`);
      const result = await api.pexels.testSubtitles((selectedVideo as any)?.hasAudio || false, language);
      console.log('🧪 Test result:', result);
      const languageName = SUPPORTED_SUBTITLE_LANGUAGES.find(l => l.code === language)?.name || language;
      alert(`🧪 Test de subtítulos en ${languageName}:\n\nResultado: ${result.message}\nIdioma: ${result.language}\nSegmentos: ${result.subtitles?.segments?.length || 0}\n\nRevisa la consola para más detalles.`);
    } catch (error) {
      console.error('🧪 Error testing subtitles:', error);
      alert(`Error en test de subtítulos: ${error}`);
    }
  };

  // --------- Ratings & Comments ---------

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

  /** Load comments when a video is selected */
  useEffect(() => {
    if (selectedVideo) {
      api.comments.getByVideo(String(selectedVideo.id))
        .then(setComments)
        .catch(error => console.error("Error loading comments:", error));
    }
  }, [selectedVideo]);

  /** Adds a new comment to the current video */
  const handleAddComment = async (): Promise<void> => {
    if (!newComment.trim() || !selectedVideo) return;
    try {
      const comment = await api.comments.add({
        videoId: String(selectedVideo.id),
        content: newComment.trim()
      });
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  /** Deletes a specific comment */
  const handleDeleteComment = async (id: string): Promise<void> => {
    try {
      await api.comments.remove(id);
      setComments(comments.filter(c => c._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  /** Prepares the interface for editing a comment */
  const handleEditComment = (comment: Comment): void => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  /** Updates the content of an existing comment */
  const handleUpdateComment = async (id: string): Promise<void> => {
    if (!editContent.trim()) return;
    try {
      const updated = await api.comments.update(id, { content: editContent.trim() });
      const originalComment = comments.find(c => c._id === id);
      if (originalComment) {
        const updatedWithUser = { ...updated, user: originalComment.user };
        setComments(comments.map(c => (c._id === id ? updatedWithUser : c)));
      }
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("❌ Error updating comment:", error);
    }
  };

  /** User rating (local) */
  const [userRating, setUserRating] = useState<number>(0);
  /** Average rating (from server) */
  const [averageRating, setAverageRating] = useState<number>(0);

  /** Load ratings on modal open */
  useEffect(() => {
    if (selectedVideo) {
      api.ratings.getAverage(String(selectedVideo.id))
        .then((res) => setAverageRating(res.average))
        .catch((err) => console.error("Error fetching rating:", err));

      api.ratings.getUserRating(String(selectedVideo.id))
        .then((res) => setUserRating(res.rating))
        .catch((err) => console.error("Error fetching user rating:", err));
    }
  }, [selectedVideo]);

  /** Rate video */
  const handleRating = async (value: number): Promise<void> => {
    if (!selectedVideo) return;
    try {
      setUserRating(value);
      await api.ratings.rateVideo(String(selectedVideo.id), value);
      const res = await api.ratings.getAverage(String(selectedVideo.id));
      setAverageRating(res.average);
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  /** Remove rating */
  const handleRemoveRating = async (): Promise<void> => {
    if (!selectedVideo) return;
    try {
      await api.ratings.removeUserRating(String(selectedVideo.id));
      setUserRating(0);
      const res = await api.ratings.getAverage(String(selectedVideo.id));
      setAverageRating(res.average);
    } catch (err) {
      console.error("Error removing rating:", err);
    }
  };

  return (
    <div className="pexels-page">
      <div className="container">
        {/* ===== RESULTADOS DE BÚSQUEDA ARRIBA ===== */}
        {searchResults !== null ? (
  <section className="search-results">
    <div className="sr-bar">
      <button
        type="button"
        className="sr-back"
        onClick={() => {
          window.dispatchEvent(new Event("pexels:clear"));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Volver al inicio"
        title="Volver"
      >
        ←
      </button>

      <h2 className="sr-title">
        Resultados{searchTerm ? `: “${searchTerm}”` : ""}
      </h2>
    </div>

    {loading && (
      <div className="loading">
        <div className="spinner" />
        <p>Buscando...</p>
      </div>
    )}

    {!loading && (searchResults?.length ?? 0) === 0 && (
      <div className="no-results">
        <p>No se encontraron videos. Intenta con otra búsqueda.</p>
      </div>
    )}

    {/* Grid responsivo (como el inicio), NO rail-track aquí */}
    <div className="search-grid" role="list">
      {searchResults?.map((video) => (
        <div
          key={video.id}
          className="video-card"
          role="listitem"
          onClick={() => openVideoModal(video)}
        >
          <div className="video-thumb-wrap">
            <img
              src={video.image}
              alt={`Video por ${video.user.name}`}
              className="video-thumb"
              loading="lazy"
            />
            <div className="video-overlay">
              <div className="play-button">▶</div>
              <span className="duration">{formatDuration(video.duration)}</span>
            </div>
          </div>

          <div className="video-bottom-bar">
            <div className="info-left">
              <div className="video-title">Video por {video.user.name}</div>
            </div>
            <div className="info-right">
              <button
                className={`simple-heart ${isLiked(video.id) ? "liked" : ""}`}
                onClick={(e) => toggleLike(video.id, e)}
                aria-label={isLiked(video.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isLiked(video.id) ? "❤️" : "♡"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>

        ) : (
          <>
            {/* ===== HERO (sin overlays) ===== */}
            {featured && (
              <section className="pexels-hero" aria-label="Destacado">
                <div className="hero-media">
                  {getBestVideoFile(featured.video_files) ? (
                    <video
                      className="hero-video"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={featured.image}
                    >
                      <source
                        src={getBestVideoFile(featured.video_files)!.link}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      className="hero-poster"
                      src={featured.image}
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                </div>
              </section>
            )}

            {/* ===== RIELES POR CATEGORÍA ===== */}
            <section id="rails" className="pexels-rails">
              {CATEGORIES.map((cat) => {
                const list = byCategory[cat.key] || [];
                if (!list.length) return null;
                return (
                  <div key={cat.key} className="rail-block">
                    <div className="rail-head">
                      <h2 className="rail-title">{cat.title}</h2>
                      <div className="rail-controls">
                        <button
                          className="rail-btn prev"
                          onClick={() => scrollRail(cat.key, "prev")}
                          aria-label="Anterior"
                        >‹</button>
                        <button
                          className="rail-btn next"
                          onClick={() => scrollRail(cat.key, "next")}
                          aria-label="Siguiente"
                        >›</button>
                      </div>
                    </div>

                    <div className="rail-track" ref={setRailRef(cat.key)}>
                      {(byCategory[cat.key] || []).map((v) => (
                        <VideoCard
                          key={v.id}
                          video={v as any}
                          onPlay={(vv) => openVideoModal(vv as any)}
                          onToggleFav={(id, e) => toggleLike(id, e)}
                          isFav={isLiked(v.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}

        {/* errores / loading compartidos */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando videos...</p>
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
                {(selectedVideo as any).subtitles && (selectedVideo as any).subtitles.segments.length > 0 && (
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
                        onChange={(e) => handleVideoLanguageChange(e.target.value)}
                        className="video-language-select"
                        title="Cambiar idioma de subtítulos"
                      >
                        {SUPPORTED_SUBTITLE_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.code.toUpperCase()}
                          </option>
                        ))}
                      </select>

                      {/* Debug button to test subtitle generation */}
                      <button
                        onClick={() => testSubtitleGeneration(selectedLanguage)}
                        className="test-subtitle-btn"
                        title="Probar generación de subtítulos"
                        style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}
                      >
                        🧪 Test
                      </button>

                      {/* Force English subtitle regeneration button */}
                      <button
                        onClick={() => {
                          console.log('🔄 Forcing English subtitle regeneration...');
                          reloadCurrentVideoWithLanguage('en');
                        }}
                        className="test-subtitle-btn"
                        title="Forzar subtítulos en inglés"
                        style={{ marginLeft: '5px', fontSize: '12px', padding: '4px 8px', backgroundColor: '#007bff' }}
                      >
                        🇺🇸 Force EN
                      </button>
                    </div>
                  </div>

                  {/* Subtitle Overlay */}
                  {(selectedVideo as any).subtitles && (selectedVideo as any).subtitles.segments.length > 0 && (
                    <VideoSubtitleOverlay
                      segments={(selectedVideo as any).subtitles.segments}
                      visible={showSubtitleOverlay}
                      videoRef={videoRef}
                      language={(selectedVideo as any).subtitles.language}
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
                videoId={String(selectedVideo.id)}
                videoUrl={selectedVideo.video_files?.[0]?.link || ''}
                automaticSubtitles={(selectedVideo as any).subtitles || null}
                hasAudio={(selectedVideo as any).hasAudio || false}
                audioStatus={(selectedVideo as any).audioStatus || 'unknown'}
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

                    {/* Permisos del autor del comentario */}
                    {(() => {
                      try {
                        const token = localStorage.getItem("token");
                        if (!token) return false;
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        return c.user._id === payload.id;
                      } catch {
                        return false;
                      }
                    })() && (
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
