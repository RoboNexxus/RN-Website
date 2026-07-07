"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimePageHero from "@/components/ui/anime-page-hero";
import eventsData from "@/data/events.json";

// ─── Types ───────────────────────────────────────────────────────────────────

type Event = {
  id: number;
  title: string;
  date: string;
  endDate?: string; // Optional end date for multi-day events
  description?: string;
  theme?: string;
  location?: string;
  registrationLink?: string;
  image?: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateRange(startIso: string, endIso?: string) {
  const start = new Date(startIso + "T00:00:00");
  
  if (!endIso) {
    return start.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }
  
  const end = new Date(endIso + "T00:00:00");
  
  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  
  // Same year, different month
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString("en-IN", { day: "numeric", month: "long" })} - ${end.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  
  // Different years
  return `${start.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} - ${end.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
}

// ─── Event Modal ─────────────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl glass-border bg-black/90 p-7 flex flex-col gap-5"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="text-xl font-bold leading-snug font-pixelify">{event.title}</h2>

        <div className="flex flex-col gap-2 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function CalendarView({ events, onSelect }: { events: Event[]; onSelect: (e: Event) => void }) {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const eventMap = events.reduce<Record<string, Event[]>>((acc, e) => {
    // Add event to start date
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    
    // If event has end date, add to all dates in range
    if (e.endDate) {
      const start = new Date(e.date + "T00:00:00");
      const end = new Date(e.endDate + "T00:00:00");
      const current = new Date(start);
      current.setDate(current.getDate() + 1); // Start from day after start date
      
      while (current <= end) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");
        const isoDate = `${y}-${m}-${d}`;
        if (!acc[isoDate]) acc[isoDate] = [];
        acc[isoDate].push(e);
        current.setDate(current.getDate() + 1);
      }
    }
    
    return acc;
  }, {});

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  }

  function isoDate(day: number) {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  }

  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  const monthEvents = events
    .filter((e) => {
      const start = new Date(e.date + "T00:00:00");
      const end = e.endDate ? new Date(e.endDate + "T00:00:00") : start;
      
      // Check if event starts or spans through current month
      return (
        (start.getFullYear() === currentYear && start.getMonth() === currentMonth) ||
        (end.getFullYear() === currentYear && end.getMonth() === currentMonth) ||
        (start < new Date(currentYear, currentMonth, 1) && end > new Date(currentYear, currentMonth + 1, 0))
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Calendar grid */}
      <div className="flex-1 rounded-2xl glass-border bg-white/5 p-5 flex flex-col gap-4">
        {/* Month nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="text-center">
            <span className="font-pixelify text-lg font-bold">{MONTHS[currentMonth]}</span>
            <span className="ml-2 text-neutral-500 text-sm">{currentYear}</span>
          </div>

          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-neutral-600 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const iso = isoDate(day);
            const dayEvents = eventMap[iso] ?? [];
            const hasEvent = dayEvents.length > 0;
            const todayDay = isToday(day);

            return (
              <motion.button
                key={day}
                onClick={() => hasEvent && onSelect(dayEvents[0])}
                whileTap={hasEvent ? { scale: 0.92 } : undefined}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-150
                  ${hasEvent ? "cursor-pointer bg-white/8 hover:bg-white/15" : "cursor-default hover:bg-white/5"}
                  ${todayDay ? "ring-1 ring-white/30" : ""}
                `}
                aria-label={
                  hasEvent
                    ? `${day} ${MONTHS[currentMonth]}: ${dayEvents.map((e) => e.title).join(", ")}`
                    : `${day} ${MONTHS[currentMonth]}`
                }
              >
                <span className={`text-xs font-medium ${todayDay ? "text-white font-bold" : hasEvent ? "text-white" : "text-neutral-600"}`}>
                  {day}
                </span>

                {hasEvent && (
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-white/60" />
                )}

                {todayDay && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Month event list */}
      <div className="w-full lg:w-64 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest shrink-0">
            {MONTHS[currentMonth].slice(0, 3)}
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {monthEvents.length === 0 ? (
          <div className="rounded-xl glass-border bg-white/5 p-5 text-center">
            <p className="text-sm text-neutral-600">No events this month</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {monthEvents.map((event) => {
              const start = new Date(event.date + "T00:00:00");
              const end = event.endDate ? new Date(event.endDate + "T00:00:00") : null;
              const dateLabel = end
                ? `${start.getDate()}-${end.getDate()}`
                : `${start.getDate()}`;
              return (
                <motion.button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-left rounded-xl glass-border bg-white/5 hover:bg-white/10 p-3 flex items-start gap-3 transition-colors group cursor-pointer"
                >
                  <div className="flex flex-col items-center shrink-0 w-auto min-w-8">
                    <span className="font-pixelify text-base font-bold text-white leading-none">{dateLabel}</span>
                    <span className="w-1.5 h-1.5 rounded-full mt-1 bg-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white leading-snug line-clamp-2">
                      {event.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
      <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5H12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 1V3M9 1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 3.5V6.5L8.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
      <path d="M6.5 1C4.567 1 3 2.567 3 4.5C3 7.5 6.5 12 6.5 12C6.5 12 10 7.5 10 4.5C10 2.567 8.433 1 6.5 1Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// ─── Event Card (New Brutalist Design) ───────────────────────────────────────

function EventCard({ event }: { event: Event }) {
  const handleRegister = () => {
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="relative rounded-3xl overflow-hidden glass-border bg-neutral-950/80 backdrop-blur-md">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_auto] min-h-[400px]">
          
          {/* Left Section - Event Title & Date */}
          <div className="relative p-8 md:p-10 flex flex-col justify-between border-r border-white/10 bg-gradient-to-br from-white/5 to-transparent min-w-[280px]">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-6 uppercase">
                Upcoming Event
              </div>
              
              <div className="relative mb-8">
                {/* Date Badge with Circular Design */}
                <div className="inline-block relative">
                  <svg viewBox="0 0 400 320" className="w-full max-w-[320px]">
                    {/* Circular background */}
                    <ellipse cx="200" cy="160" rx="180" ry="140" fill="rgb(34 197 94)" opacity="0.15" />
                    <ellipse cx="200" cy="160" rx="180" ry="140" fill="none" stroke="rgb(34 197 94)" strokeWidth="3" />
                    
                    {/* Text */}
                    <text
                      x="200"
                      y="175"
                      fontSize="100"
                      fontWeight="900"
                      fill="white"
                      textAnchor="middle"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      style={{ textTransform: 'uppercase' }}
                    >
                      {formatDateRange(event.date, event.endDate).split(' ')[0]}
                    </text>
                  </svg>
                </div>
              </div>

              <h2 className="font-pixelify text-4xl md:text-5xl font-black leading-[0.9] mb-4 uppercase tracking-tight">
                {event.title.split(' ')[0]}
                <br />
                {event.title.split(' ').slice(1).join(' ')}
              </h2>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm font-medium text-neutral-400">
                {formatDateRange(event.date, event.endDate)}
              </p>
            </div>
          </div>

          {/* Middle Left - Description */}
          <div className="p-8 md:p-10 flex flex-col justify-between border-r border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-4 uppercase">
                Description
              </div>
              <p className="text-base md:text-lg font-medium leading-relaxed text-neutral-300">
                {event.description || "Join us for an exciting event filled with learning, innovation, and collaboration."}
              </p>
            </div>
          </div>

          {/* Middle Right - Theme */}
          <div className="p-8 md:p-10 flex flex-col justify-between border-r border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-4 uppercase">
                Theme
              </div>
              <p className="text-base md:text-lg font-medium leading-relaxed text-neutral-300">
                {event.theme || "Innovation and Technology"}
              </p>
            </div>

            {event.location && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-2 uppercase">
                  Location
                </div>
                <p className="text-sm font-semibold text-white">
                  {event.location}
                </p>
              </div>
            )}
          </div>

          {/* Right Section - Register CTA */}
          <div className="p-8 md:p-10 flex flex-col justify-between items-center bg-gradient-to-br from-green-600/10 to-transparent min-w-[200px]">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-6 uppercase">
                  Register Now
                </div>
                
                {/* Circular Arrow Icon */}
                <div className="relative inline-block mb-6">
                  <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-28 md:h-28">
                    <circle cx="60" cy="60" r="55" fill="none" stroke="rgb(34 197 94)" strokeWidth="3" opacity="0.3" />
                    <path 
                      d="M 30 60 Q 60 30, 90 60 T 90 90" 
                      fill="none" 
                      stroke="rgb(34 197 94)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                    <polygon points="88,82 98,90 90,98" fill="rgb(34 197 94)" />
                  </svg>
                </div>

                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-green-600/20"
                >
                  Register
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="80" cy="20" r="40" fill="rgb(34 197 94)" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Upcoming Events Section ─────────────────────────────────────────────────

function UpcomingEvents({ events }: { events: Event[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = event.endDate 
        ? new Date(event.endDate + "T00:00:00") 
        : new Date(event.date + "T00:00:00");
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingEvents.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto rounded-2xl glass-border bg-white/5 p-12 text-center">
        <p className="text-lg text-neutral-500">No upcoming events at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {upcomingEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');

  return (
    <>
      <main className="flex flex-col items-center flex-1 px-4 py-20 gap-10">
        <AnimePageHero
          title="Events"
          subtitle="Every competition, workshop, and showcase — past and future."
        />

        {/* View Toggle */}
        <div className="flex gap-2 p-1 rounded-xl glass-border bg-white/5">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-white/10 text-white'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white/10 text-white'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            Calendar View
          </button>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <UpcomingEvents events={eventsData.events as Event[]} />
        ) : (
          <CalendarView events={eventsData.events as Event[]} onSelect={setSelectedEvent} />
        )}
      </main>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
