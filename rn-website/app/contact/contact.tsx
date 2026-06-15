"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import SocialFlipButton from "@/components/ui/social-flip-button";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";

/**
 * Wraps the contact body — slides in the content block with anime.js on mount.
 */
function AnimatedContactBody({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      opacity: [0, 1],
      translateY: ["1.5rem", "0rem"],
      duration: 700,
      ease: "outExpo",
      delay: 400, // after hero chars finish animating
    });
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export default function Contact() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 gap-10">
      <Meteors />

      <AnimePageHero
        title="Get in Touch"
        subtitle="Have a question, idea, or just want to say hi? Find us on any of the platforms below."
      />

      <AnimatedContactBody>
        <SocialFlipButton />
      </AnimatedContactBody>
    </main>
  );
}
