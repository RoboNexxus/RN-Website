"use client";
import { Meteors } from "@/components/ui/meteors";
import GlassDock from "@/components/ui/glass-dock";
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

      {/*
        StringSplit hero title.
        string="split"          → StringSplit wraps each char in a <span> and sets
                                  --char-index, --char-total, --word-index, etc.
        string-split="char"     → split at character level
        The CSS animation is driven purely by those CSS variables — no extra JS needed.
      */}
      <h1
        className="hero-split text-6xl font-bold font-pixelify overflow-hidden"
        string="split"
        string-split="char"
      >
        Robo Nexus
      </h1>

      <GlassDock items={dockItems} />
    </main>
  );
}
