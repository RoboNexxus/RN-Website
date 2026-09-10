"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutModel from "@/components/ui/about-model";
import { usePageEnter } from "@/lib/use-page-enter";
import { hasIntroPlayed } from "@/lib/intro-state";

gsap.registerPlugin(ScrollTrigger);
const subscribe = () => () => {};

const LINES = [
  "We're not here",
  "just to take part.",
  "We're here",
  "to take over.",
  "We're here",
  "to win.",
];

export default function About() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const { containerRef } = usePageEnter();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const words = Array.from(
      inner.querySelectorAll<HTMLSpanElement>(".rev-word")
    );
    if (!words.length) return;

    // Start all words dim
    gsap.set(words, { opacity: 0.1 });

    // Model starts invisible
    const modelWrap = inner.querySelector<HTMLElement>(".about-model-wrap");
    if (modelWrap) gsap.set(modelWrap, { autoAlpha: 0, y: 40 });

    let st: ScrollTrigger | null = null;

    function buildScrollTrigger() {
      st?.kill();

      const total = words.length;

      // CSS sticky (position:sticky on innerRef) handles the pin.
      // GSAP only drives the scrub — no DOM manipulation, no pin spacers,
      // immune to transform ancestors like the intro camera-pull on #rn-content.
      st = ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: "+=200%",
        scrub: 0.8,
        onUpdate(self) {
          const p = self.progress;

          words.forEach((word, i) => {
            const wordStart = i / total;
            const wordEnd   = (i + 1.4) / total;
            const wordP     = gsap.utils.clamp(
              0, 1,
              (p - wordStart) / (wordEnd - wordStart)
            );
            gsap.set(word, { opacity: gsap.utils.interpolate(0.1, 1, wordP) });
          });

          if (modelWrap) {
            const mP = gsap.utils.clamp(0, 1, (p - 0.05) / 0.2);
            gsap.set(modelWrap, {
              autoAlpha: mP,
              y: gsap.utils.interpolate(40, 0, mP),
            });
          }
        },
      });

      // Double rAF so browser fully lays out before GSAP measures scroll bounds.
      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    }

    const onIntroComplete = () => { buildScrollTrigger(); };
    window.addEventListener("rn:intro-complete", onIntroComplete);

    if (hasIntroPlayed()) {
      const t = setTimeout(() => buildScrollTrigger(), 100);
      return () => {
        clearTimeout(t);
        window.removeEventListener("rn:intro-complete", onIntroComplete);
        st?.kill();
      };
    }

    return () => {
      window.removeEventListener("rn:intro-complete", onIntroComplete);
      st?.kill();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const queueTooltipPosition = (x: number, y: number) => {
    pointerRef.current = { x, y };
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const tip = tooltipRef.current;
      if (!tip) {
        rafRef.current = null;
        return;
      }
      tip.style.left = `${pointerRef.current.x}px`;
      tip.style.top = `${pointerRef.current.y}px`;
      rafRef.current = null;
    });
  };

  return (
    <main ref={containerRef as React.RefObject<HTMLElement>} className="flex flex-col items-center flex-1 w-full">
      {/* outer: 300vh gives the scroll budget */}
      <div ref={outerRef} style={{ height: "300vh", width: "100%" }}>
        {/* inner: sticky viewport-height panel */}
        <div
          ref={innerRef}
          className="flex items-center w-full"
          style={{ height: "100vh", position: "sticky", top: 0 }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4">

            {/* Text — enters from the left */}
            <div data-enter="content-l" className="lg:col-span-6 lg:col-start-1 lg:row-start-1 z-10">
              <div className="text-left leading-[1.05] tracking-tight">
                {LINES.map((line, li) => (
                  <p
                    key={li}
                    className={`font-black ${
                      li === LINES.length - 1
                        ? "text-[clamp(2rem,7vw,6.5rem)] mt-4 md:mt-5"
                        : "text-[clamp(1.5rem,5.5vw,4.75rem)] mt-2"
                    }`}
                  >
                    {line.split(" ").map((word, wi) => (
                      <span
                        key={wi}
                        className="rev-word inline-block mr-[0.3em]"
                        style={{ willChange: "opacity" }}
                      >
                        {word}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>

            {/* 3D model — enters from the right */}
            <div data-enter="content-r" className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
              <div
                className="about-model-wrap relative w-full"
                style={{ willChange: "transform, opacity" }}
              >
                <div
                  className="absolute left-1/2 top-1/2 z-20 h-[40%] w-[32%] -translate-x-1/2 -translate-y-1/2 md:h-[46%] md:w-[30%]"
                  onMouseEnter={(e) => {
                    const tip = tooltipRef.current;
                    if (!tip) return;
                    tip.style.opacity = "1";
                    queueTooltipPosition(e.clientX, e.clientY);
                  }}
                  onMouseMove={(e) => {
                    queueTooltipPosition(e.clientX, e.clientY);
                  }}
                  onMouseLeave={() => {
                    const tip = tooltipRef.current;
                    if (tip) tip.style.opacity = "0";
                  }}
                />
                <AboutModel />
              </div>
            </div>

          </div>
        </div>
      </div>
      {isClient &&
        createPortal(
          <div
            ref={tooltipRef}
            className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-150 ease-out"
            style={{ transform: "translate(-50%, calc(-100% - 12px))" }}
          >
            <div className="rounded-md border border-neutral-700 bg-black px-2 py-0.5 text-[10px] font-medium tracking-normal whitespace-nowrap text-white shadow-md dark:border-neutral-300 dark:bg-white dark:text-black">
              Aryaman Yadav & Akshar Yadav
            </div>
          </div>,
          document.body
        )}
    </main>
  );
}
