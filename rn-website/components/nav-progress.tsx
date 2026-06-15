"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";

/**
 * A thin progress bar at the very top of the viewport that fires on every
 * route change using anime.js — a visual cue that navigation happened.
 */
export default function NavProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!barRef.current) return;

    // Skip the very first render — page hasn't "navigated" yet
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const bar = barRef.current;

    // Reset to start
    bar.style.width = "0%";
    bar.style.opacity = "1";

    animate(bar, {
      width: ["0%", "100%"],
      duration: 420,
      ease: "outExpo",
      onComplete: () => {
        animate(bar, {
          opacity: [1, 0],
          duration: 200,
          ease: "outQuad",
          onComplete: () => {
            bar.style.width = "0%";
          },
        });
      },
    });
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[100] pointer-events-none">
      <div
        ref={barRef}
        style={{ width: "0%", opacity: 0 }}
        className="h-full bg-white/70"
      />
    </div>
  );
}
