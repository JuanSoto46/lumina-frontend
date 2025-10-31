import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { VideoSubtitles, SubtitleSegment } from '../types/video.types';

interface SubtitleViewerProps {
  videoId: string | number;
  videoUrl?: string;
  className?: string;
  // New props for automatic subtitles
  automaticSubtitles?: VideoSubtitles | null;
  hasAudio?: boolean;
  audioStatus?: 'detected' | 'silent' | 'unknown';
}

interface Subtitle {
  id: string;
  videoId: string;
  text: string;
  startTime: number;
  endTime: number;
  language: string;
  createdAt: string;
}

export default function SubtitleViewer({ 
  videoId, 
  videoUrl, 
  className = '',
  automaticSubtitles = null,
  hasAudio = false,
  audioStatus = 'unknown'
}: SubtitleViewerProps) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [displayMode, setDisplayMode] = useState<'automatic' | 'manual' | 'none'>('none');

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
  ];

  // Check for automatic subtitles on component mount
  useEffect(() => {
    if (automaticSubtitles && automaticSubtitles.segments.length > 0) {
      console.log('=== SUBTITLE VIEWER: AUTOMATIC SUBTITLES DETECTED ===');
      console.log('Subtitle info:', {
        segmentCount: automaticSubtitles.segments.length,
        hasAudio: hasAudio,
        subtitleType: automaticSubtitles.subtitleType,
        language: automaticSubtitles.language,
        isSimulated: automaticSubtitles.simulated
      });
      setDisplayMode('automatic');
    } else {
      console.log('=== SUBTITLE VIEWER: NO AUTOMATIC SUBTITLES ===');
      // Try to load manual subtitles if no automatic ones available
      setDisplayMode('manual');
      loadSubtitles();
    }
  }, [automaticSubtitles, videoId]);

  /**
   * Carga los subtítulos existentes para el video
   */
  const loadSubtitles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.subtitles.getSubtitles(videoId);
      console.log('Subtitles loaded:', data);
      
      if (Array.isArray(data)) {
        setSubtitles(data);
      } else if (data.subtitles && Array.isArray(data.subtitles)) {
        setSubtitles(data.subtitles);
      } else {
        setSubtitles([]);
      }
    } catch (err: any) {
      console.error('Error loading subtitles:', err);
      if (err.message.includes('404') || err.message.includes('not found')) {
        setSubtitles([]);
        setError(null); // No mostrar error si no hay subtítulos
      } else {
        // Traducir mensajes de error al español
        let errorMessage = 'Error al cargar subtítulos';
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Error de conexión al cargar subtítulos.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Error del servidor al cargar subtítulos.';
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Genera subtítulos desde archivo de audio
   */
  const generateFromFile = async () => {
    if (!audioFile) return;

    try {
      setGenerating(true);
      setError(null);

      const data = await api.subtitles.generateFromFile(audioFile, selectedLanguage);
      console.log('Subtitles generated from file:', data);
      
      // Recargar subtítulos después de generar
      await loadSubtitles();
      setShowGenerator(false);
      setAudioFile(null);
    } catch (err: any) {
      console.error('Error generating subtitles from file:', err);
      
      // Traducir mensajes de error al español
      let errorMessage = 'Error al generar subtítulos desde archivo';
      if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Error de conexión al generar subtítulos.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Error del servidor al generar subtítulos.';
      } else if (err.message.includes('unsupported') || err.message.includes('format')) {
        errorMessage = 'Formato de archivo no soportado.';
      } else if (err.message.includes('too large')) {
        errorMessage = 'El archivo es demasiado grande.';
      }
      
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Genera subtítulos desde URL de video
   */
  const generateFromURL = async () => {
    if (!videoUrl) return;

    try {
      setGenerating(true);
      setError(null);

      const data = await api.subtitles.generateFromURL(videoUrl, selectedLanguage);
      console.log('Subtitles generated from URL:', data);
      
      // Recargar subtítulos después de generar
      await loadSubtitles();
      setShowGenerator(false);
    } catch (err: any) {
      console.error('Error generating subtitles from URL:', err);
      
      // Traducir mensajes de error al español
      let errorMessage = 'Error al generar subtítulos desde URL';
      if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Error de conexión al generar subtítulos.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Error del servidor al generar subtítulos.';
      } else if (err.message.includes('invalid') || err.message.includes('url')) {
        errorMessage = 'URL de video inválida.';
      } else if (err.message.includes('not found')) {
        errorMessage = 'Video no encontrado en la URL proporcionada.';
      }
      
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Renderiza los subtítulos automáticos del backend
   */
  const renderAutomaticSubtitles = () => {
    if (!automaticSubtitles || !automaticSubtitles.segments.length) {
      return null;
    }

    return (
      <div className="automatic-subtitles">
        <div className="subtitle-info">
          <div className="info-row">
            <span className="info-label">Tipo:</span>
            <span className="info-value">
              {automaticSubtitles.subtitleType === 'transcription' ? '🎵 Transcripción de audio' : '👁️ Descripción visual'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Audio:</span>
            <span className="info-value">
              {hasAudio ? '🔊 Detectado' : '🔇 Silencioso'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Segmentos:</span>
            <span className="info-value">{automaticSubtitles.segments.length} líneas</span>
          </div>
          <div className="info-row">
            <span className="info-label">Duración:</span>
            <span className="info-value">{automaticSubtitles.duration}s</span>
          </div>
          <div className="info-row">
            <span className="info-label">Idioma:</span>
            <span className="info-value">{automaticSubtitles.language.toUpperCase()}</span>
          </div>
          {automaticSubtitles.simulated && (
            <div className="info-row">
              <span className="info-label">Estado:</span>
              <span className="info-value simulated">⚡ Generado automáticamente</span>
            </div>
          )}
        </div>

        <div className="subtitle-display">
          {automaticSubtitles.segments.map((segment: SubtitleSegment, index: number) => (
            <div key={index} className="subtitle-line">
              <span className="timestamp">
                {formatTime(segment.start)} → {formatTime(segment.end)}
              </span>
              <span className="text">{segment.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Maneja la selección de archivo de audio
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/x-wav'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
        setError('Formato de archivo no soportado. Use MP3, WAV o M4A.');
        return;
      }
      setAudioFile(file);
      setError(null);
    }
  };

  /**
   * Formatea el tiempo en formato mm:ss
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (videoId) {
      loadSubtitles();
    }
  }, [videoId]);

  return (
    <div className={`subtitle-viewer ${className}`}>
      <div className="subtitle-header">
        <h3>📝 Subtítulos del Video</h3>
        <div className="header-info">
          {automaticSubtitles ? (
            <span className="status-badge available">
              ✅ Automáticos disponibles
            </span>
          ) : (
            <span className="status-badge unavailable">
              ⚪ Solo personalizados
            </span>
          )}
        </div>
        <div className="subtitle-actions">
          <button 
            className="btn-secondary"
            onClick={() => setShowGenerator(!showGenerator)}
            disabled={generating}
          >
            {showGenerator ? 'Cancelar' : 'Generar Subtítulos'}
          </button>
          {subtitles.length > 0 && (
            <button 
              className="btn-primary"
              onClick={loadSubtitles}
              disabled={loading}
            >
              🔄 Actualizar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {showGenerator && (
        <div className="subtitle-generator">
          <h4>Generar Nuevos Subtítulos</h4>
          
          <div className="generator-options">
            <div className="language-selector">
              <label htmlFor="language">Idioma:</label>
              <select 
                id="language"
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="generation-methods">
              {videoUrl && (
                <div className="method-option">
                  <h5>Desde URL del Video</h5>
                  <p>URL: {videoUrl}</p>
                  <button 
                    className="btn-primary"
                    onClick={generateFromURL}
                    disabled={generating}
                  >
                    {generating ? 'Generando...' : 'Generar desde URL'}
                  </button>
                </div>
              )}

              <div className="method-option">
                <h5>Desde Archivo de Audio</h5>
                <input 
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a"
                  onChange={handleFileChange}
                  disabled={generating}
                />
                {audioFile && (
                  <div className="file-info">
                    <p>Archivo seleccionado: {audioFile.name}</p>
                    <button 
                      className="btn-primary"
                      onClick={generateFromFile}
                      disabled={generating}
                    >
                      {generating ? 'Generando...' : 'Generar desde Archivo'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {generating && (
            <div className="generating-status">
              <div className="loading-spinner"></div>
              <p>Generando subtítulos... Esto puede tomar unos minutos.</p>
            </div>
          )}
        </div>
      )}

      <div className="subtitle-content">
        {/* Display mode selector */}
        <div className="display-mode-selector">
          {automaticSubtitles && (
            <button
              className={`mode-btn ${displayMode === 'automatic' ? 'active' : ''}`}
              onClick={() => setDisplayMode('automatic')}
            >
              📝 Subtítulos Automáticos
            </button>
          )}
          <button
            className={`mode-btn ${displayMode === 'manual' ? 'active' : ''}`}
            onClick={() => {
              setDisplayMode('manual');
              if (subtitles.length === 0) {
                loadSubtitles();
              }
            }}
          >
            🔧 Subtítulos Personalizados
          </button>
        </div>

        {/* Content based on display mode */}
        {displayMode === 'automatic' && automaticSubtitles ? (
          renderAutomaticSubtitles()
        ) : displayMode === 'manual' ? (
          loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Cargando subtítulos...</p>
            </div>
          ) : subtitles.length > 0 ? (
            <div className="subtitle-list">
              <div className="subtitle-info">
                <p>{subtitles.length} subtítulos disponibles</p>
                {subtitles[0]?.language && (
                  <p>Idioma: {languages.find(l => l.code === subtitles[0].language)?.name || subtitles[0].language}</p>
                )}
              </div>
              <div className="subtitle-items">
                {subtitles.map((subtitle, index) => (
                  <div key={subtitle.id || index} className="subtitle-item">
                    <div className="subtitle-time">
                      {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                    </div>
                    <div className="subtitle-text">
                      {subtitle.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-subtitles">
              <p>No hay subtítulos personalizados para este video.</p>
              <p>Puedes generar subtítulos automáticamente usando el botón de arriba.</p>
            </div>
          )
        ) : (
          <div className="no-subtitles">
            {automaticSubtitles ? (
              <div>
                <p>📝 Subtítulos automáticos disponibles</p>
                <p>Haz clic en "Subtítulos Automáticos" para verlos.</p>
              </div>
            ) : (
              <div>
                <p>No hay subtítulos disponibles para este video.</p>
                <p>Puedes generar subtítulos personalizados usando el botón "🔧 Generar Subtítulos".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}