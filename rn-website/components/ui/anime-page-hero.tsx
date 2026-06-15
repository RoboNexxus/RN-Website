"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { cn } from "@/lib/utils";

interface AnimePageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * A page hero heading that animates in with anime.js:
 *  - Title chars stagger up + fade in
 *  - Optional subtitle slides in below with a slight delay
 */
export default function AnimePageHero({
  title,
  subtitle,
  className,
}: AnimePageHeroProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Animate each letter span
    const chars = wrapperRef.current.querySelectorAll<HTMLSpanElement>(".anime-char");
    if (chars.length === 0) return;

    animate(chars, {
      opacity: [0, 1],
      translateY: ["0.6em", "0em"],
      duration: 700,
      ease: "outExpo",
      delay: stagger(45, { start: 80 }),
    });

    // Animate the subtitle if present
    const sub = wrapperRef.current.querySelector<HTMLParagraphElement>(".anime-subtitle");
    if (sub) {
      animate(sub, {
        opacity: [0, 1],
        translateY: ["1rem", "0rem"],
        duration: 600,
        ease: "outCubic",
        delay: chars.length * 45 + 100,
      });
    }
  }, [title]);

  const chars = title.split("");

  return (
    <div ref={wrapperRef} className={cn("text-center", className)}>
      <h1 className="text-5xl font-bold font-pixelify overflow-hidden inline-block">
        {chars.map((char, i) => (
          <span
            key={i}
            className="anime-char inline-block"
            style={{ opacity: 0 }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      {subtitle && (
        <p
          className="anime-subtitle mt-4 text-neutral-400 text-lg max-w-xl mx-auto"
          style={{ opacity: 0 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
