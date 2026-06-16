"use client";
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
    { title: "Social", icon: MessageCircle, href: "/contact" },
  ];

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <FlipText
        className="text-6xl font-bold font-pixelify"
        duration={3.5}
        delay={0.1}
        loop={true}
      >
        Robo Nexus
      </FlipText>

      <GlassDock items={dockItems as any} />
    </main>
  );
}
