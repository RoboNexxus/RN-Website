"use client";

import dynamic from "next/dynamic";
import eventsData from "@/data/events.json";
import AnimatedButton from "@/components/ui/animated-button";
import { FaDiscord, FaFileAlt } from "react-icons/fa";

const RockModel = dynamic(() => import("@/components/ui/rock-model"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-neutral-600 animate-pulse">Loading...</div>
    </div>
  ),
});

// ─── Types ───────────────────────────────────────────────────────────────────

type Event = {
  title: string;
  date: string;
  endDate?: string;
  description?: string;
  theme?: string;
  location?: string;
  registrationLink?: string;
  brochureLink?: string;
  discordLink?: string;
};

// ─── Main Events Component ───────────────────────────────────────────────────

export default function Events() {
  const event: Event = eventsData.events[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="relative flex flex-col items-center justify-center h-[calc(100dvh-56px)] md:h-[100dvh] w-full overflow-hidden px-4 md:px-8">
      {/* Background Text - Event Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="text-[20vw] md:text-[16vw] leading-none font-bold font-pixelify text-neutral-900 dark:text-white/5 whitespace-nowrap uppercase tracking-tight">
          {event.title}
        </div>
      </div>

      {/* Brochure Button - Left Side */}
      {event.brochureLink && event.brochureLink !== "#" && (
        <div className="absolute left-[20%] md:left-[25%] lg:left-[30%] top-1/2 -translate-y-1/2 z-20">
          <AnimatedButton
            onClick={() => window.open(event.brochureLink, "_blank")}
            className="!text-white dark:!text-white"
          >
            <FaFileAlt className="w-5 h-5" />
          </AnimatedButton>
        </div>
      )}

      {/* Discord Button - Right Side */}
      {event.discordLink && event.discordLink !== "#" && (
        <div className="absolute right-[20%] md:right-[25%] lg:right-[30%] top-1/2 -translate-y-1/2 z-20">
          <AnimatedButton
            onClick={() => window.open(event.discordLink, "_blank")}
            className="!text-white dark:!text-white"
          >
            <FaDiscord className="w-5 h-5" />
          </AnimatedButton>
        </div>
      )}

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center justify-center w-full max-w-6xl gap-4 md:gap-6">
        
        {/* Event Title & Date on Top */}
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-pixelify text-white uppercase tracking-tight mb-3">
            {event.title}
          </h1>
          <div className="text-neutral-400 text-base md:text-lg">
            {formatDate(event.date)}
          </div>
        </div>

        {/* 3D Rock Model in Center */}
        <div className="w-full max-w-[500px] md:max-w-[600px] h-[280px] md:h-[350px] lg:h-[400px]">
          <RockModel />
        </div>

        {/* Event Details & Register Button */}
        <div className="text-center max-w-2xl space-y-4 md:space-y-5">
          {/* Location */}
          {event.location && (
            <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm md:text-base">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs md:text-sm">{event.location}</span>
            </div>
          )}

          {/* Register Button */}
          {event.registrationLink && event.registrationLink !== "#" && (
            <AnimatedButton
              onClick={() => window.open(event.registrationLink, "_blank")}
              className="!text-white dark:!text-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
            >
              Register Now
            </AnimatedButton>
          )}
        </div>
      </div>
    </main>
  );
}

