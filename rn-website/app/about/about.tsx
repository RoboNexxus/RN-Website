"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutModel from "@/components/ui/about-model";
import { usePageEnter } from "@/lib/use-page-enter";
import { hasIntroPlayed } from "@/lib/intro-state";

gsap.registerPlugin(ScrollTrigger);

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

    let ctx: ReturnType<typeof gsap.context> | null = null;

    function buildScrollTrigger() {
      // Kill previous context if rebuilding
      ctx?.revert();

      ctx = gsap.context(() => {
        const total = words.length;

        ScrollTrigger.create({
          trigger: outer,
          start: "top top",
          end: "+=200%",
          pin: inner,
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
      });

      // Double rAF: first frame lets React finish painting, second lets
      // the browser do a full layout/compositing pass before GSAP measures.
      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    }

    const onIntroComplete = () => {
      // Always rebuild on intro-complete — covers both first visit and
      // navigating back to this page after the intro has already played.
      buildScrollTrigger();
    };
    window.addEventListener("rn:intro-complete", onIntroComplete);

    // For reload / hard-nav where intro is skipped: wait two frames +
    // a small timeout to ensure the navbar and all layout have settled.
    if (hasIntroPlayed()) {
      const t = setTimeout(() => buildScrollTrigger(), 100);
      return () => {
        clearTimeout(t);
        window.removeEventListener("rn:intro-complete", onIntroComplete);
        ctx?.revert();
      };
    }

    // Otherwise do nothing here; onIntroComplete will fire at ~800 ms and build.

    return () => {
      window.removeEventListener("rn:intro-complete", onIntroComplete);
      ctx?.revert();
    };
  }, []);

  return (
    <main ref={containerRef as React.RefObject<HTMLElement>} className="flex flex-col items-center flex-1 w-full">
      {/* outer: 300vh gives the scroll budget */}
      <div ref={outerRef} style={{ height: "300vh", width: "100%" }}>
        {/* inner: sticky viewport-height panel */}
        <div
          ref={innerRef}
          className="flex items-center w-full"
          style={{ height: "100vh" }}
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
                className="about-model-wrap w-full"
                style={{ willChange: "transform, opacity" }}
              >
                <AboutModel />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
