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
 * Subtitle object structure from backend
 */
export interface VideoSubtitles {
  srt: string;
  segments: SubtitleSegment[];
  language: string;
  duration: number;
  hasAudio: boolean;
  subtitleType: 'transcription' | 'visual_description';
  generated: boolean;
  videoId: string;
  aiContent?: string;
  simulated?: boolean;
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
}