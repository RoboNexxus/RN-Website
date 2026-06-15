"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import teamData from "@/data/team.json";
import alumniData from "@/data/alumni.json";

type Member = (typeof teamData.members)[number];
type Alumni = (typeof alumniData.alumni)[number];

function resolveImage(path: string) {
  // Convert "assets/images/X.webp" → "/images/X.webp"
  return path.replace(/^(\.\/)?assets\/images\//, "/images/");
}

function MemberCard({ member }: { member: Member }) {
  const imgSrc = resolveImage(member.image);
  return (
    <div className="reveal-item flex flex-col items-center gap-3 rounded-2xl glass-border bg-white/5 p-5 text-center transition-transform hover:-translate-y-1 hover:bg-white/10 duration-200">
      <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
        <Image
          src={imgSrc}
          alt={member.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div>
        <p className="font-semibold text-sm">{member.name}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{member.role}</p>
        {member.class && (
          <p className="text-xs text-neutral-500 mt-0.5">Class {member.class}</p>
        )}
      </div>
      <div className="flex gap-3 mt-1">
        {member.links.github && (
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} GitHub`}
            className="text-neutral-400 hover:text-white transition-colors"
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
            className="text-neutral-400 hover:text-white transition-colors"
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
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <FaGlobe size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

function AlumniCard({ alumni }: { alumni: Alumni }) {
  const imgSrc = resolveImage(alumni.image);
  return (
    <div className="reveal-item flex flex-col items-center gap-3 rounded-2xl glass-border bg-white/5 p-5 text-center transition-transform hover:-translate-y-1 hover:bg-white/10 duration-200">
      <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
        <Image
          src={imgSrc}
          alt={alumni.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div>
        <p className="font-semibold text-sm">{alumni.name}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{alumni.role}</p>
        <p className="text-xs text-neutral-500 mt-0.5">Batch {alumni.batch}</p>
      </div>
      {alumni.contribution && (
        <p className="text-xs text-neutral-500 leading-relaxed px-1">
          {alumni.contribution}
        </p>
      )}
      <div className="flex gap-3 mt-1">
        {alumni.links.github && (
          <a
            href={alumni.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${alumni.name} GitHub`}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <FaGithub size={14} />
          </a>
        )}
        {alumni.links.linkedin && (
          <a
            href={alumni.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${alumni.name} LinkedIn`}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <FaLinkedin size={14} />
          </a>
        )}
        {alumni.links.website && (
          <a
            href={alumni.links.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${alumni.name} website`}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <FaGlobe size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  const heads = teamData.members.filter((m) => m.role === "Head");
  const others = teamData.members.filter((m) => m.role !== "Head");

  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <Meteors />

      {/* anime.js char-stagger hero */}
      <AnimePageHero
        title="Meet the Team"
        subtitle="The people building, innovating, and keeping the lights on at Robo Nexus."
      />

      {/* Heads — staggered card reveal */}
      <section className="w-full max-w-4xl">
        <AnimeScrollReveal className="mb-6 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-neutral-300">
            Leadership
          </h2>
        </AnimeScrollReveal>
        <AnimeScrollReveal
          className="grid grid-cols-2 sm:grid-cols-3 gap-5 justify-items-center"
          staggerDelay={100}
          fromY={1.5}
        >
          {heads.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </AnimeScrollReveal>
      </section>

      {/* Members */}
      <section className="w-full max-w-4xl">
        <AnimeScrollReveal className="mb-6 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-neutral-300">
            Core Members
          </h2>
        </AnimeScrollReveal>
        <AnimeScrollReveal
          className="grid grid-cols-2 sm:grid-cols-4 gap-5 justify-items-center"
          staggerDelay={80}
          fromY={1.5}
        >
          {others.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </AnimeScrollReveal>
      </section>

      {/* Alumni */}
      {alumniData.alumni.length > 0 && (
        <section className="w-full max-w-4xl">
          <AnimeScrollReveal className="mb-6 text-center">
            <h2 className="text-xl font-semibold tracking-wide text-neutral-300">
              Alumni
            </h2>
          </AnimeScrollReveal>
          <AnimeScrollReveal
            className="grid grid-cols-2 sm:grid-cols-3 gap-5 justify-items-center"
            staggerDelay={100}
            fromY={1.5}
          >
            {alumniData.alumni.map((a) => (
              <AlumniCard key={a.name} alumni={a} />
            ))}
          </AnimeScrollReveal>
        </section>
      )}
    </main>
  );
}
