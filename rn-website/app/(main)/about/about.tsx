"use client";

import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import AboutModel from "@/components/ui/about-model";

export default function About() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 md:px-8 py-10 md:py-16">
      <section className="w-full max-w-7xl min-h-[calc(100dvh-8rem)] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4">
          <AnimeScrollReveal
            className="lg:col-span-6 lg:col-start-1 lg:row-start-1 z-10"
            fromY={1.5}
          >
            <div className="text-left">
              <p className="text-[clamp(2rem,6vw,4.75rem)] font-black leading-[0.95] tracking-tight text-neutral-200">
                We’re not here just to take part.
              </p>
              <p className="text-[clamp(2rem,6vw,4.75rem)] font-black leading-[0.95] tracking-tight text-white/90 mt-3 md:mt-4">
                We’re here to take over.
              </p>
              <p className="text-[clamp(2.6rem,8vw,6.5rem)] font-black leading-[0.9] tracking-tight text-white mt-4 md:mt-5">
                We’re here to win.
              </p>
            </div>
          </AnimeScrollReveal>

          <div className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <AnimeScrollReveal className="w-full" fromY={1.5}>
              <AboutModel />
            </AnimeScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
