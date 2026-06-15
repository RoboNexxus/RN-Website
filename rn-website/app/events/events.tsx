"use client";

import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";

const UPCOMING_EVENTS = [
  {
    title: "Robo Wars 2026",
    date: "August 2026",
    description:
      "Our flagship combat robotics tournament. Teams compete in three weight classes across a two-day elimination bracket.",
    tag: "Upcoming",
  },
  {
    title: "Workshop: Intro to ROS 2",
    date: "July 2026",
    description:
      "A hands-on weekend workshop covering ROS 2 fundamentals, sensor integration, and basic autonomous navigation.",
    tag: "Upcoming",
  },
  {
    title: "Hack-a-Bot Hackathon",
    date: "September 2026",
    description:
      "48-hour build sprint — teams get a mystery component kit and have to construct a functional bot from scratch.",
    tag: "Upcoming",
  },
];

const PAST_EVENTS = [
  {
    title: "Robo Soccer Championship 2025",
    date: "March 2025",
    description:
      "Inter-school robo-soccer tournament hosted by Robo Nexus. 12 teams competed across three rounds.",
    tag: "Completed",
  },
  {
    title: "Arduino Bootcamp",
    date: "January 2025",
    description:
      "A three-session beginner bootcamp covering basic electronics, Arduino programming, and sensor interfacing.",
    tag: "Completed",
  },
];

function EventCard({
  title,
  date,
  description,
  tag,
}: {
  title: string;
  date: string;
  description: string;
  tag: string;
}) {
  const isUpcoming = tag === "Upcoming";
  return (
    <div className="reveal-item rounded-2xl glass-border bg-white/5 p-6 flex flex-col gap-3 hover:bg-white/10 transition-colors duration-200">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-base">{title}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
            isUpcoming
              ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/40"
              : "bg-neutral-800 text-neutral-400 border border-neutral-700/40"
          }`}
        >
          {tag}
        </span>
      </div>
      <p className="text-xs text-neutral-500">{date}</p>
      <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Events() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-20 gap-16">
      <Meteors />

      <AnimePageHero
        title="Events"
        subtitle="Competitions, workshops, and hackathons — everything Robo Nexus puts on."
      />

      <section className="w-full max-w-3xl">
        <AnimeScrollReveal className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-300">
            Upcoming Events
          </h2>
        </AnimeScrollReveal>
        <AnimeScrollReveal
          className="flex flex-col gap-4"
          staggerDelay={110}
          fromY={1.5}
        >
          {UPCOMING_EVENTS.map((ev) => (
            <EventCard key={ev.title} {...ev} />
          ))}
        </AnimeScrollReveal>
      </section>

      <section className="w-full max-w-3xl">
        <AnimeScrollReveal className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-300">
            Past Events
          </h2>
        </AnimeScrollReveal>
        <AnimeScrollReveal
          className="flex flex-col gap-4"
          staggerDelay={110}
          fromY={1.5}
        >
          {PAST_EVENTS.map((ev) => (
            <EventCard key={ev.title} {...ev} />
          ))}
        </AnimeScrollReveal>
      </section>
    </main>
  );
}
