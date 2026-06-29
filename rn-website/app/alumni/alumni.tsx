"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import alumniData from "@/data/alumni.json";
import dynamic from "next/dynamic";

const PixelImage = dynamic(
  () =>
    import("@/components/ui/pixel-image").then((mod) => ({
      default: mod.PixelImage,
    })),
  { ssr: false },
);

type Alumni = (typeof alumniData.alumni)[number];

function AlumniCard({ alumni }: { alumni: Alumni }) {
  const imgSrc = resolveAssetPath(alumni.image);

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
            {alumni.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-xs text-neutral-400 truncate">{alumni.role}</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-500 tracking-wide shrink-0">
              {alumni.batch}
            </span>
          </div>
        </div>

        {/* Footer with social links */}
        <div className="bg-black px-3 py-2 flex items-center justify-center">
          <div className="flex gap-3">
            {alumni.links.github && (
              <a
                href={alumni.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${alumni.name} GitHub`}
                className="text-white hover:text-neutral-400 hover:scale-110 transition-transform"
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
                className="text-white hover:text-neutral-400 hover:scale-110 transition-transform"
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
