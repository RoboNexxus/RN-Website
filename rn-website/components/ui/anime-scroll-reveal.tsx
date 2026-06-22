"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";
import { cn } from "@/lib/utils";
import { ANIMATION_CONFIG } from "@/lib/animation-config";

interface AnimeScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Translate-Y start offset in rem. Default: 2 */
  fromY?: number;
  /** Animation duration in ms. Default: ANIMATION_CONFIG.duration.scrollReveal (700) */
  duration?: number;
  /** Stagger delay between sibling `.reveal-item` children, in ms. Default: 0 (no stagger, capped at 100ms) */
  staggerDelay?: number;
}

/**
 * Wraps children and fades + slides them in with anime.js when they enter
 * the viewport. Optionally staggers direct `.reveal-item` children.
 */
export default function AnimeScrollReveal({
  children,
  className,
  fromY = 2,
  duration = ANIMATION_CONFIG.duration.scrollReveal,
  staggerDelay = 0,
}: AnimeScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const targets =
      staggerDelay > 0
        ? Array.from(el.querySelectorAll<HTMLElement>(".reveal-item"))
        : [el];

    if (targets.length === 0) return;

    // Cap stagger delay to the loose preset (100ms) to prevent excessively slow reveals
    const cappedStagger = Math.min(staggerDelay, ANIMATION_CONFIG.stagger.loose);

    // Set initial hidden state
    targets.forEach((t) => {
      t.style.opacity = "0";
      t.style.transform = `translateY(${fromY}rem)`;
    });

    // Trigger animation when container enters viewport
    const scroller = onScroll({
      target: el,
      // "end start" → fires when element's top edge crosses the container's bottom edge
      enter: "end start",
      onEnter() {
        try {
          // Skip animation if element is no longer connected to the DOM
          // or has scrolled out of view during rapid scrolling
          if (!el.isConnected) return;
          const rect = el.getBoundingClientRect();
          const isVisible =
            rect.bottom > 0 && rect.top < window.innerHeight;
          if (!isVisible) {
            // Element scrolled past — snap to final state instead of animating
            targets.forEach((t) => {
              t.style.opacity = "1";
              t.style.transform = "translateY(0rem)";
            });
            return;
          }

          targets.forEach((t, i) => {
            animate(t, {
              opacity: [0, 1],
              translateY: [`${fromY}rem`, "0rem"],
              duration,
              ease: ANIMATION_CONFIG.easing.default,
              delay: cappedStagger > 0 ? i * cappedStagger : 0,
            });
          });
        } catch (error) {
          console.error("Animation error in AnimeScrollReveal:", error);
          // Gracefully show content on error
          targets.forEach((t) => {
            t.style.opacity = "1";
            t.style.transform = "translateY(0rem)";
          });
        }
      },
    });

    return () => {
      scroller.revert();
    };
  }, [fromY, duration, staggerDelay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
