import type { Metadata } from "next";
import Alumni from "./alumni";

export const metadata: Metadata = {
  title: "Alumni",
  description: "robonexus",
};

export default function AlumniPage() {
  return <Alumni />;
}
