"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animate, stagger } from "animejs";
import { Meteors } from "@/components/ui/meteors";
import AnimePageHero from "@/components/ui/anime-page-hero";
import eventsData from "@/data/events.json";

// ─── Types ──────────────────────────────────────────────────────────────────

type Event = (typeof eventsData.events)[number];
type ViewMode = "timeline" | "calendar";

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { dot: string; badge: string; glow: string }> = {
  competition: {
    dot: "bg-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
    glow: "shadow-red-500/20",
  },
  workshop: {
    dot: "bg-blue-400",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    glow: "shadow-blue-500/20",
  },
  exhibition: {
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    glow: "shadow-amber-500/20",
  },
  meetup: {
    dot: "bg-green-400",
    badge: "bg-green-500/15 text-green-300 border-green-500/30",
    glow: "shadow-green-500/20",
  },
  other: {
    dot: "bg-purple-400",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    glow: "shadow-purple-500/20",
  },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()].slice(0, 3).toUpperCase(),
    year: d.getFullYear(),
  };
}

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
}

// ─── EventModal ──────────────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const style = getCategoryStyle(event.category);
  const isPast = event.status === "completed";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-lg rounded-2xl glass-border bg-black/90 p-7 flex flex-col gap-5"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Category + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${style.badge}`}>
              {event.category}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                isPast
                  ? "bg-neutral-800/60 text-neutral-400 border-white/10"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              }`}
            >
              {isPast ? "Completed" : "Upcoming"}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold leading-snug font-pixelify">{event.title}</h2>

          {/* Meta */}
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

          {/* Divider */}
          <div className="h-px bg-white/10 w-full" />

          {/* Description */}
          <p className="text-sm text-neutral-300 leading-relaxed">{event.description}</p>

          {/* Highlights */}
          {event.highlights.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                {isPast ? "Highlights" : "What to expect"}
              </p>
              <ul className="flex flex-col gap-1.5">
                {event.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Timeline View ───────────────────────────────────────────────────────────

function TimelineCard({
  event,
  side,
  onClick,
  index,
}: {
  event: Event;
  side: "left" | "right";
  onClick: () => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const style = getCategoryStyle(event.category);
  const { day, month, year } = formatShortDate(event.date);
  const isPast = event.status === "completed";

  useEffect(() => {
    if (!ref.current || animated.current) return;

    const el = ref.current;
    el.style.opacity = "0";
    el.style.transform = `translateX(${side === "left" ? "-2rem" : "2rem"})`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animate(el, {
            opacity: [0, 1],
            translateX: [side === "left" ? "-2rem" : "2rem", "0rem"],
            duration: 700,
            ease: "outExpo",
            delay: index * 60,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [side, index]);

  return (
    <div
      className={`relative flex items-start gap-0 w-full ${
        side === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {/* Card */}
      <div ref={ref} className="w-[calc(50%-2rem)] shrink-0">
        <button
          onClick={onClick}
          className={`w-full text-left rounded-2xl glass-border bg-white/5 p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer group shadow-lg ${style.glow} hover:shadow-xl`}
        >
          {/* Date badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${style.badge}`}
              >
                {event.category}
              </span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                isPast
                  ? "text-neutral-500 border-white/10"
                  : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              }`}
            >
              {isPast ? "Done" : "Soon"}
            </span>
          </div>

          <h3 className="font-semibold text-sm leading-snug text-white group-hover:text-white transition-colors mb-1">
            {event.title}
          </h3>
          <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{event.description}</p>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <LocationIcon size={11} />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
            <span>View details</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
              <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </div>

      {/* Center column: dot + connector */}
      <div className="w-16 shrink-0 flex flex-col items-center gap-0 pt-5">
        {/* Date floating badge */}
        <div className="flex flex-col items-center mb-1">
          <span className="font-pixelify text-lg font-bold text-white leading-none">{day}</span>
          <span className="text-[9px] font-semibold text-neutral-500 tracking-widest">{month}</span>
          <span className="text-[9px] text-neutral-600">{year}</span>
        </div>
        {/* Connector dot */}
        <div className={`w-3 h-3 rounded-full border-2 border-black z-10 ${style.dot}`} />
      </div>

      {/* Spacer for opposite side */}
      <div className="w-[calc(50%-2rem)] shrink-0" />
    </div>
  );
}

