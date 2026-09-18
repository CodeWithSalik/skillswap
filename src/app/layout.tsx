import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { UserProvider } from "@/context/UserContext";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillSwap — Creator Gig Marketplace",
  description:
    "A creator gig marketplace where young creators monetize their skills and clients book verified services. Design, editing, tutoring, music, and more.",
  keywords: [
    "gig marketplace",
    "creator economy",
    "freelance",
    "skills",
    "booking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F3EA] text-[#171717] selection:bg-[#FF5A36] selection:text-white">
        <UserProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#D8CEBC] py-8 bg-[#F7F3EA] text-center text-xs tracking-wider text-[#171717]/60">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#171717]/70">
                SKILLSWAP · CREATOR LEDGER · HACKATHON ID: AZIS-MYZ39U
              </p>
              <p className="text-[#171717]/50 font-sans text-xs">
                Code2Career AI Hackathon 2026 · Track 2: Real-World AI Products
              </p>
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
