import { Meteors } from "@/components/ui/meteors";

export default function About() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <Meteors />
      {/*
        string="progress"  → StringProgress tracks this element's scroll position
                             and exposes --progress (0 → 1) as a CSS variable.
        The .reveal-heading CSS class uses --progress to drive opacity + translateY.
      */}
      <h1
        className="reveal-heading text-4xl font-bold"
        string="progress"
      >
        About
      </h1>
    </main>
  );
}
