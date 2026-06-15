"use client";

import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";

export default function About() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <Meteors />

      {/*
        AnimePageHero uses anime.js to stagger-reveal each character of the title
        and fade in the subtitle below it.
      */}
      <AnimePageHero
        title="About Us"
        subtitle="Robo Nexus is a community of builders, tinkerers, and innovators
          pushing the boundaries of robotics and autonomous systems."
      />

      {/* Stats row — each card slides up with a stagger when scrolled into view */}
      <AnimeScrollReveal
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl"
        staggerDelay={120}
        fromY={1.5}
      >
        {[
          { label: "Members", value: "50+" },
          { label: "Projects Built", value: "20+" },
          { label: "Events Hosted", value: "10+" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="reveal-item flex flex-col items-center justify-center gap-2 rounded-2xl glass-border bg-white/5 dark:bg-white/5 py-8"
          >
            <span className="text-4xl font-bold font-pixelify">{value}</span>
            <span className="text-neutral-400 text-sm uppercase tracking-widest">
              {label}
            </span>
          </div>
        ))}
      </AnimeScrollReveal>

      {/* Mission block */}
      <AnimeScrollReveal className="max-w-2xl text-center" fromY={1.5}>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-neutral-400 leading-relaxed">
          We believe anyone can build intelligent machines. Our mission is to
          democratize robotics education through hands-on projects, workshops,
          and a collaborative open-source culture.
        </p>
      </AnimeScrollReveal>
    </main>
  );
}
