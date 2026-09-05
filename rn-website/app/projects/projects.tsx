"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimePageHero from "@/components/ui/anime-page-hero";
import { PixelImage } from "@/components/ui/pixel-image";
import { resolveAssetPath } from "@/lib/utils";
import projectsData from "@/data/tutorials.json";
import { usePageEnter } from "@/lib/use-page-enter";
import { hasIntroPlayed } from "@/lib/intro-state";

gsap.registerPlugin(ScrollTrigger);

type Project = (typeof projectsData.tutorials)[number];

function ProjectCard({ project }: { project: Project }) {
  const imgSrc = resolveAssetPath(project.image);
  const aspectRatio = project.isVertical
    ? "aspect-[2/3]"
    : project.isWide
    ? "aspect-[21/9]"
    : "aspect-[4/3]";

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 w-full group">
      <div className={`relative w-full ${aspectRatio} overflow-hidden bg-neutral-900`}>
        <PixelImage
          src={imgSrc}
          grid="6x4"
          fill
          pixelFadeInDuration={600}
          maxAnimationDelay={700}
          colorRevealDelay={800}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
      </div>
    </div>
  );
}

function HorizontalScroll({ projects }: { projects: Project[] }) {
  const wrapRef  = useRef<HTMLDivElement>(null);  // scroll-distance spacer
  const pinRef   = useRef<HTMLDivElement>(null);  // sticky viewport panel
  const trackRef = useRef<HTMLDivElement>(null);  // sliding track

  // Detect touch/mobile — use native scroll on touch, GSAP on desktop
  const isMobile = typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  useEffect(() => {
    // On mobile we let native horizontal scroll handle it — no GSAP needed
    if (isMobile) return;

    const wrap  = wrapRef.current;
    const pin   = pinRef.current;
    const track = trackRef.current;
    if (!wrap || !pin || !track) return;

    let st: ScrollTrigger | null = null;

    function build() {
      if (!wrap || !pin || !track) return;

      st?.kill();

      const distance = track.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      wrap.style.height = `${window.innerHeight + distance}px`;
      gsap.set(track, { x: 0 });

      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: () => `+=${distance}`,
        scrub: 1,
        onUpdate(self) {
          gsap.set(track, { x: -self.progress * distance });
        },
      });

      // Double rAF so the browser has fully laid out before GSAP measures
      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    }

    const ro = new ResizeObserver(() => {
      build();
      ScrollTrigger.refresh();
    });
    ro.observe(track);

    const onIntroComplete = () => { build(); };
    window.addEventListener("rn:intro-complete", onIntroComplete);

    if (hasIntroPlayed()) {
      const t = setTimeout(() => build(), 100);
      return () => {
        clearTimeout(t);
        ro.disconnect();
        window.removeEventListener("rn:intro-complete", onIntroComplete);
        st?.kill();
      };
    }

    // First visit — wait for rn:intro-complete
    return () => {
      ro.disconnect();
      window.removeEventListener("rn:intro-complete", onIntroComplete);
      st?.kill();
    };
  }, [isMobile]);

  // ── Mobile: native horizontal scroll ──────────────────────────────────────
  if (isMobile) {
    return (
      <div className="w-full">
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            scrollSnapType: "x mandatory",
            display: "flex",
            alignItems: "center",
            paddingLeft: "5vw",
            paddingRight: "5vw",
            paddingTop: "24px",
            paddingBottom: "32px",
            gap: "clamp(16px, 3vw, 40px)",
            /* hide scrollbar but keep functionality */
            scrollbarWidth: "none",
          }}
          className="[&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                flexShrink: 0,
                width: "clamp(260px, 80vw, 400px)",
                scrollSnapAlign: "start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: "#444", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Desktop: GSAP ScrollTrigger horizontal scroll ──────────────────────────
  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <div
        ref={pinRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <p className="absolute top-6 right-8 text-xs text-neutral-600 tracking-widest uppercase z-10 select-none pointer-events-none">
          scroll to explore →
        </p>

        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            willChange: "transform",
            paddingLeft: "5vw",
          }}
        >
          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                flexShrink: 0,
                width: "clamp(280px, 45vw, 560px)",
                marginRight: "clamp(16px, 3vw, 40px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: "#444", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>
              <ProjectCard project={p} />
            </div>
          ))}
          <div style={{ flexShrink: 0, width: "5vw" }} />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { containerRef } = usePageEnter();

  return (
    <main ref={containerRef as React.RefObject<HTMLElement>} className="flex flex-col items-center flex-1 w-full">
      <div data-enter="page-title" className="px-4 py-20 w-full flex flex-col items-center">
        <AnimePageHero title="Projects" />
      </div>

      <HorizontalScroll projects={projectsData.tutorials} />

      <div style={{ height: "6vh" }} aria-hidden="true" />
    </main>
  );
}
