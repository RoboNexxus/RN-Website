"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { animate } from "animejs";
import eventsData from "@/data/events.json";
import { ANIMATION_CONFIG } from "@/lib/animation-config";
import AnimePageHero from "@/components/ui/anime-page-hero";
import AnimeScrollReveal from "@/components/ui/anime-scroll-reveal";

const RockModel = dynamic(() => import("@/components/ui/rock-model"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-neutral-600 animate-pulse">Loading 3D Model...</div>
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
  image?: string;
};

// ─── Main Events Component ───────────────────────────────────────────────────

export default function Events() {
  const event: Event = eventsData.events[0];

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 via-black to-black pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="mb-20">
          <AnimePageHero
            title="Our Events"
            subtitle="Join us for exciting robotics competitions, workshops, and community gatherings"
          />
        </div>

        {/* Featured Event with 3D Rock Model */}
        <section className="mb-24">
          <AnimeScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold font-pixelify text-green-400 mb-3 uppercase tracking-wider">
                Featured Competition
              </h2>
              <div className="w-24 h-1 bg-green-500 mx-auto rounded-full" />
            </div>
          </AnimeScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* 3D Rock Model */}
            <AnimeScrollReveal>
              <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900/50 to-black border border-neutral-800">
                <RockModel />
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-green-500/30 rounded-tl-2xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-green-500/30 rounded-br-2xl" />
              </div>
            </AnimeScrollReveal>

            {/* Event Details */}
            <AnimeScrollReveal delay={200}>
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
                    <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">
                      {event.theme}
                    </span>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-bold font-pixelify text-white mb-4 leading-tight">
                    {event.title}
                  </h2>
                  
                  <p className="text-xl text-neutral-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Event Meta */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 uppercase tracking-wider">Date</p>
                      <p className="text-lg font-semibold text-white">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 uppercase tracking-wider">Location</p>
                        <p className="text-lg font-semibold text-white">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => {
                      if (event.registrationLink) {
                        window.open(event.registrationLink, "_blank");
                      }
                    }}
                    className="group relative px-10 py-5 bg-green-500 hover:bg-green-600 text-black font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Register for Robotronics
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </AnimeScrollReveal>
          </div>
        </section>
      </div>
    </main>
  );
}

