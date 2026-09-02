"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MarqueeProps {
  items: string[];
  /** pixels per second — default 60 */
  speed?: number;
  className?: string;
  separator?: string;
}

/**
 * Marquee
 *
 * GSAP-driven infinite horizontal ticker.
 * - Duplicates content so there's always content to scroll into view.
 * - Reverses direction on hover (a satisfying micro-interaction).
 * - Respects prefers-reduced-motion by pausing animation.
 */
export default function Marquee({
  items,
  speed = 60,
  className = "",
  separator = "·",
}: MarqueeProps) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const tweenRef  = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure a single "set" of items (first half of the duplicated track)
    const setWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: `-=${setWidth}`,
      duration: setWidth / speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        // Keep position within one cycle using modulo
        x: gsap.utils.unitize(
          (x: string) => parseFloat(x) % setWidth,
        ),
      },
    });

    // Reduced motion — just pause immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      tweenRef.current.pause();
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [speed]);

  const onMouseEnter = () => {
    tweenRef.current?.reverse();
  };

  const onMouseLeave = () => {
    tweenRef.current?.play();
  };

  // Duplicate items so there's a seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden w-full ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div ref={trackRef} className="marquee-track flex items-center">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-sm md:text-base font-medium tracking-widest uppercase text-neutral-500 px-5 md:px-8">
              {item}
            </span>
            <span className="text-neutral-700 text-lg select-none" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
