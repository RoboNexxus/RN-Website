"use client";

import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import { PixelImage } from "@/components/ui/pixel-image";
import { resolveAssetPath } from "@/lib/utils";
import projectsData from "@/data/tutorials.json";

type Project = (typeof projectsData.tutorials)[number];

function ProjectCard({ project }: { project: Project }) {
  const imgSrc = resolveAssetPath(project.image);
  
  // Determine aspect ratio based on image orientation
  const aspectRatio = project.isVertical 
    ? "aspect-[2/3]" 
    : project.isWide 
    ? "aspect-[21/9]" 
    : "aspect-[4/3]";
  
  return (
    <div
      className="reveal-item rounded-2xl glass-border bg-white/5 overflow-hidden flex flex-col hover:bg-white/10 transition-colors duration-200 w-full"
    >
      <div className={`relative w-full ${aspectRatio} overflow-hidden bg-neutral-900`}>
        <PixelImage
          src={imgSrc}
          grid="6x4"
          fill
          pixelFadeInDuration={600}
          maxAnimationDelay={700}
          colorRevealDelay={800}
          className="absolute inset-0"
        />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-semibold text-base leading-snug">{project.title}</h3>
        <p className="text-xs text-neutral-500">
          {project.creator}
          {project.team ? ` · ${project.team}` : ""} · {project.year}
        </p>
        <p className="text-sm text-neutral-400 leading-relaxed mt-1 line-clamp-3">
          {project.description}
        </p>
      </div>
    </div>
  );
}

export default function Projects() {
  // Separate the legacy/featured project from the rest
  const featuredProject = projectsData.tutorials[0]; // The Legacy Collection
  const otherProjects = projectsData.tutorials.slice(1);
  
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <AnimePageHero
        title="Projects"
        subtitle="Everything we've built — from combat bots to autonomous drones."
      />

      <div className="w-full max-w-4xl flex flex-col gap-5">
        {/* Featured Project - Full Width */}
        <AnimeScrollReveal
          className="w-full"
          staggerDelay={90}
          fromY={1.5}
        >
          <ProjectCard project={featuredProject} />
        </AnimeScrollReveal>

        {/* Rest of Projects - Masonry Layout */}
        <AnimeScrollReveal
          className="columns-1 sm:columns-2 gap-5 w-full"
          staggerDelay={90}
          fromY={1.5}
        >
          {otherProjects.map((p) => (
            <div key={p.id} className="break-inside-avoid mb-5">
              <ProjectCard project={p} />
            </div>
          ))}
        </AnimeScrollReveal>
      </div>
    </main>
  );
}
