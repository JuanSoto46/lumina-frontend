import React from "react";

type File = { id: number; quality: string; width: number; height: number; link: string };
export type Video = {
  id: number;
  image: string;
  duration: number;
  user: { name: string };
  video_files?: File[];
};

export function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function VideoCard({
  video,
  onPlay,
  onToggleFav,
  isFav,
}: {
  video: Video;
  onPlay: (v: Video, trigger?: HTMLButtonElement | null) => void;
  onToggleFav: (id: number, e: React.MouseEvent) => void;
  isFav: boolean;
}) {
  const duration = formatDuration(video.duration);
  return (
    <article className="video-card rail-card">
      <button
        type="button"
        className="thumb-trigger"
        onClick={(e) => onPlay(video, e.currentTarget)}
        aria-label={`Reproducir video por ${video.user.name}, duración ${duration}`}
      >
        <div className="rail-thumb">
          <img
            src={video.image}
            alt={`Miniatura del video por ${video.user.name}`}
            loading="lazy"
          />
          <span className="rail-duration" aria-hidden="true">{duration}</span>
          <div className="rail-overlay" aria-hidden="true">
            <div className="rail-play">▶</div>
          </div>
        </div>
      </button>

      <div className="rail-info">
        <div className="rail-title" title={`Video por ${video.user.name}`}>
          Video por {video.user.name}
        </div>
        <button
          type="button"
          className={`rail-heart ${isFav ? "liked" : ""}`}
          aria-pressed={isFav}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          onClick={(e) => onToggleFav(video.id, e)}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
    </article>
  );
}
