"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import HeroModel from "@/components/ui/hero-model";
import GlassDock from "@/components/ui/glass-dock";
import { Home as HomeIcon, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { usePageEnter } from "@/lib/use-page-enter";

const subscribe = () => () => {};

export default function Home() {
  const modelRef = useRef<HTMLDivElement>(null);
  const { containerRef } = usePageEnter();
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const dockItems = [
    { title: "Home",      icon: HomeIcon,    href: "#" },
    { title: "GitHub",    icon: FaGithub,    href: "https://github.com/RoboNexxus" },
    { title: "LinkedIn",  icon: FaLinkedin,  href: "https://www.linkedin.com/company/robo-nexus/" },
    { title: "YouTube",   icon: FaYoutube,   href: "https://www.youtube.com/@robo_nexus0" },
    { title: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/robonexus.ais46/" },
    { title: "Mail",      icon: Mail,        href: "mailto:robonexus.ais46@gmail.com" },
    { title: "Contact",   icon: MessageCircle, href: "/contact" },
  ];

  // 3D model: fade + rise after the overlay camera-pull finishes (~750 ms).
  // This preserves the existing motion language while timing it correctly
  // with the new intro system.
  useEffect(() => {
    const el = modelRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        // Start after camera pull-back settles (~750 ms)
        delay: 0.75,
      }
    );
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
    // containerRef wires this main into usePageEnter for data-enter elements
    <main
      ref={containerRef as React.RefObject<HTMLElement>}
      className="relative flex flex-col items-center justify-center h-[calc(100dvh-56px)] md:h-[100dvh] w-full overflow-hidden px-4 md:px-12"
    >
      {/* Background Text — slow opacity lift, no movement */}
      <div
        data-enter="hero-bg"
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 mt-[-5vh] overflow-hidden"
      >
        <div className="text-[16vw] leading-none font-bold font-pixelify text-neutral-900 dark:text-white whitespace-nowrap uppercase tracking-tight">
          ROBO
        </div>
        <div className="text-[16vw] leading-none font-bold font-pixelify text-neutral-900 dark:text-white whitespace-nowrap uppercase tracking-tight -mt-[0.1em]">
          NEXUS
        </div>
      </div>

      {/* 3D Model — GSAP handles its own entrance after the overlay */}
      <div
        ref={modelRef}
        data-enter="hero-3d"
        className="relative z-10 w-full max-w-[800px] flex-1 max-h-[60vh] md:max-h-[75vh] flex items-center justify-center mt-[-5vh]"
        style={{ opacity: 0 }}
      >
        <div
          className="absolute left-1/2 top-1/2 z-20 h-[38%] w-[30%] -translate-x-1/2 -translate-y-1/2 md:h-[44%] md:w-[28%]"
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
        <HeroModel />
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

      {/* Dock — rises from below with a deliberate delay */}
      <div data-enter="dock" className="z-20 absolute bottom-6 md:bottom-10">
        <GlassDock items={dockItems} />
      </div>
    </main>
  );
}
