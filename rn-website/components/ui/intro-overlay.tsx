"use client";

/**
 * IntroOverlay
 *
 * Sits at the very top of the z-stack (z-[99995], just below the grain).
 * On the FIRST session visit:
 *   1. The overlay is solid black — the page is invisible.
 *   2. The underlying content wrapper begins at scale 1.08 + blur 6px + opacity 0.
 *   3. Over ~0.55 s the wrapper pulls back to scale 1 / blur 0 / opacity 1 (camera pull-back).
 *   4. The black overlay simultaneously fades out at ~0.35 s.
 *   5. After ~0.65 s the overlay is removed from the DOM entirely.
 *
 * On subsequent SPA navigations the overlay is not rendered at all.
 *
 * The content wrapper is the body's immediate child div (z-1 flex col),
 * targeted by id so we don't need to touch the existing markup — we just
 * add the id in layout.tsx.
 */

import { useEffect, useRef } from "react";
import { hasIntroPlayed, markIntroPlayed } from "@/lib/intro-state";

export function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const overlay = overlayRef.current;
    const content = document.getElementById("rn-content");
    if (!overlay || !content) return;
    const emitIntroComplete = () => {
      window.dispatchEvent(new Event("rn:intro-complete"));
    };

    // ── Detect reduced-motion preference ──────────────────────────────────
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      // Accessibility: skip animation, immediately reveal
      overlay.style.display = "none";
      content.style.transform = "";
      content.style.filter = "";
      content.style.opacity = "1";
      markIntroPlayed();
      emitIntroComplete();
      return;
    }

    const isFirst = !hasIntroPlayed();

    if (!isFirst) {
      // Internal navigation: no full intro, just make content visible
      overlay.style.display = "none";
      content.style.opacity = "1";
      content.style.transform = "";
      content.style.filter = "";
      emitIntroComplete();
      return;
    }

    markIntroPlayed();

    // ── Set initial state ─────────────────────────────────────────────────
    // Overlay: fully opaque black
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "all";

    // Content: start close (zoomed in), blurred, invisible
    content.style.willChange = "transform, filter, opacity";
    content.style.opacity = "0";
    content.style.transform = "scale(1.08)";
    content.style.filter = "blur(6px)";
    content.style.transition = "none";

    // Easing curves (premium, hand-tuned)
    const EASE_CAMERA = "cubic-bezier(.16,1,.3,1)";   // expo-out for the camera pull
    const EASE_OVERLAY = "cubic-bezier(.4,0,.2,1)";   // smooth for the black fade

    // ── Phase 1 (0 → 350 ms): fade the black overlay away ────────────────
    const phase1 = () => {
      overlay.style.transition = `opacity 350ms ${EASE_OVERLAY}`;
      overlay.style.opacity = "0";
    };

    // ── Phase 2 (150 → 750 ms): camera pull-back on content ──────────────
    const phase2 = () => {
      content.style.transition = [
        `opacity 600ms ${EASE_CAMERA}`,
        `transform 700ms ${EASE_CAMERA}`,
        `filter 600ms ${EASE_CAMERA}`,
      ].join(", ");
      content.style.opacity = "1";
      content.style.transform = "scale(1)";
      content.style.filter = "blur(0px)";
    };

    // ── Phase 3 (700 ms): remove overlay from paint stack entirely ────────
    const phase3 = () => {
      overlay.style.display = "none";
      content.style.willChange = "auto";
      content.style.transition = "";
      emitIntroComplete();
    };

    // Stagger the phases
    const t0 = requestAnimationFrame(() => {
      // give browser one frame to paint the initial state
      const t1 = setTimeout(phase1, 16);
      const t2 = setTimeout(phase2, 150);
      const t3 = setTimeout(phase3, 800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    });

    return () => {
      cancelAnimationFrame(t0);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d0d0d",
        zIndex: 99995,
        pointerEvents: "none",
        opacity: 1,
        // starts visible; JS will animate it away
      }}
    />
  );
}
