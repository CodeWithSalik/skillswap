import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  title: "SkillSwap — Creator Ledger",
  description:
    "A creator gig marketplace where young creators monetize their skills and clients book verified services. Design, editing, tutoring, music, and more.",
  keywords: [
    "gig marketplace",
    "creator economy",
    "freelance",
    "skills",
    "booking",
    "creator ledger",
  ],
  openGraph: {
    title: "SkillSwap — Creator Ledger",
    description:
      "A creator gig marketplace where young creators monetize their skills and clients book verified services.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
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
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F7F3EA] text-[#171717] selection:bg-[#FF5A36] selection:text-white"
      >
        <UserProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
