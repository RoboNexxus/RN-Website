"use client";

import dynamic from "next/dynamic";
import eventsData from "@/data/events.json";
import { FileText, MessageSquare } from "lucide-react";

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

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center justify-center w-full max-w-6xl gap-4 md:gap-6">
        
        {/* Event Title & Date on Top */}
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-pixelify text-white uppercase tracking-tight mb-2">
            {event.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-neutral-400 text-sm md:text-base">
            <span className="uppercase tracking-wider">{event.theme}</span>
            <span className="w-1 h-1 bg-green-500 rounded-full" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>

        {/* 3D Rock Model in Center */}
        <div className="w-full max-w-[500px] md:max-w-[600px] h-[280px] md:h-[350px] lg:h-[400px]">
          <RockModel />
        </div>

        {/* Event Details & Buttons */}
        <div className="text-center max-w-2xl space-y-4 md:space-y-6">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {/* Register Button */}
            {event.registrationLink && event.registrationLink !== "#" && (
              <button
                onClick={() => window.open(event.registrationLink, "_blank")}
                className="px-6 md:px-8 py-3 md:py-4 bg-green-500 hover:bg-green-600 text-black font-bold text-sm md:text-base rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/50"
              >
                Register Now
              </button>
            )}

            {/* Brochure Button */}
            {event.brochureLink && event.brochureLink !== "#" && (
              <button
                onClick={() => window.open(event.brochureLink, "_blank")}
                className="px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm md:text-base rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                Brochure
              </button>
            )}

            {/* Discord Button */}
            {event.discordLink && event.discordLink !== "#" && (
              <button
                onClick={() => window.open(event.discordLink, "_blank")}
                className="px-6 md:px-8 py-3 md:py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-sm md:text-base rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                Discord
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

