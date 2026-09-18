import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSwap — Creator Gig Marketplace",
  description:
    "A marketplace where young creators monetize their skills and clients book their services. Find designers, editors, tutors, musicians, and more.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-text-muted)]">
            <p>
              SkillSwap — Code2Career AI Hackathon 2026
            </p>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
