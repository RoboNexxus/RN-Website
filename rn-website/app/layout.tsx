import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import BackToTop from "@/components/back-to-top";
import { ToastProvider } from "@/components/ui/toast";
import { Meteors } from "@/components/ui/meteors";
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
  metadataBase: new URL("https://robonexus.in"),
  title: {
    default: "Robo Nexus",
    template: "%s | Robo Nexus",
  },
  description:
    "Robo Nexus — the official robotics club of Amity International School, Sector-46, Gurugram. Exploring robotics, automation, and emerging technologies.",
  keywords: ["robotics", "Robo Nexus", "Amity", "Gurugram", "automation", "STEM"],
  openGraph: {
    title: "Robo Nexus",
    description: "The official robotics club of Amity International School, Sector-46, Gurugram.",
    url: "https://robonexus.in",
    siteName: "Robo Nexus",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/hh4pb5zrmventaz8mkfl?_a=BAMAPqfk0",
        width: 512,
        height: 512,
        alt: "Robo Nexus Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robo Nexus",
    description: "The official robotics club of Amity International School, Sector-46, Gurugram.",
    images: ["https://res.cloudinary.com/drqqqhudz/image/upload/f_auto,q_auto/v1/rn-website/hh4pb5zrmventaz8mkfl?_a=BAMAPqfk0"],
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
        {/* Dims the body background image */}
        <div className="fixed inset-0 bg-[#0d0d0d]/85 pointer-events-none" style={{ zIndex: 0 }} />
        {/* All page content sits above the overlay */}
        <div className="min-h-full flex flex-col relative" style={{ zIndex: 1 }}>
          <ToastProvider>
            <Meteors />
            <SpotlightNavbar />
            {children}
            <BackToTop />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
