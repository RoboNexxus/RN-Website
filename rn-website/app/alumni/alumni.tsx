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
    <div className="sm:w-[19vw] sm:h-[29vw] w-[70vw] h-[105vw] flex flex-col items-center mt-[4vh] bg-[#191919] sm:rounded-[1vw] rounded-[4vw] group relative hover:scale-102 transition-all duration-300">
      <Image
        src={imgSrc}
        alt={alumni.name}
        className="sm:w-[19vw] w-[70vw] aspect-square object-cover sm:p-[2vw] p-[4vw] sm:rounded-[2.6vw] rounded-[7vw]"
        sizes="(max-width: 640px) 70vw, 19vw"
        width={0}
        height={0}
      />
      <h2 className="text-[#fff] sm:text-[1.5vw] text-[6vw] font-bold">
        {alumni.name}
      </h2>
      <div className="flex items-center gap-2 mt-1">
        <h4 className="sm:text-[#8c8c8c] sm:text-[1.1vw] text-[4.5vw] sm:group-hover:text-[#16e16e] text-[#fff] transition-all duration-300">
          {alumni.role}
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 tracking-wide font-semibold sm:text-[0.8vw]">
          {alumni.batch}
        </span>
      </div>
      
      {hasLinks && (
        <div
          className="flex flex-row justify-center items-center bg-[#393939] rounded-[4vw] gap-[4vw] mt-[5vw] p-[4vw] px-[7vw] sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-300 sm:rounded-[1vw] sm:gap-[1.4vw] sm:mt-[1.6vw] sm:p-[1vw] sm:px-[2.4vw]"
        >
          {alumni.links.linkedin && (
            <a
              href={alumni.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${alumni.name} LinkedIn`}
              className="text-[#fff] hover:text-[#16e16e] transition-all duration-300"
            >
              <FaLinkedin className="sm:text-[1.5vw] text-[6vw]" />
            </a>
          )}
          {alumni.links.github && (
            <a
              href={alumni.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${alumni.name} GitHub`}
              className="text-[#fff] hover:text-[#16e16e] transition-all duration-300"
            >
              <FaGithub className="sm:text-[1.5vw] text-[6vw]" />
            </a>
          )}
          {alumni.links.website && (
            <a
              href={alumni.links.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${alumni.name} website`}
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

export default function Alumni() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <AnimePageHero
        title="Alumni"
        subtitle="The people who built the foundation. Robo Nexus wouldn't exist without them."
      />

      <AnimeScrollReveal
        className="flex flex-wrap justify-center gap-4 w-full max-w-7xl px-4"
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
