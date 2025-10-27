import React, { useRef } from "react";
import VideoCard, { Video } from "./VideoCard";

export default function VideoRail({
  title,
  videos,
  onPlay,
  onToggleFav,
  isFav,
}: {
  title: string;
  videos: Video[];
  onPlay: (v: Video, trigger?: HTMLButtonElement | null) => void;
  onToggleFav: (id: number, e: React.MouseEvent) => void;
  isFav: (id: number) => boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="rail" aria-label={title}>
      <div className="rail-head">
        <h2 className="rail-title">{title}</h2>
        <div className="rail-ctrls" role="group" aria-label={`Controles de ${title}`}>
          <button className="rail-btn" onClick={() => scrollBy("prev")} aria-label="Anterior">‹</button>
          <button className="rail-btn" onClick={() => scrollBy("next")} aria-label="Siguiente">›</button>
        </div>
      </div>

      <div className="rail-track" ref={ref}>
        {videos.map(v => (
          <VideoCard
            key={v.id}
            video={v}
            onPlay={onPlay}
            onToggleFav={onToggleFav}
            isFav={isFav(v.id)}
          />
        ))}
      </div>
    </section>
  );
}
