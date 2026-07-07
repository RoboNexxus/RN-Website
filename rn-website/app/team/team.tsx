"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
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
    <div className="sm:w-[19vw] sm:h-[27vw] w-[70vw] h-[100vw] flex flex-col items-center mt-[4vh] bg-[#191919] sm:rounded-[1vw] rounded-[4vw] group relative hover:scale-102 transition-all duration-300">
      <Image
        src={imgSrc}
        alt={member.name}
        className="sm:w-[19vw] w-[70vw] aspect-square object-cover sm:p-[2vw] p-[4vw] sm:rounded-[2.6vw] rounded-[7vw]"
        sizes="(max-width: 640px) 70vw, 19vw"
        width={0}
        height={0}
      />
      <h2 className="text-[#fff] sm:text-[1.5vw] text-[6vw] font-bold">
        {member.name}
      </h2>
      <h4 className="sm:text-[#8c8c8c] sm:text-[1.1vw] text-[4.5vw] sm:group-hover:text-[#16e16e] text-[#fff] transition-all duration-300">
        {member.role}
      </h4>
      
      {hasLinks && (
        <div
          className="flex flex-row justify-center items-center bg-[#393939] rounded-[4vw] gap-[4vw] mt-[5vw] p-[4vw] px-[7vw] sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-300 sm:rounded-[1vw] sm:gap-[1.4vw] sm:mt-[1.6vw] sm:p-[1vw] sm:px-[2.4vw]"
        >
          {member.links.linkedin && (
            <a
              href={member.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="text-[#fff] hover:text-[#16e16e] transition-all duration-300"
            >
              <FaLinkedin className="sm:text-[1.5vw] text-[6vw]" />
            </a>
          )}
          {member.links.github && (
            <a
              href={member.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              className="text-[#fff] hover:text-[#16e16e] transition-all duration-300"
            >
              <FaGithub className="sm:text-[1.5vw] text-[6vw]" />
            </a>
          )}
          {member.links.website && (
            <a
              href={member.links.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} website`}
              className="text-[#fff] hover:text-[#16e16e] transition-all duration-300"
            >
              <FaGlobe className="sm:text-[1.5vw] text-[6vw]" />
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
      <section className="w-full max-w-7xl flex flex-col gap-10">
        <AnimeScrollReveal className="text-center">
          <h2 className="text-2xl font-bold">Leadership</h2>
        </AnimeScrollReveal>

        <div>
          <SectionDivider title="Heads" />
          <AnimeScrollReveal
            className="flex flex-wrap justify-center gap-4 px-4"
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
              className="flex flex-wrap justify-center gap-4 px-4"
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
          className="flex flex-wrap justify-center gap-4 px-4"
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
