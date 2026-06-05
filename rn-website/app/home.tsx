import FlipText from "@/components/ui/flip-text";
import GlassDock from "@/components/ui/glass-dock";
import {
  Home as HomeIcon,
  Terminal,
  Layout,
  Archive,
  History,
  Twitter,
  Github,
} from "lucide-react";

export default function Home() {
  const dockItems = [
    { title: 'Home', icon: HomeIcon, href: '#' },
    { title: 'Products', icon: Terminal, href: '#' },
    { title: 'Components', icon: Layout, href: '#' },
    { title: 'Archive', icon: Archive, href: '#' },
    { title: 'Changelog', icon: History, href: '#' },
    { title: 'Twitter', icon: Twitter, href: '#' },
    { title: 'Github', icon: Github, href: '#' },
  ];

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <FlipText className="text-6xl font-bold">Robo Nexus</FlipText>
      <GlassDock items={dockItems} />
    </main>
  );
}
