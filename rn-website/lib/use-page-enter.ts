"use client";

/**
 * use-page-enter.ts
 *
 * A hook that orchestrates individual element entrance animations
 * after the camera pull-back overlay finishes.
 *
 * Usage:
 *   const { containerRef } = usePageEnter();
 *   return <main ref={containerRef}>…</main>
 *
 * The hook reads [data-enter] attributes on child elements to determine
 * their animation role. Roles map to bespoke motion rather than generic presets.
 *
 * Supported data-enter values (set in JSX):
 *   "nav"        – top bar: subtle downward settling from -8px
 *   "hero-bg"    – large BG text: stays in place, very slow opacity lift
 *   "hero-3d"    – 3D model wrapper: depth reveal (already handled by home.tsx; this layer is additive)
 *   "dock"       – bottom dock: rises ~10px, delayed
 *   "page-title" – inner-page hero heading: slight upward position correction
 *   "content-l"  – left-biased content block: comes ~4px from left
 *   "content-r"  – right-biased content block: comes ~4px from right
 *   "card"       – individual card in a grid: tiny stagger + upward micro-settle
 *   "section"    – generic content section: quiet upward settle
 *   "secondary"  – less important elements: very quiet, later
 *
 * All animations use GPU-friendly properties only (transform, opacity, filter).
 * Nothing triggers layout.
 */

import { useEffect, useRef } from "react";
import { hasIntroPlayed } from "@/lib/intro-state";

type EnterRole =
  | "nav"
  | "hero-bg"
  | "hero-3d"
  | "dock"
  | "page-title"
  | "content-l"
  | "content-r"
  | "card"
  | "section"
  | "secondary";

interface EnterSpec {
  /** CSS transition string */
  transition: string;
  /** Initial inline style (before animation starts) */
  from: Partial<CSSStyleDeclaration>;
  /** Final inline style */
  to: Partial<CSSStyleDeclaration>;
  /** Delay in ms before the transition fires */
  delay: number;
}

// Custom easing curves — each slightly different to avoid uniformity
const E1 = "cubic-bezier(.16,1,.3,1)";   // expo-out: snappy primary
const E2 = "cubic-bezier(.22,1,.36,1)";  // slightly softer expo
const E3 = "cubic-bezier(.25,.46,.45,.94)"; // ease-out-quad: quieter secondary
const E4 = "cubic-bezier(.4,0,.2,1)";    // material ease-in-out: structural

function getSpec(role: EnterRole, index: number): EnterSpec {
  switch (role) {
    case "nav":
      return {
        transition: `opacity 400ms ${E2}, transform 500ms ${E1}`,
        from: { opacity: "0", transform: "translateY(-8px)" },
        to:   { opacity: "1", transform: "translateY(0px)" },
        delay: 500, // after camera pull
      };

    case "hero-bg":
      return {
        transition: `opacity 900ms ${E3}`,
        from: { opacity: "0" },
        to:   { opacity: "1" },
        delay: 350,
      };

    case "hero-3d":
      // The existing home.tsx gsap animation already handles the model.
      // We give it a head-start so the overlay isn't fighting it.
      return {
        transition: `opacity 100ms linear`,
        from: { opacity: "0" },
        to:   { opacity: "1" },
        delay: 50,
      };

    case "dock":
      return {
        transition: `opacity 500ms ${E2}, transform 600ms ${E1}`,
        from: { opacity: "0", transform: "translateY(10px)" },
        to:   { opacity: "1", transform: "translateY(0px)" },
        delay: 800,
      };

    case "page-title":
      return {
        transition: `opacity 450ms ${E1}, transform 550ms ${E1}`,
        from: { opacity: "0", transform: "translateY(6px) scale(0.99)" },
        to:   { opacity: "1", transform: "translateY(0px) scale(1)" },
        delay: 500,
      };

    case "content-l":
      return {
        transition: `opacity 500ms ${E2}, transform 550ms ${E1}`,
        from: { opacity: "0", transform: "translateX(-4px)" },
        to:   { opacity: "1", transform: "translateX(0px)" },
        // Slightly irregular stagger: 550 + index * 55ms (not round numbers)
        delay: 550 + index * 55,
      };

    case "content-r":
      return {
        transition: `opacity 500ms ${E2}, transform 550ms ${E1}`,
        from: { opacity: "0", transform: "translateX(4px)" },
        to:   { opacity: "1", transform: "translateX(0px)" },
        delay: 590 + index * 60,
      };

    case "card":
      // Cards: small individual stagger, tiny positional shift based on index
      // Deliberately irregular so they don't look mathematically uniform
      const cardDelays = [620, 680, 720, 775, 820, 870, 910, 950];
      const cardDelay = cardDelays[index % cardDelays.length] + Math.floor(index / cardDelays.length) * 40;
      return {
        transition: `opacity 420ms ${E2}, transform 480ms ${E1}`,
        from: { opacity: "0", transform: `translateY(${3 + (index % 3)}px)` },
        to:   { opacity: "1", transform: "translateY(0px)" },
        delay: cardDelay,
      };

    case "section":
      return {
        transition: `opacity 500ms ${E3}, transform 550ms ${E2}`,
        from: { opacity: "0", transform: "translateY(5px)" },
        to:   { opacity: "1", transform: "translateY(0px)" },
        delay: 650 + index * 80,
      };

    case "secondary":
      return {
        transition: `opacity 400ms ${E3}`,
        from: { opacity: "0" },
        to:   { opacity: "1" },
        delay: 850 + index * 70,
      };

    default:
      return {
        transition: `opacity 400ms ${E3}`,
        from: { opacity: "0" },
        to:   { opacity: "1" },
        delay: 700,
      };
  }
}

export function usePageEnter() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // prefers-reduced-motion: skip entirely, make everything visible
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      const els = container.querySelectorAll<HTMLElement>("[data-enter]");
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "";
      });
      return;
    }

    const els = container.querySelectorAll<HTMLElement>("[data-enter]");
    if (!els.length) return;

    // Track cards/sections/content by role for stagger indexing
    const roleCounters: Partial<Record<EnterRole, number>> = {};

    const timers: ReturnType<typeof setTimeout>[] = [];

    els.forEach((el) => {
      const role = el.dataset.enter as EnterRole;
      const counter = roleCounters[role] ?? 0;
      roleCounters[role] = counter + 1;

      const spec = getSpec(role, counter);

      // Apply initial state immediately
      Object.assign(el.style, spec.from);
      el.style.transition = "none";
      el.style.willChange = "transform, opacity";

      const t = setTimeout(() => {
        // Apply transition then target state
        el.style.transition = spec.transition;
        Object.assign(el.style, spec.to);

        // Clean up will-change after animation completes (~1s buffer)
        const cleanup = setTimeout(() => {
          el.style.willChange = "auto";
        }, 1200);
        timers.push(cleanup);
      }, spec.delay);

      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef };
}
