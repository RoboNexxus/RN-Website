"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * MagneticCursor
 *
 * Two-layer cursor:
 *  • dot  — snaps directly to mouse (GSAP quickTo, near-instant)
 *  • ring — follows with spring-like lag (lower duration = heavier lag)
 *
 * Emil's principle: spring-based mouse tracking feels natural because
 * it has momentum. Direct tracking feels artificial.
 *
 * Scales up + changes colour when hovering [data-cursor="pointer"]
 * or any <a>, <button>.
 */
export default function MagneticCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    // quickTo gives us GSAP's fastest setter — skips the scheduler
    // for the dot (near-instant), lagged for the ring (spring feel).
    const moveDotX  = gsap.quickTo(dot,  "x", { duration: 0.1, ease: "power3.out" });
    const moveDotY  = gsap.quickTo(dot,  "y", { duration: 0.1, ease: "power3.out" });
    const moveRingX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let isHovering  = false;
    let isPressing  = false;

    // ── Mouse move ──────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
    };

    // ── Hover detection via event delegation ────────────────────────
    const isInteractive = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "a" || tag === "button") return true;
      if ((el as HTMLElement).dataset.cursor === "pointer") return true;
      if ((el as HTMLElement).getAttribute("role") === "button") return true;
      return false;
    };

    const onMouseOver = (e: MouseEvent) => {
      if (isInteractive(e.target as Element)) {
        isHovering = true;
        dot.classList.add("is-hovering");
        ring.classList.add("is-hovering");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (isInteractive(e.target as Element)) {
        isHovering = false;
        if (!isPressing) {
          dot.classList.remove("is-hovering");
          ring.classList.remove("is-hovering");
        }
      }
    };

    // ── Press ────────────────────────────────────────────────────────
    const onDown = () => {
      isPressing = true;
      dot.classList.add("is-pressing");
      ring.classList.add("is-pressing");
    };

    const onUp = () => {
      isPressing = false;
      dot.classList.remove("is-pressing");
      ring.classList.remove("is-pressing");
      if (!isHovering) {
        dot.classList.remove("is-hovering");
        ring.classList.remove("is-hovering");
      }
    };

    // ── Visibility on enter/leave ────────────────────────────────────
    const onEnter = () => {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
    };

    // Start hidden (will fade in on first move)
    gsap.set([dot, ring], { autoAlpha: 0 });

    window.addEventListener("mousemove",  onMove,     { passive: true });
    window.addEventListener("mouseover",  onMouseOver, { passive: true });
    window.addEventListener("mouseout",   onMouseOut,  { passive: true });
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);

    // Fade in on first mouse move
    const onFirstMove = (e: MouseEvent) => {
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.4 });
      window.removeEventListener("mousemove", onFirstMove);
    };
    window.addEventListener("mousemove", onFirstMove, { once: true });

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseover",  onMouseOver);
      window.removeEventListener("mouseout",   onMouseOut);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
