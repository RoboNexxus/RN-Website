"use client";

import { useRef, useState } from "react";
import eventsData from "@/data/events.json";

const { videoUrl, thumbnailUrl } = eventsData.events[0];

export default function Events() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    video.requestFullscreen?.();
    setPlaying(true);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        controls={playing}
        playsInline
        preload="none"
        className="w-full h-full object-cover"
        onEnded={() => setPlaying(false)}
      />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <button
            onClick={play}
            aria-label="Play"
            className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-200"
          >
            <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
