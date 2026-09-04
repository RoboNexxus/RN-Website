import type { Metadata } from "next";
import Team from "./team";

export const metadata: Metadata = {
  title: "Team",
  description: "robonexus",
};

export default function TeamPage() {
  return <Team />;
}
