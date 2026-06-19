"use client";

import HeroModel from "@/components/ui/hero-model";
import GlassDock from "@/components/ui/glass-dock";
import FlipText from "@/components/ui/flip-text";
import { Home as HomeIcon, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Home() {
  const dockItems = [
    { title: "Home", icon: HomeIcon, href: "#" },
    { title: "GitHub", icon: FaGithub, href: "https://github.com/RoboNexxus" },
    { title: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/robonexus.ais46/" },
    { title: "Mail", icon: Mail, href: "mailto:robonexus.ais46@gmail.com" },
    { title: "Contact", icon: MessageCircle, href: "/contact" },
  ];

  return (
<main className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden px-4 md:px-12 py-20">
  {/* Background Text */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <FlipText
      className="text-[4rem] sm:text-[6rem] md:text-[10rem] lg:text-[14rem] font-bold font-pixelify text-neutral-200 dark:text-neutral-800/50 whitespace-nowrap opacity-50"
      duration={3.7}
      delay={0.1}
      loop={true}
    >
      ROBO NEXUS
    </FlipText>
  </div>

  {/* 3D Model in the center */}
  <div className="z-10 w-full max-w-[800px] h-[600px] md:h-[800px] flex items-center justify-center">
    <HeroModel />
  </div>

  {/* Dock below */}
  <div className="z-20 absolute bottom-8 md:bottom-12">
    <GlassDock items={dockItems as any} />
  </div>
</main>
  );
}
