import React, { useState, useEffect, useRef } from 'react';
import { SubtitleSegment } from '../types/video.types';

interface VideoSubtitleOverlayProps {
  /** Array of subtitle segments */
  segments: SubtitleSegment[];
  /** Whether to show subtitles */
  visible: boolean;
  /** Video element reference to sync with */
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  /** Language code for styling */
  language?: string;
  /** Custom class name */
  className?: string;
}

export default function VideoSubtitleOverlay({ 
  segments, 
  visible, 
  videoRef,
  language = 'es',
  className = '' 
}: VideoSubtitleOverlayProps) {
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!videoRef?.current || !visible || segments.length === 0) {
      setCurrentSubtitle('');
      return;
    }

    const video = videoRef.current;

    const updateSubtitle = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      
      // Find the current subtitle segment
      const currentSegment = segments.find(
        segment => time >= segment.start && time <= segment.end
      );
      
      setCurrentSubtitle(currentSegment?.text || '');
    };

    // Update subtitles as video plays
    video.addEventListener('timeupdate', updateSubtitle);
    video.addEventListener('loadedmetadata', updateSubtitle);
    video.addEventListener('seeked', updateSubtitle);

    return () => {
      video.removeEventListener('timeupdate', updateSubtitle);
      video.removeEventListener('loadedmetadata', updateSubtitle);
      video.removeEventListener('seeked', updateSubtitle);
    };
  }, [segments, visible, videoRef]);

  if (!visible || !currentSubtitle) {
    return null;
  }

  return (
    <div className={`video-subtitle-overlay ${className}`}>
      <div className="subtitle-text" lang={language}>
        {currentSubtitle}
      </div>
      
      {/* Optional: Progress indicator */}
      <div className="subtitle-progress">
        {segments.length > 0 && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${Math.min(100, (currentTime / Math.max(...segments.map(s => s.end))) * 100)}%`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}