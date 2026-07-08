"use client";

import dynamic from "next/dynamic";
import eventsData from "@/data/events.json";

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
    <main className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] md:min-h-[100dvh] w-full overflow-hidden px-4 md:px-12">
      {/* Background Text - Event Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="text-[20vw] md:text-[16vw] leading-none font-bold font-pixelify text-neutral-900 dark:text-white/5 whitespace-nowrap uppercase tracking-tight">
          {event.title}
        </div>
      </div>

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center justify-center w-full max-w-6xl gap-8 md:gap-12">
        
        {/* Event Title on Top */}
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold font-pixelify text-white uppercase tracking-tight mb-4">
            {event.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-neutral-400">
            <span className="text-sm md:text-base uppercase tracking-wider">{event.theme}</span>
            <span className="w-1 h-1 bg-green-500 rounded-full" />
            <span className="text-sm md:text-base">{formatDate(event.date)}</span>
          </div>
        </div>

        {/* 3D Rock Model in Center */}
        <div className="w-full max-w-[600px] h-[400px] md:h-[500px]">
          <RockModel />
        </div>

        {/* Event Details Below */}
        <div className="text-center max-w-2xl space-y-6">
          <p className="text-neutral-300 text-lg md:text-xl leading-relaxed">
            {event.description}
          </p>
          
          {event.location && (
            <div className="flex items-center justify-center gap-2 text-neutral-400">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm md:text-base">{event.location}</span>
            </div>
          )}

          {/* Register Button */}
          {event.registrationLink && (
            <button
              onClick={() => window.open(event.registrationLink, "_blank")}
              className="mt-8 px-10 py-4 bg-green-500 hover:bg-green-600 text-black font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50"
            >
              Register Now
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

