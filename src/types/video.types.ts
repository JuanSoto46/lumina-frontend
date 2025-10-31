/**
 * @fileoverview TypeScript interfaces for video and subtitle types
 * @version 1.0.0
 */

/**
 * Subtitle segment with timing information
 */
export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

/**
 * Subtitle object structure from backend - Updated for latest backend features
 */
export interface VideoSubtitles {
  srt: string;
  segments: SubtitleSegment[];
  language: string;
  languageName?: string; // Human-readable language name
  duration: number;
  hasAudio: boolean;
  subtitleType: 'transcription' | 'visual_description';
  generated: boolean;
  videoId?: string;
  aiContent?: string;
  simulated?: boolean;
  provider?: string; // e.g., 'openai-gpt-3.5-turbo'
  whisperModel?: string | null;
}

/**
 * Pexels video file structure
 */
export interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

/**
 * Pexels user structure
 */
export interface VideoUser {
  id: number;
  name: string;
  url: string;
}

/**
 * Enhanced Pexels video structure with subtitles
 */
export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: VideoUser;
  video_files: VideoFile[];
  tags: string[];
  // New subtitle properties from backend
  subtitles?: VideoSubtitles;
  hasSubtitles?: boolean;
  hasAudio?: boolean;
  audioStatus?: 'detected' | 'silent';
}

/**
 * Pexels API response structure
 */
export interface PexelsApiResponse {
  page: number;
  per_page: number;
  videos: PexelsVideo[];
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

/**
 * Comment structure for video comments
 */
export interface VideoComment {
  _id: string;
  content: string;
  user: {
    _id: string;
    firstName: string;
  };
  createdAt: string;
}

/**
 * Rating structure for video ratings
 */
export interface VideoRating {
  _id: string;
  rating: number;
  user: {
    _id: string;
    firstName: string;
  };
  createdAt: string;
}

/**
 * Supported languages for subtitle generation - Updated to match backend
 */
export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
}

/**
 * Available languages for subtitle generation
 */
export const SUPPORTED_SUBTITLE_LANGUAGES: SupportedLanguage[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];