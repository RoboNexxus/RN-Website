"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import teamData from "@/data/team.json";
import dynamic from "next/dynamic";

const PixelImage = dynamic(
  () => import("@/components/ui/pixel-image").then(mod => ({ default: mod.PixelImage })), 
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-gradient-to-br from-[#f5e6d3] to-[#d4c4a8] animate-pulse" />
  }
);

type Member = (typeof teamData.members)[number];

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveAssetPath(member.image);
  
  // Dark theme color palette based on role - using neutral grays for better visibility
  const colorTheme = member.role === "Head" 
    ? { bg: "bg-neutral-800", text: "text-white" }
    : member.role === "Core Member"
    ? { bg: "bg-neutral-700", text: "text-white" }
    : { bg: "bg-neutral-600", text: "text-white" };

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
                customGrid={{ rows: 8, cols: 6 }}
                fill
                pixelFadeInDuration={800}
                maxAnimationDelay={900}
                colorRevealDelay={1000}
                className="opacity-90 mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-[#e8dcc4] px-6 py-6 space-y-3 border-b-4 border-black">
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
                  className="font-bold text-black hover:text-neutral-700 underline decoration-2 underline-offset-2"
                >
                  work
                </a>
              ) : (
                <span className="font-bold text-neutral-700">work</span>
              )}
              {" "}to see how I blend creativity with technology, and feel free to{" "}
              {member.links.linkedin || member.links.github ? (
                <a 
                  href={member.links.linkedin || member.links.github || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-black hover:text-neutral-700 underline decoration-2 underline-offset-2"
                >
                  reach out
                </a>
              ) : (
                <span className="font-bold text-neutral-700">reach out</span>
              )}
              {" "}and collaborate on something great!
            </p>
          </div>
        </div>

        {/* Footer Section with social links */}
        <div className={`${colorTheme.bg} px-6 py-4 flex items-center justify-center`}>
          <div className="flex gap-4">
            {member.links.github && (
              <a 
                href={member.links.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`${member.name} GitHub`}
                className={`${colorTheme.text} hover:scale-110 transition-transform`}
              >
                <FaGithub size={20} />
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
                <FaLinkedin size={20} />
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
                <FaGlobe size={20} />
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
