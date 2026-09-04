import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import BackToTop from "@/components/back-to-top";
import { ToastProvider } from "@/components/ui/toast";
import { Meteors } from "@/components/ui/meteors";
import { IntroOverlay } from "@/components/ui/intro-overlay";
import { PageTransition } from "@/components/ui/page-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://robonexus46.vercel.app"),
  title: {
    default: "Robo Nexus",
    template: "%s | Robo Nexus",
  },
  description: "robonexus",
  keywords: ["robotics", "Robo Nexus", "Amity", "Gurugram", "automation", "STEM"],
  openGraph: {
    title: "Robo Nexus",
    description: "robonexus",
    url: "https://robonexus46.vercel.app",
    siteName: "Robo Nexus",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1788543011/rn-website/og-preview.png",
        width: 2880,
        height: 1570,
        alt: "Robo Nexus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robo Nexus",
    description: "robonexus",
    images: ["https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1788543011/rn-website/og-preview.png"],
  },
  icons: {
    icon: "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/edk0lpjus0anrenospj7?_a=BAMAPqfk0",
    apple: "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/fyuy9lmpsoot6pkxkgn0?_a=BAMAPqfk0",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full text-white">
        {/* Cinematic intro: black screen + camera pull-back. Renders above everything. */}
        <IntroOverlay />

        {/* Dims the body background image */}
        <div className="fixed inset-0 bg-[#0d0d0d]/85 pointer-events-none" style={{ zIndex: 0 }} />

        {/* All page content — id used by IntroOverlay to drive the camera pull-back */}
        <div id="rn-content" className="min-h-full flex flex-col relative" style={{ zIndex: 1 }}>
          <ToastProvider>
            <Meteors />
            <SpotlightNavbar />
            <PageTransition>
              {children}
            </PageTransition>
            <BackToTop />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
