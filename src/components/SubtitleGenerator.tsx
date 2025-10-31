import React, { useState } from 'react';
import { api } from '../services/api';
import { VideoSubtitles, SUPPORTED_SUBTITLE_LANGUAGES } from '../types/video.types';

interface SubtitleGeneratorProps {
  /** Callback when subtitles are successfully generated */
  onSubtitlesGenerated?: (subtitles: VideoSubtitles) => void;
  /** Callback when generation fails */
  onError?: (error: string) => void;
  /** Whether the generator is currently visible */
  visible?: boolean;
  /** Custom class name */
  className?: string;
}

export default function SubtitleGenerator({
  onSubtitlesGenerated,
  onError,
  visible = true,
  className = ''
}: SubtitleGeneratorProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [dragOver, setDragOver] = useState(false);

  const supportedFormats = ['mp3', 'wav', 'm4a', 'mp4', 'mpeg', 'mpga', 'webm'];

  /**
   * Handle file selection via input
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  /**
   * Handle file drop
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  /**
   * Generate subtitles from uploaded file
   */
  const generateFromFile = async () => {
    if (!audioFile) {
      onError?.('Por favor selecciona un archivo de audio');
      return;
    }

    setGenerating(true);
    try {
      console.log(`Generando subtítulos desde archivo: ${audioFile.name} (${selectedLanguage})`);
      const result = await api.subtitles.generateFromFile(audioFile, selectedLanguage);
      console.log('✅ Subtítulos generados desde archivo:', result);
      
      if (result.subtitles) {
        onSubtitlesGenerated?.(result.subtitles);
      } else {
        onError?.('No se pudieron generar los subtítulos');
      }
    } catch (error: any) {
      console.error('❌ Error generando subtítulos desde archivo:', error);
      onError?.(error.message || 'Error al generar subtítulos desde archivo');
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Generate subtitles from video URL
   */
  const generateFromURL = async () => {
    if (!videoUrl.trim()) {
      onError?.('Por favor ingresa una URL de video');
      return;
    }

    setGenerating(true);
    try {
      console.log(`Generando subtítulos desde URL: ${videoUrl} (${selectedLanguage})`);
      const result = await api.subtitles.generateFromURL(videoUrl, selectedLanguage);
      console.log('✅ Subtítulos generados desde URL:', result);
      
      if (result.subtitles) {
        onSubtitlesGenerated?.(result.subtitles);
      } else {
        onError?.('No se pudieron generar los subtítulos');
      }
    } catch (error: any) {
      console.error('❌ Error generando subtítulos desde URL:', error);
      onError?.(error.message || 'Error al generar subtítulos desde URL');
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Check if file format is supported
   */
  const isFileSupported = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? supportedFormats.includes(extension) : false;
  };

  if (!visible) return null;

  return (
    <div className={`subtitle-generator ${className}`}>
      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'file' ? 'active' : ''}`}
          onClick={() => setMode('file')}
          disabled={generating}
        >
          📁 Subir Archivo
        </button>
        <button
          className={`mode-btn ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
          disabled={generating}
        >
          🔗 URL de Video
        </button>
      </div>

      {/* Language Selector - Updated to use all supported languages */}
      <div className="language-selection">
        <label>Idioma de los subtítulos:</label>
        <div className="language-options">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="language-select"
            disabled={generating}
          >
            {SUPPORTED_SUBTITLE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload Mode */}
      {mode === 'file' && (
        <div className="file-upload-section">
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${audioFile ? 'has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {audioFile ? (
              <div className="file-selected">
                <div className="file-info">
                  <span className="file-icon">🎵</span>
                  <div className="file-details">
                    <span className="file-name">{audioFile.name}</span>
                    <span className="file-size">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={() => setAudioFile(null)}
                  disabled={generating}
                >
                  ❌
                </button>
              </div>
            ) : (
              <div className="drop-zone-content">
                <span className="upload-icon">⬆️</span>
                <p>Arrastra y suelta un archivo de audio aquí</p>
                <p className="supported-formats">
                  Formatos soportados: {supportedFormats.join(', ')}
                </p>
                <input
                  type="file"
                  accept={supportedFormats.map(f => `.${f}`).join(',')}
                  onChange={handleFileSelect}
                  className="file-input"
                  disabled={generating}
                />
                <button
                  className="browse-btn"
                  onClick={() => (document.querySelector('.file-input') as HTMLInputElement)?.click()}
                  disabled={generating}
                >
                  Seleccionar archivo
                </button>
              </div>
            )}
          </div>

          {audioFile && !isFileSupported(audioFile) && (
            <div className="warning-message">
              ⚠️ Este formato de archivo podría no ser compatible
            </div>
          )}

          <button
            className="generate-btn"
            onClick={generateFromFile}
            disabled={!audioFile || generating}
          >
            {generating ? '🔄 Generando...' : '🎬 Generar Subtítulos'}
          </button>
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="url-input-section">
          <div className="url-input-group">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://ejemplo.com/video.mp4"
              className="url-input"
              disabled={generating}
            />
          </div>

          <button
            className="generate-btn"
            onClick={generateFromURL}
            disabled={!videoUrl.trim() || generating}
          >
            {generating ? '🔄 Generando...' : '🎬 Generar Subtítulos'}
          </button>
        </div>
      )}

      {/* Progress indicator */}
      {generating && (
        <div className="progress-indicator">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Procesando audio y generando subtítulos...</p>
          <p className="language-info">
            🌍 Generando en: {SUPPORTED_SUBTITLE_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
          </p>
        </div>
      )}
    </div>
  );
}