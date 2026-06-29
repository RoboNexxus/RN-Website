"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import teamData from "@/data/team.json";
import dynamic from "next/dynamic";

const PixelImage = dynamic(
  () =>
    import("@/components/ui/pixel-image").then((mod) => ({
      default: mod.PixelImage,
    })),
  {
    ssr: false,
  },
);

type Member = (typeof teamData.members)[number];

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveAssetPath(member.image);

  return (
    <div className="reveal-item flex flex-col w-full hover:scale-[1.03] transition-transform duration-300">
      <div className="bg-neutral-900 border-2 border-white/20 shadow-lg rounded-md overflow-hidden">
        {/* Image Section */}
        <div className="border-b border-white/20 bg-black p-2">
          <div className="border border-white/30 bg-neutral-950 p-1">
            <div className="relative w-full aspect-square overflow-hidden bg-black">
              <PixelImage
                src={imgSrc}
                customGrid={{ rows: 6, cols: 6 }}
                fill
                pixelFadeInDuration={600}
                maxAnimationDelay={700}
                colorRevealDelay={800}
                className="opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-neutral-900 px-3 py-3 border-b border-white/20">
          <p className="text-sm font-bold text-white leading-tight truncate">
            {member.name}
          </p>
          <p className="text-xs text-neutral-400 mt-0.5 truncate">
            {member.role}
          </p>
        </div>

        {/* Footer with social links */}
        <div className="bg-black px-3 py-2 flex items-center justify-center">
          <div className="flex gap-3">
            {member.links.github && (
              <a
                href={member.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} GitHub`}
                className="text-white hover:text-neutral-400 hover:scale-110 transition-transform"
              >
                <FaGithub size={14} />
              </a>
            )}
            {member.links.linkedin && (
              <a
                href={member.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="text-white hover:text-neutral-400 hover:scale-110 transition-transform"
              >
                <FaLinkedin size={14} />
              </a>
            )}
            {member.links.website && (
              <a
                href={member.links.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} website`}
                className="text-white hover:text-neutral-400 hover:scale-110 transition-transform"
              >
                <FaGlobe size={14} />
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
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4"
            staggerDelay={80}
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
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4"
              staggerDelay={80}
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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4"
          staggerDelay={50}
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
