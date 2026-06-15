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
  time?: string;
  location: string;
  category: string;
  description: string;
  highlights: string[];
  status: string;
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

// ─── Event Modal ─────────────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const isPast = event.status === "completed";

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

        <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full border ${
          isPast
            ? "bg-neutral-800/60 text-neutral-400 border-white/10"
            : "bg-white/5 text-neutral-300 border-white/15"
        }`}>
          {isPast ? "Completed" : "Upcoming"}
        </span>

        <h2 className="text-xl font-bold leading-snug font-pixelify">{event.title}</h2>

        <div className="flex flex-col gap-2 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        <p className="text-sm text-neutral-300 leading-relaxed">{event.description}</p>

        {event.highlights.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
              {isPast ? "Highlights" : "What to expect"}
            </p>
            <ul className="flex flex-col gap-1.5">
              {event.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-neutral-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function CalendarView({ events, onSelect }: { events: Event[]; onSelect: (e: Event) => void }) {
  const today = new Date();
  const firstUpcoming = events.find((e) => e.status === "upcoming");
  const initialDate = firstUpcoming ? new Date(firstUpcoming.date + "T00:00:00") : today;

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const eventMap = events.reduce<Record<string, Event[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
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
      const d = new Date(e.date + "T00:00:00");
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
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
              const d = new Date(event.date + "T00:00:00");
              return (
                <motion.button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-left rounded-xl glass-border bg-white/5 hover:bg-white/10 p-3 flex items-start gap-3 transition-colors group cursor-pointer"
                >
                  <div className="flex flex-col items-center shrink-0 w-8">
                    <span className="font-pixelify text-base font-bold text-white leading-none">{d.getDate()}</span>
                    <span className="w-1.5 h-1.5 rounded-full mt-1 bg-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white leading-snug line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-[10px] text-neutral-600 mt-0.5 capitalize">{event.category}</p>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      <main className="flex flex-col items-center flex-1 px-4 py-20 gap-10">
        <AnimePageHero
          title="Events"
          subtitle="Every competition, workshop, and showcase — past and future."
        />

        <CalendarView events={eventsData.events as Event[]} onSelect={setSelectedEvent} />
      </main>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
