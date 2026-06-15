"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { PixelImage } from "@/components/ui/pixel-image";
import alumniData from "@/data/alumni.json";

type Alumni = (typeof alumniData.alumni)[number];

function resolveImage(path: string) {
  return path.replace(/^(\.\/)?assets\/images\//, "/images/");
}

function AlumniCard({ alumni }: { alumni: Alumni }) {
  const imgSrc = resolveImage(alumni.image);
  return (
    <div className="reveal-item flex flex-col items-center gap-5 rounded-2xl glass-border bg-white/5 p-8 text-center hover:bg-white/10 transition-colors duration-200">
      <div className="w-32 h-32 rounded-full ring-2 ring-white/10 overflow-hidden">
        <PixelImage
          src={imgSrc}
          grid="4x6"
          fill
          pixelFadeInDuration={800}
          maxAnimationDelay={900}
          colorRevealDelay={1000}
        />
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

      <div className="flex gap-4 mt-auto">
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

export default function Alumni() {
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
          <AlumniCard key={a.name} alumni={a} />
        ))}
      </AnimeScrollReveal>
    </main>
  );
}
