"use client";

import Image from "next/image";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import projectsData from "@/data/tutorials.json";

function resolveImage(path: string) {
  return path
    .replace(/^\/src\/assets\/images\//, "/images/")
    .replace(/^assets\/images\//, "/images/");
}

type Project = (typeof projectsData.tutorials)[number];

function ProjectCard({ project }: { project: Project }) {
  const imgSrc = resolveImage(project.image);
  return (
    <div
      className={`reveal-item rounded-2xl glass-border bg-white/5 overflow-hidden flex flex-col hover:bg-white/10 transition-colors duration-200 ${
        project.isWide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
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
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <Meteors />

      <AnimePageHero
        title="Projects"
        subtitle="Everything we've built — from combat bots to autonomous drones."
      />

      <AnimeScrollReveal
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-4xl"
        staggerDelay={90}
        fromY={1.5}
      >
        {projectsData.tutorials.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </AnimeScrollReveal>
    </main>
  );
}
