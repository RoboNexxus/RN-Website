"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { SiSnapchat, SiInstagram } from "react-icons/si";
import { BsTwitterX } from "react-icons/bs";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import teamData from "@/data/team.json";
import Image from "next/image";

type Member = (typeof teamData.members)[number];

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveAssetPath(member.image);
  const hasLinks = Object.values(member.links).some(link => link);

  return (
    <div className="reveal-item group flex flex-col w-full">
      <div className="relative bg-gradient-to-br from-neutral-800/50 to-neutral-900/80 border border-white/10 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
        {/* Image Section with Social Icons Overlay */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950">
          <Image
            src={imgSrc}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          
          {/* Social Icons Overlay - Top Right */}
          {hasLinks && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {member.links.linkedin && (
                <a
                  href={member.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110"
                >
                  <FaLinkedin size={16} />
                </a>
              )}
              {member.links.github && (
                <a
                  href={member.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} GitHub`}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110"
                >
                  <FaGithub size={16} />
                </a>
              )}
              {member.links.website && (
                <a
                  href={member.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} website`}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110"
                >
                  <FaGlobe size={16} />
                </a>
              )}
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 backdrop-blur-sm px-4 py-4">
          <h3 className="text-base font-bold text-white leading-tight truncate">
            {member.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-medium truncate">
            {member.role}
          </p>
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
