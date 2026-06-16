"use client";

import Image from "next/image";
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
<main className="flex items-center justify-between flex-1 px-12 py-20">
  {/* Left Content */}
  <div>
    <FlipText
      className="text-6xl font-bold font-pixelify"
      duration={3.5}
      delay={0.1}
      loop={true}
    >
      Robo Nexus
    </FlipText>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-8">
    {/* Large Logo */}
    <Image
      src="/images/robonexus.png"
      alt="Robo Nexus Logo"
      width={400}
      height={400}
      priority
      className="object-contain"
    />

    {/* Dock */}
    <GlassDock items={dockItems as any} />
  </div>
</main>
  );
}