function TimelineView({ events, onSelect }: { events: Event[]; onSelect: (e: Event) => void }) {
  const past = events.filter((e) => e.status === "completed").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const upcoming = events.filter((e) => e.status === "upcoming").sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const allEvents = [...upcoming, ...past];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

      {/* Upcoming label */}
      {upcoming.length > 0 && (
        <div className="relative flex justify-center mb-6">
          <span className="relative z-10 bg-black px-3 text-xs font-semibold text-emerald-400 uppercase tracking-widest border border-emerald-500/30 rounded-full py-1">
            Upcoming
          </span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {allEvents.map((event, i) => {
          const isFirstPast =
            event.status === "completed" &&
            (i === 0 || allEvents[i - 1].status === "upcoming");

          return (
            <div key={event.id}>
              {isFirstPast && (
                <div className="relative flex justify-center mb-6 mt-4">
                  <span className="relative z-10 bg-black px-3 text-xs font-semibold text-neutral-500 uppercase tracking-widest border border-white/10 rounded-full py-1">
                    Past Events
                  </span>
                </div>
              )}
              <TimelineCard
                event={event}
                side={i % 2 === 0 ? "left" : "right"}
                onClick={() => onSelect(event)}
                index={i}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calendar View ───────────────────────────────────────────────────────────

function CalendarView({ events, onSelect }: { events: Event[]; onSelect: (e: Event) => void }) {
  const today = new Date();
  // Find the most relevant month: first upcoming event month, or current
  const firstUpcoming = events.find((e) => e.status === "upcoming");
  const initialDate = firstUpcoming ? new Date(firstUpcoming.date + "T00:00:00") : today;

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Build event map: "YYYY-MM-DD" → Event[]
  const eventMap = events.reduce<Record<string, Event[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  function isoDate(day: number) {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  }

  const isToday = (day: number) => {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  };

  // Sidebar: events in this month
  const monthEvents = events
    .filter((e) => {
      const d = new Date(e.date + "T00:00:00");
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* ── Calendar grid ── */}
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
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const iso = isoDate(day);
            const dayEvents = eventMap[iso] ?? [];
            const hasEvent = dayEvents.length > 0;
            const hasUpcoming = dayEvents.some((e) => e.status === "upcoming");
            const hasPast = dayEvents.some((e) => e.status === "completed");
            const todayDay = isToday(day);
            const isHovered = hoveredDay === day;

            return (
              <motion.button
                key={day}
                onClick={() => hasEvent && onSelect(dayEvents[0])}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                whileTap={hasEvent ? { scale: 0.92 } : undefined}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-150
                  ${hasEvent ? "cursor-pointer" : "cursor-default"}
                  ${todayDay ? "ring-1 ring-white/30" : ""}
                  ${hasUpcoming && !hasPast ? "bg-emerald-500/10 hover:bg-emerald-500/20" :
                    hasPast ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"}
                  ${isHovered && hasEvent ? "scale-105" : ""}
                `}
                aria-label={hasEvent ? `${day} ${MONTHS[currentMonth]}: ${dayEvents.map(e => e.title).join(", ")}` : `${day} ${MONTHS[currentMonth]}`}
              >
                <span className={`text-xs font-medium ${todayDay ? "text-white font-bold" : hasEvent ? "text-white" : "text-neutral-600"}`}>
                  {day}
                </span>

                {/* Event dots */}
                {hasEvent && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e, idx) => {
                      const s = getCategoryStyle(e.category);
                      return <span key={idx} className={`w-1 h-1 rounded-full ${s.dot}`} />;
                    })}
                  </div>
                )}

                {/* Today indicator */}
                {todayDay && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-1 pt-3 border-t border-white/10">
          {Object.entries(CATEGORY_COLORS).map(([cat, s]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs text-neutral-500 capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Month event list ── */}
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
              const style = getCategoryStyle(event.category);
              const { day } = formatShortDate(event.date);
              return (
                <motion.button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-left rounded-xl glass-border bg-white/5 hover:bg-white/10 p-3 flex items-start gap-3 transition-colors group cursor-pointer"
                >
                  <div className="flex flex-col items-center shrink-0 w-8">
                    <span className="font-pixelify text-base font-bold text-white leading-none">{day}</span>
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${style.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white leading-snug line-clamp-2 group-hover:text-white">
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

// ─── View Toggle ─────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl glass-border bg-white/5 p-1">
      {(["timeline", "calendar"] as ViewMode[]).map((v) => (
        <motion.button
          key={v}
          onClick={() => onChange(v)}
          className={`relative px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
            view === v ? "text-white" : "text-neutral-500 hover:text-neutral-300"
          }`}
          aria-pressed={view === v}
        >
          {view === v && (
            <motion.span
              layoutId="view-pill"
              className="absolute inset-0 rounded-lg bg-white/10"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {v === "timeline" ? <TimelineIcon /> : <CalendarGridIcon />}
            {v}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Stat Pills ───────────────────────────────────────────────────────────────

function StatBar({ events }: { events: Event[] }) {
  const upcoming = events.filter((e) => e.status === "upcoming").length;
  const past = events.filter((e) => e.status === "completed").length;
  const cats = [...new Set(events.map((e) => e.category))];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <div className="flex items-center gap-2 rounded-full glass-border bg-white/5 px-4 py-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-sm text-neutral-300">{upcoming} upcoming</span>
      </div>
      <div className="flex items-center gap-2 rounded-full glass-border bg-white/5 px-4 py-2">
        <span className="w-2 h-2 rounded-full bg-neutral-500" />
        <span className="text-sm text-neutral-300">{past} completed</span>
      </div>
      <div className="flex items-center gap-2 rounded-full glass-border bg-white/5 px-4 py-2">
        <span className="text-sm text-neutral-300">{cats.length} categories</span>
      </div>
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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

function LocationIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" className="shrink-0">
      <path d="M6.5 1C4.567 1 3 2.567 3 4.5C3 7.5 6.5 12 6.5 12C6.5 12 10 7.5 10 4.5C10 2.567 8.433 1 6.5 1Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="4" r="1.8" fill="currentColor" />
      <circle cx="7" cy="10" r="1.8" fill="currentColor" />
      <path d="M4 4H2M10 4H12M4 10H2M10 10H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarGridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 6H13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1.5V3.5M9.5 1.5V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="3.5" y="8" width="2" height="2" rx="0.4" fill="currentColor" />
      <rect x="8.5" y="8" width="2" height="2" rx="0.4" fill="currentColor" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Events() {
  const [view, setView] = useState<ViewMode>("timeline");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    animate(controlsRef.current, {
      opacity: [0, 1],
      translateY: ["1rem", "0rem"],
      duration: 500,
      ease: "outExpo",
      delay: 800,
    });
    controlsRef.current.style.opacity = "0";
  }, []);

  return (
    <>
      <main className="flex flex-col items-center flex-1 px-4 py-20 gap-10">
        <Meteors />

        <AnimePageHero
          title="Events"
          subtitle="Every competition, workshop, and showcase — past and future."
        />

        <StatBar events={eventsData.events} />

        {/* View toggle */}
        <div ref={controlsRef}>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {view === "timeline" ? (
              <TimelineView events={eventsData.events} onSelect={setSelectedEvent} />
            ) : (
              <CalendarView events={eventsData.events} onSelect={setSelectedEvent} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Event detail modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
