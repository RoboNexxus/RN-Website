"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import { resolveAssetPath } from "@/lib/utils";
import alumniData from "@/data/alumni.json";
import Image from "next/image";
import { usePageEnter } from "@/lib/use-page-enter";

type Alumni = (typeof alumniData.alumni)[number];

function AlumniCard({ alumni }: { alumni: Alumni }) {
  const imgSrc = resolveAssetPath(alumni.image);
  const hasLinks = Object.values(alumni.links).some((link) => link);

  return (
    <div className="group sm:w-[19vw] w-[70vw]">
      <div className="relative bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 border border-white/10 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl hover:border-white/20 transition-all duration-500 w-full h-full">
        {/* Image Section with Social Icons Overlay */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950">
          <Image
            src={imgSrc}
            alt={alumni.name}
            fill
            unoptimized
            className="object-cover pointer-events-none"
            sizes="(max-width: 640px) 70vw, 19vw"
          />

          {/* Social Icons Overlay - Top Right */}
          {hasLinks && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {alumni.links.linkedin && (
                <a
                  href={alumni.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${alumni.name} LinkedIn`}
                  className="bg-black/80 backdrop-blur-sm p-2.5 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaLinkedin size={18} />
                </a>
              )}

              {alumni.links.github && (
                <a
                  href={alumni.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${alumni.name} GitHub`}
                  className="bg-black/80 backdrop-blur-sm p-2.5 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub size={18} />
                </a>
              )}

              {alumni.links.website && (
                <a
                  href={alumni.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${alumni.name} website`}
                  className="bg-black/80 backdrop-blur-sm p-2.5 rounded-lg hover:bg-white hover:text-black transition-all duration-200 hover:scale-110 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGlobe size={18} />
                </a>
              )}
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 backdrop-blur-sm px-5 py-6 text-center">
          <h3 className="text-lg font-bold text-white leading-tight">
            {alumni.name}
          </h3>

          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <p className="text-sm text-neutral-400 font-medium">
              {alumni.role}
            </p>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 tracking-wide font-semibold">
              {alumni.batch}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Alumni() {
  const { containerRef } = usePageEnter();

  return (
    <main ref={containerRef as React.RefObject<HTMLElement>} className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <div data-enter="page-title">
        <AnimePageHero title="Alumni" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-7xl px-4">
        {alumniData.alumni.map((a) => (
          <div key={a.name} data-enter="card">
            <AlumniCard alumni={a} />
          </div>
        ))}
      </div>
    </main>
  );
}
