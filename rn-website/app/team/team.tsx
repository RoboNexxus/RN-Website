"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { PixelImage } from "@/components/ui/pixel-image";
import { resolveAssetPath } from "@/lib/utils";
import teamData from "@/data/team.json";

type Member = (typeof teamData.members)[number];

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveAssetPath(member.image);
  const hasLinks = member.links.github || member.links.linkedin || member.links.website;
  
  return (
    <div className="reveal-item group relative flex flex-col items-center gap-4 rounded-3xl glass-border bg-gradient-to-br from-white/10 to-white/5 p-8 text-center hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 w-full backdrop-blur-sm">
      {/* Decorative corner accent */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors duration-300" />
      
      {/* Profile Image with enhanced styling */}
      <div className="relative w-32 h-32 rounded-full ring-4 ring-white/20 group-hover:ring-white/40 overflow-hidden transition-all duration-300 shadow-lg">
        <PixelImage
          src={imgSrc}
          grid="4x6"
          fill
          pixelFadeInDuration={800}
          maxAnimationDelay={900}
          colorRevealDelay={1000}
        />
      </div>
      
      {/* Member Info */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-white group-hover:text-white/90 transition-colors">
          {member.name}
        </h3>
        <p className="text-sm font-medium text-neutral-300 tracking-wide">
          {member.role}
        </p>
      </div>
      
      {/* Social Links */}
      {hasLinks && (
        <div className="flex gap-4 mt-2 pt-3 border-t border-white/10">
          {member.links.github && (
            <a 
              href={member.links.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${member.name} GitHub`} 
              className="text-neutral-400 hover:text-white hover:scale-125 transition-all duration-200"
            >
              <FaGithub size={18} />
            </a>
          )}
          {member.links.linkedin && (
            <a 
              href={member.links.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${member.name} LinkedIn`} 
              className="text-neutral-400 hover:text-white hover:scale-125 transition-all duration-200"
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {member.links.website && (
            <a 
              href={member.links.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${member.name} website`} 
              className="text-neutral-400 hover:text-white hover:scale-125 transition-all duration-200"
            >
              <FaGlobe size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="w-full flex items-center gap-4 mb-8">
      <div className="flex-1 h-px bg-white/10" />
      <p className="text-sm font-semibold text-neutral-300 uppercase tracking-widest shrink-0">
        {title}
      </p>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export default function Team() {
  const heads = teamData.members.filter((m) => m.role === "Head");
  const core = teamData.members.filter((m) => m.role === "Core Member");
  const members = teamData.members.filter((m) => m.role === "Member");

  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <AnimePageHero
        title="Meet the Team"
        subtitle="The people building, innovating, and keeping the lights on at Robo Nexus."
      />

      {/* ── Leadership ── */}
      <section className="w-full max-w-4xl flex flex-col gap-10">
        <AnimeScrollReveal className="text-center">
          <h2 className="text-2xl font-bold">Leadership</h2>
        </AnimeScrollReveal>

        <div>
          <SectionDivider title="Heads" />
          <AnimeScrollReveal
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center"
            staggerDelay={100}
            fromY={1.5}
          >
            {heads.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </AnimeScrollReveal>
        </div>

        {core.length > 0 && (
          <div>
            <SectionDivider title="Core" />
            <AnimeScrollReveal
              className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center"
              staggerDelay={100}
              fromY={1.5}
            >
              {core.map((m) => (
                <MemberCard key={m.name} member={m} />
              ))}
            </AnimeScrollReveal>
          </div>
        )}
      </section>

      {/* ── Members ── */}
      <section className="w-full max-w-4xl">
        <AnimeScrollReveal className="text-center mb-10">
          <h2 className="text-2xl font-bold">Members</h2>
        </AnimeScrollReveal>
        <AnimeScrollReveal
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center"
          staggerDelay={80}
          fromY={1.5}
        >
          {members.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </AnimeScrollReveal>
      </section>
    </main>
  );
}
