"use client";

import Image from "next/image";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";
import projectsData from "@/data/tutorials.json";

const CATEGORY_LABELS: Record<string, string> = {
  robots: "Robots",
  iot: "IoT",
  ai: "AI",
  drones: "Drones",
};

function resolveImage(path: string) {
  // "/src/assets/images/X.webp" or "assets/images/X.webp" → "/images/X.webp"
  return path
    .replace(/^\/src\/assets\/images\//, "/images/")
    .replace(/^assets\/images\//, "/images/");
}

type Project = (typeof projectsData.tutorials)[number];

function ProjectCard({ project }: { project: Project }) {
  const imgSrc = resolveImage(project.image);
  return (
    <div
      className={`reveal-item rounded-2xl glass-border bg-white/5 overflow-hidden flex flex-col hover:bg-white/8 transition-colors duration-200 ${
        project.isWide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="relative w-full h-44">
        <Image
          src={imgSrc}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-black/60 text-neutral-300 border border-white/10">
          {CATEGORY_LABELS[project.category] ?? project.category}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug">{project.title}</h3>
          <span
            className={`text-xs shrink-0 px-2 py-0.5 rounded-full border ${
              project.status === "Completed"
                ? "bg-neutral-800 text-neutral-400 border-neutral-700/40"
                : "bg-blue-900/50 text-blue-300 border-blue-700/40"
            }`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          {project.creator}
          {project.team ? ` · ${project.team}` : ""} · {project.year}
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed mt-1 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>
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
