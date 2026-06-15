"use client";

import { useState } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import MemberModal, { type ModalMember } from "@/components/ui/member-modal";
import alumniData from "@/data/alumni.json";

type Alumni = (typeof alumniData.alumni)[number];

function resolveImage(path: string) {
  return path.replace(/^(\.\/)?assets\/images\//, "/images/");
}

function AlumniCard({
  alumni,
  onClick,
}: {
  alumni: Alumni;
  onClick: () => void;
}) {
  const imgSrc = resolveImage(alumni.image);
  return (
    <div
      onClick={onClick}
      className="reveal-item flex flex-col items-center gap-5 rounded-2xl glass-border bg-white/5 p-8 text-center cursor-pointer transition-transform hover:-translate-y-1 hover:bg-white/10 duration-200"
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-white/10">
        <Image src={imgSrc} alt={alumni.name} fill className="object-cover" sizes="128px" />
      </div>

      <div>
        <p className="font-semibold text-lg">{alumni.name}</p>
        <p className="text-sm text-neutral-400 mt-1">{alumni.role}</p>
        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
          Batch {alumni.batch}
        </span>
      </div>

      {alumni.contribution && (
        <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
          {alumni.contribution}
        </p>
      )}

      <div className="flex gap-4 mt-auto" onClick={(e) => e.stopPropagation()}>
        {alumni.links.github && (
          <a href={alumni.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name} GitHub`} className="text-neutral-400 hover:text-white transition-colors">
            <FaGithub size={18} />
          </a>
        )}
        {alumni.links.linkedin && (
          <a href={alumni.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name} LinkedIn`} className="text-neutral-400 hover:text-white transition-colors">
            <FaLinkedin size={18} />
          </a>
        )}
        {alumni.links.website && (
          <a href={alumni.links.website} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name} website`} className="text-neutral-400 hover:text-white transition-colors">
            <FaGlobe size={18} />
          </a>
        )}
      </div>
    </div>
  );
}

function toModalMember(a: Alumni): ModalMember {
  return {
    name: a.name,
    role: a.role,
    image: resolveImage(a.image),
    batch: a.batch,
    contribution: a.contribution,
    links: a.links,
  };
}

export default function Alumni() {
  const [selected, setSelected] = useState<ModalMember | null>(null);

  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <Meteors />

      <AnimePageHero
        title="Alumni"
        subtitle="The people who built the foundation. Robo Nexus wouldn't exist without them."
      />

      <AnimeScrollReveal
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
        staggerDelay={120}
        fromY={1.5}
      >
        {alumniData.alumni.map((a) => (
          <AlumniCard key={a.name} alumni={a} onClick={() => setSelected(toModalMember(a))} />
        ))}
      </AnimeScrollReveal>

      {selected && (
        <MemberModal member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
