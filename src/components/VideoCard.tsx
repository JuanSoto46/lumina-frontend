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
        <figure className="rail-thumb" aria-label={`Miniatura del video por ${video.user.name}`}>
          {/* El contenedor mantiene 16:9 y recorta la imagen para evitar franjas */}
          <img
            src={video.image}
            alt={`Miniatura del video por ${video.user.name}`}
            loading="lazy"
          />

          <div className="rail-badges" aria-hidden="true">
            <span className="rail-duration">{duration}</span>
          </div>

          <div className="rail-overlay" aria-hidden="true">
            <div className="rail-play">▶</div>
          </div>

          {/* Corazón arriba-derecha dentro del thumb */}
          <button
            type="button"
            className={`rail-heart ${isFav ? "liked" : ""}`}
            aria-pressed={isFav}
            aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={(e) => onToggleFav(video.id, e)}
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </figure>
      </button>

      {/* Título DEBAJO, bonito y truncado a 2 líneas */}
      <div className="rail-info">
        <div className="rail-title" title={`Video por ${video.user.name}`}>
          Video por {video.user.name}
        </div>
      </div>
    </article>
  );
}
