import { Meteors } from "@/components/ui/meteors";

export default function Team() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <Meteors />
      <h1
        className="reveal-heading text-4xl font-bold"
        string="progress"
      >
        Team
      </h1>
    </main>
  );
}
