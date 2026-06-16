"use client";
import GlassDock from "@/components/ui/glass-dock";
import FlipText from "@/components/ui/flip-text";
import { Home as HomeIcon, Github, Instagram, Mail, MessageCircle, } from "lucide-react";

export default function Home() {
  const dockItems = [
    { title: "Home", icon: HomeIcon, href: "#" },
    { title: "GitHub", icon: Github, href: "https://github.com/RoboNexxus" },
    { title: "Instagram", icon: Instagram, href: "https://www.instagram.com/robonexus.ais46/" },
    { title: "Mail", icon: Mail, href: "mailto:robonexus.ais46@gmail.com" },
    { title: "Social", icon: MessageCircle, href: "/contact" },
  ];

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <FlipText
        className="text-6xl font-bold font-pixelify"
        duration={3.5}
        delay={0}
        loop={true}
      >
        Robo Nexus
      </FlipText>

      <GlassDock items={dockItems} />
    </main>
  );
}
