import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import BackToTop from "@/components/back-to-top";
import { ToastProvider } from "@/components/ui/toast";
import { Meteors } from "@/components/ui/meteors";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col grid-bg">
      <ToastProvider>
        <Meteors />
        <SpotlightNavbar />
        {children}
        <BackToTop />
      </ToastProvider>
    </div>
  );
}
