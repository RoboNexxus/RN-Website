"use client";

import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";

export default function About() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <AnimePageHero title="About Us" />

      {/* Origin */}
      <AnimeScrollReveal className="max-w-2xl text-center" fromY={1.5}>
        <p className="text-neutral-300 leading-relaxed text-base">
          Established in 2024,{" "}
          <span className="text-white font-semibold">Robo Nexus</span> is the
          official robotics club of{" "}
          <span className="text-white font-semibold">
            Amity International School, Sector-46, Gurugram
          </span>
          . We are a passionate community of students dedicated to exploring the
          fascinating world of robotics, automation, and emerging technologies.
        </p>
      </AnimeScrollReveal>

      {/* Divider */}
      <div className="w-full max-w-2xl h-px bg-white/10" />

      {/* Mission */}
      <AnimeScrollReveal className="max-w-2xl text-center" fromY={1.5}>
        <h2 className="text-xl font-semibold mb-4 text-white">Our Mission</h2>
        <p className="text-neutral-400 leading-relaxed text-base">
          Our mission is to inspire innovation, creativity, and hands-on
          learning. We believe in learning by doing — building robots, coding
          solutions, and pushing the boundaries of what's possible with
          technology.
        </p>
      </AnimeScrollReveal>
    </main>
  );
}
