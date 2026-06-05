
import SocialFlipButton from "@/components/ui/social-flip-button"
import { Meteors } from "@/components/ui/meteors";

export default function Contact() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <Meteors />
      <h1 className="text-4xl font-bold">Contact</h1>
          <SocialFlipButton />
    </main>
  );
}
