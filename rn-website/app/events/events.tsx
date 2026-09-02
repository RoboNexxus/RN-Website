"use client";

import AnimePageHero from "@/components/ui/anime-page-hero";

export default function Events() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-14">
      <AnimePageHero title="Events" />

      {/* Featured Event — ROBOTRONICS'26 */}
      <div className="w-full max-w-6xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-sans font-normal uppercase tracking-widest">Featured</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Big video card */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
          {/* 16:9 responsive wrapper */}
          <div className="relative w-full" style={{ paddingBottom: "42.78%" /* 616/1440 */ }}>
            <iframe
              src="https://www.youtube.com/embed/KLl61f3jmo0"
              title="ROBOTRONICS'26 | Closing Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Card footer */}
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/10">
            <div>
              <h2 className="text-lg font-semibold text-white font-sans">ROBOTRONICS&apos;26</h2>
              <p className="text-sm text-neutral-400 font-sans font-normal mt-0.5">Closing Video</p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=KLl61f3jmo0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white font-sans font-normal transition-colors duration-150 whitespace-nowrap"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
