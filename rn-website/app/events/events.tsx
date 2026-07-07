"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import eventsData from "@/data/events.json";

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
      className="h-screen w-full overflow-hidden bg-neutral-200"
    >
      {/* Full Page Grid Layout with Grid Background */}
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr_1.1fr_0.9fr] grid-bg">
        
        {/* Left Section - Event Title & Date */}
        <div className="relative p-4 md:p-6 lg:p-8 flex flex-col justify-between border-r-2 border-neutral-800">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[9px] md:text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-4 md:mb-6 uppercase">
              Upcoming Event
            </div>
            
            <div className="mb-6 md:mb-8">
              {/* Date Badge with Circular Design - Hand-drawn style */}
              <div className="relative inline-block">
                <svg viewBox="0 0 400 300" className="w-full max-w-[220px] md:max-w-[280px] lg:max-w-[320px]">
                  {/* Hand-drawn circle effect */}
                  <ellipse 
                    cx="200" 
                    cy="150" 
                    rx="190" 
                    ry="130" 
                    fill="none" 
                    stroke="rgb(34 197 94)" 
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  
                  <text
                    x="200"
                    y="170"
                    fontSize="100"
                    fontWeight="900"
                    fill="#1a1a1a"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {event.endDate ? formatDateForDisplay(event.date, event.endDate).split(' ')[0] : new Date(event.date + "T00:00:00").getDate()}
                  </text>
                  <text
                    x="200"
                    y="205"
                    fontSize="32"
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

            <h2 className="font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.85] uppercase tracking-tighter text-neutral-900">
              {event.title}
            </h2>
          </div>

          <div className="mt-4 pt-4">
            <div className="h-1 w-20 bg-neutral-900 mb-3" />
            <p className="text-[11px] md:text-xs font-bold text-neutral-700 uppercase tracking-wide">
              {formatDateForDisplay(event.date, event.endDate)}
            </p>
          </div>
        </div>

        {/* Middle Left - Description */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-center border-r-2 border-neutral-800">
          <div className="text-[9px] md:text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-4 uppercase">
            Description
          </div>
          <p className="text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-neutral-900 line-clamp-6">
            {event.description || "Join us for an exciting event filled with learning, innovation, and collaboration."}
          </p>
        </div>

        {/* Middle Right - Theme, Logo & Location */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-between border-r-2 border-neutral-800">
          <div>
            <div className="text-[9px] md:text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-4 uppercase">
              Theme
            </div>
            <p className="text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-neutral-900 line-clamp-3">
              {event.theme || "Innovation and Technology"}
            </p>
          </div>

          {event.location && (
            <div>
              <div className="text-[9px] md:text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-3 uppercase">
                Location
              </div>
              <p className="text-sm md:text-base lg:text-lg font-bold text-neutral-900 line-clamp-2">
                {event.location}
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Register CTA with 3D Model */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-between items-center relative overflow-hidden">
          {/* Decorative doodle circles */}
          <div className="absolute top-0 right-0 w-48 h-48 -mr-24 -mt-24 opacity-20">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgb(34 197 94)" strokeWidth="4" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgb(34 197 94)" strokeWidth="3" />
            </svg>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full">
            <div className="text-[9px] md:text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-6 uppercase">
              Register Now
            </div>
            
            {/* 3D Logo Model */}
            <div className="w-full h-48 md:h-56 lg:h-64 mb-6">
              <EventLogoModel />
            </div>

            <motion.button
              onClick={handleRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 md:px-10 lg:px-12 py-3 md:py-3.5 lg:py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-wider transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!event.registrationLink || event.registrationLink === "#"}
            >
              Register
            </motion.button>
          </div>

          {/* Bottom decorative doodle */}
          <div className="absolute bottom-0 left-0 w-40 h-40 -ml-20 -mb-20 opacity-15">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgb(34 197 94)" strokeWidth="5" />
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
      <main className="flex items-center justify-center h-screen bg-neutral-200 grid-bg overflow-hidden">
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
