"use client";

import { FaGithub, FaLinkedin, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import teamData from "@/data/team.json";
import dynamic from "next/dynamic";
import Image from "next/image";

const PixelImage = dynamic(() => import("@/components/ui/pixel-image").then(mod => ({ default: mod.PixelImage })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-[#f5e6d3] to-[#d4c4a8] animate-pulse" />
});

type Member = (typeof teamData.members)[number];

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveAssetPath(member.image);
  
  // Vintage color palette based on role
  const colorTheme = member.role === "Head" 
    ? { bg: "bg-amber-500/90", text: "text-amber-900" }
    : member.role === "Core Member"
    ? { bg: "bg-orange-500/90", text: "text-orange-900" }
    : { bg: "bg-yellow-600/90", text: "text-yellow-900" };

  return (
    <div className="reveal-item flex flex-col w-full max-w-sm mx-auto hover:scale-[1.02] transition-transform duration-300">
      {/* Vintage Card Container */}
      <div className="bg-[#e8dcc4] border-8 border-black shadow-2xl rounded-sm overflow-hidden">
        
        {/* Image Section with vintage frame */}
        <div className="border-b-4 border-black bg-[#d4c4a8] p-4">
          <div className="border-4 border-black bg-[#f5e6d3] p-2">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#f5e6d3] to-[#d4c4a8]">
              <PixelImage
                src={imgSrc}
                grid="6x8"
                fill
                pixelFadeInDuration={800}
                maxAnimationDelay={900}
                colorRevealDelay={1000}
                className="opacity-90 mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-[#f5e6d3] border-b-4 border-black px-6 py-4">
          <p className="text-center text-sm italic text-neutral-800 font-serif">
            &ldquo;Innovation meets dedication&rdquo;
          </p>
        </div>

        {/* Bio Section */}
        <div className="bg-[#e8dcc4] px-6 py-5 space-y-3">
          <div>
            <p className="text-xl font-bold text-black leading-tight font-serif">
              I&apos;m {member.name}, {member.role.toLowerCase()} at Robo Nexus dedicated to building innovative robotics solutions.
            </p>
          </div>
          
          <div className="text-sm text-neutral-800 space-y-1">
            <p>
              Explore my{" "}
              {member.links.website ? (
                <a 
                  href={member.links.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-orange-700 hover:text-orange-900 underline decoration-2"
                >
                  work
                </a>
              ) : (
                <span className="font-bold text-orange-700">work</span>
              )}
              {" "}to see how I blend creativity with technology, and feel free to{" "}
              {member.links.linkedin || member.links.github ? (
                <a 
                  href={member.links.linkedin || member.links.github || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-orange-700 hover:text-orange-900 underline decoration-2"
                >
                  reach out
                </a>
              ) : (
                <span className="font-bold text-orange-700">reach out</span>
              )}
              {" "}and collaborate on something great!
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className={`${colorTheme.bg} border-t-4 border-black px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className={`${colorTheme.text} text-sm`} />
            <span className={`${colorTheme.text} text-xs font-bold`}>
              Class {member.class || "—"}
            </span>
          </div>
          
          <div className="flex gap-3">
            {member.links.github && (
              <a 
                href={member.links.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`${member.name} GitHub`}
                className={`${colorTheme.text} hover:scale-110 transition-transform`}
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
                className={`${colorTheme.text} hover:scale-110 transition-transform`}
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
                className={`${colorTheme.text} hover:scale-110 transition-transform`}
              >
                <FaGlobe size={18} />
              </a>
            )}
          </div>
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
      <section className="w-full max-w-7xl flex flex-col gap-10">
        <AnimeScrollReveal className="text-center">
          <h2 className="text-2xl font-bold">Leadership</h2>
        </AnimeScrollReveal>

        <div>
          <SectionDivider title="Heads" />
          <AnimeScrollReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
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
      <section className="w-full max-w-7xl">
        <AnimeScrollReveal className="text-center mb-10">
          <h2 className="text-2xl font-bold">Members</h2>
        </AnimeScrollReveal>
        <AnimeScrollReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
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
