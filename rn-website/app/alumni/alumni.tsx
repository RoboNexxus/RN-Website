"use client";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { resolveAssetPath } from "@/lib/utils";
import alumniData from "@/data/alumni.json";
import dynamic from "next/dynamic";

const PixelImage = dynamic(
  () => import("@/components/ui/pixel-image").then(mod => ({ default: mod.PixelImage })),
  { ssr: false }
);

type Alumni = (typeof alumniData.alumni)[number];

function AlumniCard({ alumni }: { alumni: Alumni }) {
  const imgSrc = resolveAssetPath(alumni.image);

  return (
    <div className="reveal-item flex flex-col w-full max-w-sm mx-auto hover:scale-[1.02] transition-transform duration-300">
      {/* Dark Card Container matching site theme */}
      <div className="bg-neutral-900 border-4 border-white/20 shadow-2xl rounded-lg overflow-hidden">

        {/* Image Section */}
        <div className="border-b-2 border-white/20 bg-black p-4">
          <div className="border-2 border-white/30 bg-neutral-950 p-2">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-black">
              <PixelImage
                src={imgSrc}
                customGrid={{ rows: 8, cols: 6 }}
                fill
                pixelFadeInDuration={800}
                maxAnimationDelay={900}
                colorRevealDelay={1000}
                className="opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-neutral-900 px-6 py-6 border-b-2 border-white/20">
          <p className="text-xl font-bold text-white leading-tight">
            {alumni.name}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-neutral-400">
              {alumni.role}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-500 tracking-wide">
              Batch {alumni.batch}
            </span>
          </div>
        </div>

        {/* Footer with social links */}
        <div className="bg-black px-6 py-4 flex items-center justify-center">
          <div className="flex gap-4">
            {alumni.links.github && (
              <a
                href={alumni.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${alumni.name} GitHub`}
                className="text-white hover:text-neutral-400 hover:scale-110 transition-transform"
              >
                <FaGithub size={20} />
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
                <FaLinkedin size={20} />
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
                <FaGlobe size={20} />
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4"
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
