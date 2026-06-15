"use client";
import { Meteors } from "@/components/ui/meteors";
import GlassDock from "@/components/ui/glass-dock";
import FlipText from "@/components/ui/flip-text";
import {
  Home as HomeIcon,
  Terminal,
  Layout,
  Archive,
  History,
  MessageCircle,
  Code,
} from "lucide-react";

export default function Home() {
  const dockItems = [
    { title: "Home", icon: HomeIcon, href: "#" },
    { title: "Products", icon: Terminal, href: "#" },
    { title: "Components", icon: Layout, href: "#" },
    { title: "Archive", icon: Archive, href: "#" },
    { title: "Changelog", icon: History, href: "#" },
    { title: "Social", icon: MessageCircle, href: "#" },
    { title: "Code", icon: Code, href: "#" },
  ];

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <Meteors />

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
