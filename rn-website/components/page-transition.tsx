"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate } from "animejs";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!ref.current) return;
    // Fade + slight upward slide on every route change
    animate(ref.current, {
      opacity: [0, 1],
      translateY: ["12px", "0px"],
      duration: 380,
      ease: "outExpo",
    });
  }, [pathname]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
