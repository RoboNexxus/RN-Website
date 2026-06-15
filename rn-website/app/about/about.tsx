"use client";

import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";

export default function About() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 gap-8">
      <Meteors />
      <AnimePageHero title="About Us" />
    </main>
  );
}
