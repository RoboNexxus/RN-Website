import type { Metadata } from "next";
import Events from "./events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "All Robo Nexus events — competitions, workshops, exhibitions, and meetups.",
};

export default function EventsPage() {
  return <Events />;
}
