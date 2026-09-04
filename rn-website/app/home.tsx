"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroModel from "@/components/ui/hero-model";
import GlassDock from "@/components/ui/glass-dock";
import { Home as HomeIcon, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { usePageEnter } from "@/lib/use-page-enter";

export default function Home() {
  const modelRef = useRef<HTMLDivElement>(null);
  const { containerRef } = usePageEnter();

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
        className="z-10 w-full max-w-[800px] flex-1 max-h-[60vh] md:max-h-[75vh] flex items-center justify-center mt-[-5vh]"
        style={{ opacity: 0 }}
      >
        <HeroModel />
      </div>

      {/* Dock — rises from below with a deliberate delay */}
      <div data-enter="dock" className="z-20 absolute bottom-6 md:bottom-10">
        <GlassDock items={dockItems as any} />
      </div>
    </main>
  );
}
