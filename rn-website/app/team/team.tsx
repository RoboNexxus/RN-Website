"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { PixelImage } from "@/components/ui/pixel-image";
import teamData from "@/data/team.json";

type Member = (typeof teamData.members)[number];

function resolveImage(path: string) {
  return path.replace(/^(\.\/)?assets\/images\//, "/images/");
}

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveImage(member.image);
  return (
    <div className="reveal-item flex flex-col items-center gap-4 rounded-2xl glass-border bg-white/5 p-7 text-center hover:bg-white/10 transition-colors duration-200 w-full">
      <div className="w-28 h-28 overflow-hidden rounded-full ring-2 ring-white/10">
        <PixelImage
          src={imgSrc}
          grid="4x6"
          pixelFadeInDuration={800}
          maxAnimationDelay={900}
          colorRevealDelay={1000}
        />
      </div>
      <div>
        <p className="font-semibold text-base">{member.name}</p>
        <p className="text-sm text-neutral-400 mt-1">{member.role}</p>
        {member.class && (
          <p className="text-xs text-neutral-500 mt-0.5">Class {member.class}</p>
        )}
      </div>
      <div className="flex gap-4 mt-1">
        {member.links.github && (
          <a href={member.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`} className="text-neutral-400 hover:text-white transition-colors">
            <FaGithub size={16} />
          </a>
        )}
        {member.links.linkedin && (
          <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`} className="text-neutral-400 hover:text-white transition-colors">
            <FaLinkedin size={16} />
          </a>
        )}
        {member.links.website && (
          <a href={member.links.website} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} website`} className="text-neutral-400 hover:text-white transition-colors">
            <FaGlobe size={16} />
          </a>
        )}
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
      <Meteors />

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
