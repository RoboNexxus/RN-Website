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
<main className="flex items-center justify-center flex-1 px-12 py-20 gap-24">
  {/* Left Content */}
  <div className="flex flex-col">
    <FlipText
      className="text-6xl font-bold font-pixelify"
      duration={3.7}
      delay={0.1}
      loop={true}
    >
      Robo Nexus
    </FlipText>

    <GlassDock items={dockItems as any} />
  </div>

  {/* Right Side */}
  <Image
    src="/images/robonexus.png"
    alt="Robo Nexus Logo"
    width={400}
    height={400}
    priority
    className="object-contain"
  />
</main>
  );
}
