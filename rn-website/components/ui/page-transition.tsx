"use client";

/**
 * PageTransition
 *
 * Wraps every page's content. On route change (internal navigation after
 * the first load), it plays a brief, physical transition:
 *   - Outgoing page: slightly scales down + fades (handled by the overlay)
 *   - Incoming page: starts at scale 1.03 + slight opacity, settles to normal
 *
 * This is much shorter than the initial intro (300ms vs 750ms) and uses
 * the same depth/camera language without the black screen.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { hasIntroPlayed } from "@/lib/intro-state";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "";
      return;
    }

    // On the very first mount, we're inside the main intro.
    // Let the IntroOverlay's camera-pull handle the reveal instead.
    if (isFirst.current) {
      isFirst.current = false;
      // Make wrapper fully visible so the intro overlay shows through
      el.style.opacity = "1";
      el.style.transform = "";
      return;
    }

    // Internal navigation: quick depth-entry
    const E_IN = "cubic-bezier(.16,1,.3,1)";

    // Start position: very slightly zoomed in, barely visible
    el.style.transition = "none";
    el.style.opacity = "0.3";
    el.style.transform = "scale(1.025)";
    el.style.willChange = "transform, opacity";

    const t = setTimeout(() => {
      el.style.transition = `opacity 280ms ${E_IN}, transform 320ms ${E_IN}`;
      el.style.opacity = "1";
      el.style.transform = "scale(1)";

      const cleanup = setTimeout(() => {
        el.style.willChange = "auto";
        el.style.transition = "";
      }, 400);

      return () => clearTimeout(cleanup);
    }, 16);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={wrapRef} style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
