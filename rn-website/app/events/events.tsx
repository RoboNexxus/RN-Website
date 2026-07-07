"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import eventsData from "@/data/events.json";

const EventLogoModel = dynamic(() => import("@/components/ui/event-logo-model"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center"><div className="text-neutral-500">Loading...</div></div>
});

// ─── Types ───────────────────────────────────────────────────────────────────

type Event = {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  description?: string;
  theme?: string;
  location?: string;
  registrationLink?: string;
  image?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateForDisplay(iso: string, endIso?: string) {
  const start = new Date(iso + "T00:00:00");
  
  if (!endIso) {
    return start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  
  const end = new Date(endIso + "T00:00:00");
  return `${start.getDate()} ${start.toLocaleDateString("en-IN", { month: "short" })} - ${end.getDate()} ${end.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
}

// ─── Full Page Event Display ─────────────────────────────────────────────────

function EventFullPage({ event, index }: { event: Event; index: number }) {
  const handleRegister = () => {
    if (event.registrationLink && event.registrationLink !== "#") {
      window.open(event.registrationLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="h-screen w-full overflow-hidden"
    >
      {/* Full Page Grid Layout - Optimized for no scrolling */}
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr_1.1fr_0.9fr]">
        
        {/* Left Section - Event Title & Date */}
        <div className="relative p-4 md:p-6 lg:p-8 flex flex-col justify-between border-r border-white/10 bg-neutral-950">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-4 md:mb-6 uppercase">
              Upcoming Event
            </div>
            
            <div className="mb-4 md:mb-6">
              {/* Date Badge with Circular Design - Smaller */}
              <div className="relative inline-block">
                <svg viewBox="0 0 400 300" className="w-full max-w-[200px] md:max-w-[250px] lg:max-w-[280px]">
                  <ellipse cx="200" cy="150" rx="190" ry="130" fill="rgb(34 197 94)" opacity="0.15" />
                  <ellipse cx="200" cy="150" rx="190" ry="130" fill="none" stroke="rgb(34 197 94)" strokeWidth="4" />
                  
                  <text
                    x="200"
                    y="170"
                    fontSize="90"
                    fontWeight="900"
                    fill="white"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {event.endDate ? formatDateForDisplay(event.date, event.endDate).split(' ')[0] : new Date(event.date + "T00:00:00").getDate()}
                  </text>
                  <text
                    x="200"
                    y="195"
                    fontSize="28"
                    fontWeight="700"
                    fill="white"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}
                  </text>
                </svg>
              </div>
            </div>

            <h2 className="font-pixelify font-black text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[0.85] uppercase tracking-tighter text-white">
              {event.title}
            </h2>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="h-0.5 w-16 bg-white mb-2" />
            <p className="text-[10px] md:text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              {formatDateForDisplay(event.date, event.endDate)}
            </p>
          </div>
        </div>

        {/* Middle Left - Description */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-center border-r border-white/10 bg-black/50">
          <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-3 md:mb-4 uppercase">
            Description
          </div>
          <p className="text-sm md:text-base lg:text-lg font-semibold leading-relaxed text-white line-clamp-6">
            {event.description || "Join us for an exciting event filled with learning, innovation, and collaboration."}
          </p>
        </div>

        {/* Middle Right - Theme, Location & 3D Model */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-between border-r border-white/10 bg-neutral-950">
          <div>
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-3 md:mb-4 uppercase">
              Theme
            </div>
            <p className="text-sm md:text-base lg:text-lg font-semibold leading-relaxed text-white line-clamp-3">
              {event.theme || "Innovation and Technology"}
            </p>
          </div>

          {/* 3D Logo Model */}
          <div className="my-4 h-32 md:h-40 lg:h-48">
            <EventLogoModel />
          </div>

          {event.location && (
            <div>
              <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-2 uppercase">
                Location
              </div>
              <p className="text-xs md:text-sm lg:text-base font-bold text-white line-clamp-2">
                {event.location}
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Register CTA */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center bg-black/70 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-48 md:h-48 -mr-20 md:-mr-24 -mt-20 md:-mt-24">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="rgb(34 197 94)" opacity="0.1" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-4 md:mb-6 uppercase">
              Register Now
            </div>
            
            {/* Circular Arrow Icon - Smaller */}
            <div className="mb-6 md:mb-8">
              <svg viewBox="0 0 140 140" className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgb(34 197 94)" strokeWidth="3" opacity="0.3" />
                <path 
                  d="M 35 70 Q 70 35, 105 70" 
                  fill="none" 
                  stroke="rgb(34 197 94)" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M 105 70 L 105 105" 
                  fill="none" 
                  stroke="rgb(34 197 94)" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                />
                <polygon points="100,100 110,110 110,100" fill="rgb(34 197 94)" />
              </svg>
            </div>

            <motion.button
              onClick={handleRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 lg:px-10 py-3 md:py-3.5 lg:py-4 rounded-xl md:rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xs md:text-sm lg:text-base uppercase tracking-wider transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!event.registrationLink || event.registrationLink === "#"}
            >
              Register
            </motion.button>
          </div>

          {/* Bottom Decorative Circle */}
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 -ml-16 md:-ml-20 -mb-16 md:-mb-20">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="60" fill="rgb(34 197 94)" opacity="0.08" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Events() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = (eventsData.events as Event[])
    .filter((event) => {
      const eventDate = event.endDate 
        ? new Date(event.endDate + "T00:00:00") 
        : new Date(event.date + "T00:00:00");
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingEvents.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen bg-black overflow-hidden">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 font-pixelify">No Upcoming Events</h1>
          <p className="text-base md:text-lg text-neutral-400">Check back soon for future events!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-black overflow-hidden">
      {upcomingEvents.map((event, index) => (
        <EventFullPage key={event.id} event={event} index={index} />
      ))}
    </main>
  );
}
