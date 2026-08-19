"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { animate, stagger } from "animejs";

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".nf-item");
    animate(els, {
      opacity: [0, 1],
      translateY: ["20px", "0px"],
      duration: 500,
      ease: "outExpo",
      delay: stagger(80),
    });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 gap-6 text-center">
      <div ref={ref} className="flex flex-col items-center gap-6">
        <p className="nf-item text-8xl font-bold font-pixelify text-white/10" style={{ opacity: 0 }}>
          404
        </p>
        <h1 className="nf-item text-2xl font-semibold" style={{ opacity: 0 }}>
          Page not found
        </h1>
        <p className="nf-item text-neutral-500 max-w-sm" style={{ opacity: 0 }}>
          Looks like this page got lost in the build. Let's get you back on track.
        </p>
        <button
          onClick={() => router.push("/")}
          className="nf-item mt-2 px-5 py-2 rounded-full glass-border spotlight-nav-bg spotlight-nav-shadow text-sm font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
          style={{ opacity: 0 }}
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
