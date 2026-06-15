"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const prevVisible = useRef(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate in/out when visibility changes
  useEffect(() => {
    if (!btnRef.current) return;
    if (visible === prevVisible.current) return;
    prevVisible.current = visible;

    if (visible) {
      animate(btnRef.current, {
        opacity: [0, 1],
        translateY: ["12px", "0px"],
        scale: [0.8, 1],
        duration: 400,
        ease: "outBack(1.4)",
      });
    } else {
      animate(btnRef.current, {
        opacity: [1, 0],
        translateY: ["0px", "12px"],
        scale: [1, 0.8],
        duration: 250,
        ease: "inCubic",
      });
    }
  }, [visible]);

  const scrollToTop = () => {
    // Little bounce on click
    if (btnRef.current) {
      animate(btnRef.current, {
        scale: [1, 0.85, 1],
        duration: 300,
        ease: "outBack(2)",
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{ opacity: 0 }}
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "w-10 h-10 rounded-full",
        "spotlight-nav-bg glass-border spotlight-nav-shadow",
        "flex items-center justify-center",
        "text-neutral-400 hover:text-white transition-colors duration-150",
        "cursor-pointer"
      )}
    >
      {/* Up arrow */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
