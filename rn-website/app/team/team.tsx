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
  
  const getRoleBadgeColor = (role: string) => {
    if (role === "Head") return "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30";
    if (role === "Core Member") return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    return "bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 border-neutral-600/30";
  };

  return (
    <div className="reveal-item group relative w-full">
      {/* Card container with hover effects */}
      <div className="relative rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 hover:border-white/20">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
        
        {/* Content */}
        <div className="relative p-6 flex flex-col items-center gap-4 text-center">
          {/* Hexagonal image container */}
          <div className="relative w-32 h-32">
            {/* Hexagonal clip path wrapper */}
            <div 
              className="w-full h-full relative overflow-hidden transition-transform duration-300 group-hover:scale-110"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div 
                className="absolute inset-[2px] overflow-hidden bg-neutral-900"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                }}
              >
                <PixelImage
                  src={imgSrc}
                  grid="4x6"
                  fill
                  pixelFadeInDuration={800}
                  maxAnimationDelay={900}
                  colorRevealDelay={1000}
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
              {member.name}
            </h3>
            
            {/* Role badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
              {member.role}
            </div>
            
            {member.class && (
              <p className="text-xs text-neutral-500 font-medium">Class {member.class}</p>
            )}
          </div>

          {/* Social links */}
          {(member.links.github || member.links.linkedin || member.links.website) && (
            <div className="flex gap-3 mt-2">
              {member.links.github && (
                <a 
                  href={member.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={`${member.name} GitHub`} 
                  className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-200"
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
                  className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-blue-400 hover:scale-110 transition-all duration-200"
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
                  className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-purple-400 hover:scale-110 transition-all duration-200"
                >
                  <FaGlobe size={18} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
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
