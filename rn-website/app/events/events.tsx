"use client";

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

function EventFullPage({ event, index }: { event: Event; index: number }) {
  const handleRegister = () => {
    if (event.registrationLink && event.registrationLink !== "#") {
      window.open(event.registrationLink, '_blank');
    }
  };

  return (
    <main></main>
  );
}

