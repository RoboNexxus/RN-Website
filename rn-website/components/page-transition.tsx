"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate } from "animejs";

/**
 * Wraps page content and plays anime.js transitions on route change.
 *
 * Enter: page slides up + fades in from slightly below.
 * The outgoing page is already gone by the time React swaps children,
 * so we only need to animate the entering content.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!ref.current) return;

    if (isFirst.current) {
      // First load — lighter entrance so it doesn't fight the hero animation
      isFirst.current = false;
      animate(ref.current, {
        opacity: [0, 1],
        duration: 400,
        ease: "outQuad",
      });
      return;
    }

    // Subsequent navigations — full slide-up entrance
    animate(ref.current, {
      opacity: [0, 1],
      translateY: ["24px", "0px"],
      duration: 480,
      ease: "outExpo",
    });
  }, [pathname]);

  return (
    <div ref={ref} style={{ opacity: 0 }} className="flex flex-col flex-1">
      {children}
    </div>
  );
}
