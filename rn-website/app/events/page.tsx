import type { Metadata } from "next";
import Events from "./events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "All Robo Nexus events — competitions, workshops, exhibitions, and meetups. Track upcoming and past events on an interactive timeline or calendar.",
};

export default function EventsPage() {
  return <Events />;
}
