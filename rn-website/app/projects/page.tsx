import type { Metadata } from "next";
import Projects from "./projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "robonexus",
};

export default function ProjectsPage() {
  return <Projects />;
}
