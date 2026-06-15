"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import teamData from "@/data/team.json";

type Member = (typeof teamData.members)[number];

function resolveImage(path: string) {
  return path.replace(/^(\.\/)?assets\/images\//, "/images/");
}

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveImage(member.image);
  return (
    <div className="reveal-item flex flex-col items-center gap-4 rounded-2xl glass-border bg-white/5 p-7 text-center transition-transform hover:-translate-y-1 hover:bg-white/10 duration-200 w-full">
      <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-white/10">
        <Image src={imgSrc} alt={member.name} fill className="object-cover" sizes="112px" />
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

export default function Team() {
  const heads = teamData.members.filter((m) => m.role === "Head");
  const members = teamData.members.filter((m) => m.role !== "Head");

  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <Meteors />

      <AnimePageHero
        title="Meet the Team"
        subtitle="The people building, innovating, and keeping the lights on at Robo Nexus."
      />

      {/* ── Heads ── */}
      <section className="w-full max-w-4xl">
        <AnimeScrollReveal className="mb-2 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-neutral-300">Heads</h2>
          <p className="text-xs text-neutral-500 mt-1">Club leadership</p>
        </AnimeScrollReveal>

        {/* divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        <AnimeScrollReveal
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center"
          staggerDelay={100}
          fromY={1.5}
        >
          {heads.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </AnimeScrollReveal>
      </section>

      {/* ── Core Members ── */}
      <section className="w-full max-w-4xl">
        <AnimeScrollReveal className="mb-2 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-neutral-300">Members</h2>
          <p className="text-xs text-neutral-500 mt-1">The builders</p>
        </AnimeScrollReveal>

        {/* divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

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
