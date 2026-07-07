"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import eventsData from "@/data/events.json";
import { CornerSquiggles, CornerDots } from "@/components/ui/page-doodles";

const EventLogoModel = dynamic(() => import("@/components/ui/event-logo-model"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center"><div className="text-neutral-600">Loading...</div></div>
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
      className="h-screen w-full overflow-hidden grid-bg"
    >
      {/* Full Page Grid Layout */}
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr_1.1fr_0.9fr]">
        
        {/* Left Section - Event Title & Date */}
        <div className="relative p-3 md:p-4 lg:p-6 flex flex-col justify-center border-r-2 border-white">
          <div className="flex flex-col items-start">
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-600 mb-3 md:mb-4 uppercase">
              Upcoming Event
            </div>
            
            {/* Compact Date Badge */}
            <div className="mb-3 md:mb-4">
              <div className="relative inline-block">
                <svg viewBox="0 0 200 140" className="w-full max-w-[140px] md:max-w-[160px] lg:max-w-[180px]">
                  {/* Hand-drawn ellipse */}
                  <ellipse 
                    cx="100" 
                    cy="70" 
                    rx="90" 
                    ry="60" 
                    fill="none" 
                    stroke="rgb(34 197 94)" 
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  
                  <text
                    x="100"
                    y="80"
                    fontSize="48"
                    fontWeight="900"
                    fill="#1a1a1a"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {event.endDate ? formatDateForDisplay(event.date, event.endDate).split(' ')[0] : new Date(event.date + "T00:00:00").getDate()}
                  </text>
                  <text
                    x="100"
                    y="105"
                    fontSize="18"
                    fontWeight="700"
                    fill="#1a1a1a"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}
                  </text>
                </svg>
              </div>
            </div>

            <h2 className="font-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[0.85] uppercase tracking-tighter text-neutral-900 mb-2">
              {event.title}
            </h2>

            {/* Hand-drawn underline - Compact */}
            <svg viewBox="0 0 300 15" className="w-full max-w-[200px] md:max-w-[250px] -mt-1 mb-3">
              <path 
                d="M 10,8 Q 75,5 150,9 T 290,7" 
                fill="none" 
                stroke="#1a1a1a" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
            </svg>

            <p className="text-[10px] md:text-xs font-semibold text-neutral-700 uppercase tracking-wide mt-2">
              {formatDateForDisplay(event.date, event.endDate)}
            </p>
          </div>
        </div>

        {/* Middle Left - Description */}
        <div className="p-3 md:p-4 lg:p-6 flex flex-col justify-center border-r-2 border-white">
          <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-600 mb-3 uppercase">
            Description
          </div>
          <p className="text-xs md:text-sm lg:text-base font-semibold leading-relaxed text-neutral-900 line-clamp-6 md:line-clamp-8">
            {event.description || "Join us for an exciting event filled with learning, innovation, and collaboration."}
          </p>
        </div>

        {/* Middle Right - Theme & Location */}
        <div className="p-3 md:p-4 lg:p-6 flex flex-col justify-between border-r-2 border-white">
          <div>
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-600 mb-3 uppercase">
              Theme
            </div>
            <p className="text-xs md:text-sm lg:text-base font-semibold leading-relaxed text-neutral-900 line-clamp-3">
              {event.theme || "Innovation and Technology"}
            </p>
          </div>

          {event.location && (
            <div className="mt-4">
              <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-600 mb-2 uppercase">
                Location
              </div>
              <p className="text-xs md:text-sm lg:text-base font-bold text-neutral-900 line-clamp-2">
                {event.location}
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Register CTA with 3D Model */}
        <div className="p-3 md:p-4 lg:p-6 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative doodles */}
          <CornerSquiggles className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 -mr-12 -mt-12 text-green-600 rotate-45" />
          <CornerDots className="absolute bottom-0 left-0 w-28 h-28 md:w-32 md:h-32 -ml-8 -mb-8 text-green-600" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center w-full space-y-3 md:space-y-4">
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-600 uppercase">
              Register Now
            </div>
            
            {/* 3D Logo Model - Compact */}
            <div className="w-full h-32 md:h-40 lg:h-48">
              <EventLogoModel />
            </div>

            <motion.button
              onClick={handleRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-3.5 rounded-xl md:rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xs md:text-sm lg:text-base uppercase tracking-wider transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!event.registrationLink || event.registrationLink === "#"}
            >
              Register
            </motion.button>
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
      <main className="flex items-center justify-center h-screen grid-bg overflow-hidden">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 font-pixelify">No Upcoming Events</h1>
          <p className="text-base md:text-lg text-neutral-600">Check back soon for future events!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full overflow-hidden">
      {upcomingEvents.map((event, index) => (
        <EventFullPage key={event.id} event={event} index={index} />
      ))}
    </main>
  );
}
