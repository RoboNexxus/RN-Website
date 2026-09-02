"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * PageCurtain
 *
 * Black curtain that wipes up on enter (revealing the new page)
 * and wipes down on leave (covering the old page).
 *
 * Uses the --ease-drawer (iOS-like) curve for the wipe feel.
 *
 * Works by:
 *  1. On mount (every route change): curtain is at scaleY=1 (covering),
 *     then animates to scaleY=0 (revealing).
 *  2. Intercepts navigation link clicks and animates the curtain
 *     down before the route changes.
 */
export default function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname   = usePathname();
  const router     = useRouter();
  const isAnimating = useRef(false);

  // ── Reveal: curtain lifts off the page ────────────────────────────
  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    // Make sure curtain starts covering (in case it was mid-animation)
    gsap.set(curtain, { scaleY: 1, transformOrigin: "top", pointerEvents: "all" });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(curtain, { pointerEvents: "none" });
        isAnimating.current = false;
      },
    });

    tl.to(curtain, {
      scaleY: 0,
      duration: 0.7,
      ease: "power4.inOut",
      transformOrigin: "top",
    });
  }, [pathname]);

  // ── Cover: curtain drops before navigation ─────────────────────────
  const navigateTo = useCallback(
    (href: string) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const curtain = curtainRef.current;
      if (!curtain) {
        router.push(href);
        return;
      }

      gsap.set(curtain, { scaleY: 0, transformOrigin: "bottom", pointerEvents: "all" });
      gsap.to(curtain, {
        scaleY: 1,
        duration: 0.55,
        ease: "power4.inOut",
        transformOrigin: "bottom",
        onComplete: () => {
          router.push(href);
        },
      });
    },
    [router],
  );

  // Intercept clicks on <a> tags that point to internal routes
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept internal navigation
      const isInternal =
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !anchor.getAttribute("target");

      if (!isInternal) return;
      if (href === pathname) return; // same page, skip

      e.preventDefault();
      navigateTo(href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, navigateTo]);

  return (
    <div
      ref={curtainRef}
      className="page-curtain"
      aria-hidden="true"
      style={{
        /* Start fully covering the page — GSAP will lift it */
        transform: "scaleY(1)",
        transformOrigin: "top",
      }}
    />
  );
}
