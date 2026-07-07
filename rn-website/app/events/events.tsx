"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import eventsData from "@/data/events.json";

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
      className="min-h-screen w-full"
    >
      {/* Full Page Grid Layout */}
      <div className="h-screen w-full grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.2fr_1fr]">
        
        {/* Left Section - Event Title & Date */}
        <div className="relative p-8 md:p-12 flex flex-col justify-between border-r border-neutral-800 bg-neutral-100">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-8 uppercase">
              Upcoming Event
            </div>
            
            <div className="mb-12">
              {/* Date Badge with Circular Design */}
              <div className="relative inline-block mb-8">
                <svg viewBox="0 0 400 300" className="w-full max-w-[350px]">
                  {/* Circular background */}
                  <ellipse cx="200" cy="150" rx="190" ry="130" fill="rgb(34 197 94)" opacity="0.2" />
                  <ellipse cx="200" cy="150" rx="190" ry="130" fill="none" stroke="rgb(34 197 94)" strokeWidth="4" />
                  
                  {/* Text */}
                  <text
                    x="200"
                    y="175"
                    fontSize="90"
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

            <h2 className="font-black text-5xl md:text-6xl lg:text-7xl leading-[0.85] mb-6 uppercase tracking-tighter text-neutral-900" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {event.title}
            </h2>
          </div>

          <div className="mt-auto pt-8">
            <div className="h-1 w-24 bg-neutral-900 mb-4" />
            <p className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
              {formatDateForDisplay(event.date, event.endDate)}
            </p>
          </div>
        </div>

        {/* Middle Left - Description */}
        <div className="p-8 md:p-12 flex flex-col justify-start border-r border-neutral-800 bg-neutral-50">
          <div className="text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-6 uppercase">
            Description
          </div>
          <p className="text-lg md:text-xl font-semibold leading-relaxed text-neutral-900">
            {event.description || "Join us for an exciting event filled with learning, innovation, and collaboration."}
          </p>
        </div>

        {/* Middle Right - Theme & Location */}
        <div className="p-8 md:p-12 flex flex-col justify-between border-r border-neutral-800 bg-neutral-100">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-6 uppercase">
              Theme
            </div>
            <p className="text-lg md:text-xl font-semibold leading-relaxed text-neutral-900">
              {event.theme || "Innovation and Technology"}
            </p>
          </div>

          {event.location && (
            <div className="mt-12">
              <div className="text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-4 uppercase">
                Location
              </div>
              <p className="text-base md:text-lg font-bold text-neutral-900">
                {event.location}
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Register CTA */}
        <div className="p-8 md:p-12 flex flex-col justify-between items-center bg-neutral-200 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="rgb(34 197 94)" opacity="0.15" />
            </svg>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-[11px] font-bold tracking-[0.25em] text-neutral-600 mb-8 uppercase">
              Register Now
            </div>
            
            {/* Circular Arrow Icon */}
            <div className="mb-10">
              <svg viewBox="0 0 140 140" className="w-32 h-32 md:w-36 md:h-36">
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
              className="px-10 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-base uppercase tracking-wider transition-all shadow-xl"
              disabled={!event.registrationLink || event.registrationLink === "#"}
            >
              Register
            </motion.button>
          </div>

          {/* Bottom Decorative Circle */}
          <div className="absolute bottom-0 left-0 w-48 h-48 -ml-24 -mb-24">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="60" fill="rgb(34 197 94)" opacity="0.1" />
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
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-black text-neutral-900 mb-4">No Upcoming Events</h1>
          <p className="text-lg text-neutral-600">Check back soon for future events!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full">
      {upcomingEvents.map((event, index) => (
        <EventFullPage key={event.id} event={event} index={index} />
      ))}
    </main>
  );
}
