"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import alumniData from "@/data/alumni.json";
import Image from "next/image";

type Alumni = (typeof alumniData.alumni)[number];

function AlumniCard({ alumni }: { alumni: Alumni }) {
  const imgSrc = resolveAssetPath(alumni.image);
  const hasLinks = Object.values(alumni.links).some(link => link);

  return (
    <div className="reveal-item group flex flex-col w-full">
      <div className="relative bg-gradient-to-br from-neutral-800/50 to-neutral-900/80 border border-white/10 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
        {/* Image Section with Social Icons Overlay */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950">
          <Image
            src={imgSrc}
            alt={alumni.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          
          {/* Social Icons Overlay - Top Right */}
          {hasLinks && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {alumni.links.linkedin && (
                <a
                  href={alumni.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${alumni.name} LinkedIn`}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110"
                >
                  <FaLinkedin size={16} />
                </a>
              )}
              {alumni.links.github && (
                <a
                  href={alumni.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${alumni.name} GitHub`}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110"
                >
                  <FaGithub size={16} />
                </a>
              )}
              {alumni.links.website && (
                <a
                  href={alumni.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${alumni.name} website`}
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
            {alumni.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <p className="text-xs text-neutral-400 font-medium truncate">
              {alumni.role}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 tracking-wide shrink-0 font-semibold">
              {alumni.batch}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Alumni() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <AnimePageHero
        title="Alumni"
        subtitle="The people who built the foundation. Robo Nexus wouldn't exist without them."
      />

      <AnimeScrollReveal
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full max-w-7xl px-4"
        staggerDelay={60}
        fromY={1.5}
      >
        {alumniData.alumni.map((a) => (
          <AlumniCard key={a.name} alumni={a} />
        ))}
      </AnimeScrollReveal>
    </main>
  );
}
