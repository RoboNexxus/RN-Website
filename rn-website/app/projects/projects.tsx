"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimePageHero from "@/components/ui/anime-page-hero";
import { PixelImage } from "@/components/ui/pixel-image";
import { resolveAssetPath } from "@/lib/utils";
import projectsData from "@/data/tutorials.json";

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

  useEffect(() => {
    const wrap  = wrapRef.current;
    const pin   = pinRef.current;
    const track = trackRef.current;
    if (!wrap || !pin || !track) return;

    let st: ScrollTrigger | null = null;

    function build() {
      if (!wrap || !pin || !track) return;

      // Kill previous instance before rebuilding
      st?.kill();

      const distance = track.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      // Set the spacer height = scroll distance so the page is tall enough
      wrap.style.height = `${window.innerHeight + distance}px`;

      // Reset track position
      gsap.set(track, { x: 0 });

      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: () => `+=${distance}`,
        pin: pin,
        scrub: 1,
        anticipatePin: 1,
        onUpdate(self) {
          gsap.set(track, { x: -self.progress * distance });
        },
      });
    }

    // Build after a frame so the DOM has painted and scrollWidth is real
    const raf = requestAnimationFrame(() => {
      build();
    });

    // Rebuild on resize
    const ro = new ResizeObserver(() => {
      build();
      ScrollTrigger.refresh();
    });
    ro.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      st?.kill();
    };
  }, []);

  return (
    /*
      wrap — acts as the scroll spacer. Height is set in JS to
      window.innerHeight + trackScrollWidth - viewportWidth.
      position:relative so the sticky pin anchors to it.
    */
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      {/*
        pin — sticky panel. Stays at top:0 while user scrolls
        through the spacer above.
      */}
      <div
        ref={pinRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",   // clips track outside viewport
        }}
      >
        <p className="absolute top-6 right-8 text-xs text-neutral-600 tracking-widest uppercase z-10 hidden md:block select-none pointer-events-none">
          scroll to explore →
        </p>

        {/*
          track — the element that slides left.
          Must NOT be inside overflow:hidden before GSAP measures it,
          but here we measure scrollWidth before clipping, so it's fine.
        */}
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
          {/* trailing gap so last card clears the right edge */}
          <div style={{ flexShrink: 0, width: "5vw" }} />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <main className="flex flex-col items-center flex-1 w-full">
      <div className="px-4 py-20 w-full flex flex-col items-center">
        <AnimePageHero title="Projects" />
      </div>

      <HorizontalScroll projects={projectsData.tutorials} />

      <div style={{ height: "6vh" }} aria-hidden="true" />
    </main>
  );
}
