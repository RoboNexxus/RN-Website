import type { Metadata } from "next";
import About from "./about";

export const metadata: Metadata = {
  title: "About",
  description: "robonexus",
};

export default function AboutPage() {
  return <About />;
}
