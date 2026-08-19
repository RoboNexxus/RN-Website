"use client";

import HeroModel from "@/components/ui/hero-model";
import GlassDock from "@/components/ui/glass-dock";
import FlipText from "@/components/ui/flip-text";
import { Home as HomeIcon, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Home() {
  const dockItems = [
    { title: "Home", icon: HomeIcon, href: "#" },
    { title: "GitHub", icon: FaGithub, href: "https://github.com/RoboNexxus" },
    { title: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/company/robo-nexus/" },
    { title: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/robonexus.ais46/" },
    { title: "Mail", icon: Mail, href: "mailto:robonexus.ais46@gmail.com" },
    { title: "Contact", icon: MessageCircle, href: "/contact" },
  ];

  return (
<main className="relative flex flex-col items-center justify-center h-[calc(100dvh-56px)] md:h-[100dvh] w-full overflow-hidden px-4 md:px-12">
  {/* Background Text */}
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 mt-[-5vh] overflow-hidden">
    <div className="text-[16vw] leading-none font-bold font-pixelify text-neutral-900 dark:text-white whitespace-nowrap uppercase tracking-tight">
      ROBO
    </div>
    <div className="text-[16vw] leading-none font-bold font-pixelify text-neutral-900 dark:text-white whitespace-nowrap uppercase tracking-tight -mt-[0.1em]">
      NEXUS
    </div>
  </div>

  {/* 3D Model in the center */}
  <div className="z-10 w-full max-w-[800px] flex-1 max-h-[60vh] md:max-h-[75vh] flex items-center justify-center mt-[-5vh]">
    <HeroModel />
  </div>

  {/* Dock below */}
  <div className="z-20 absolute bottom-6 md:bottom-10">
    <GlassDock items={dockItems as any} />
  </div>
</main>
  );
}
