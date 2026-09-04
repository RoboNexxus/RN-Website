import type { Metadata } from "next";
import Contact from "./contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "robonexus",
};

export default function ContactPage() {
  return <Contact />;
}
