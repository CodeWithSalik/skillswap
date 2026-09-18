"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Footer() {
  const { role } = useUser();

  return (
    <footer className="border-t border-[#D8CEBC] bg-[#F7F3EA] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 bg-[#171717] text-[#FFFDF8] flex items-center justify-center font-serif text-base font-bold">
                S
              </div>
              <span className="font-serif text-xl tracking-tight font-bold text-[#171717]">
                SKILLSWAP
              </span>
            </Link>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-xs">
              A creator gig marketplace for young talent.
            </p>
          </div>

          {/* Navigation Column (Role-Aware) */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#847F75] font-bold">
              {role === "creator" ? "WORKSPACE" : "DISCOVER"}
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link
                  href="/"
                  className="text-[#57534E] hover:text-[#171717] hover:underline transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              {role === "client" ? (
                <li>
                  <Link
                    href="/bookings"
                    className="text-[#57534E] hover:text-[#171717] hover:underline transition-colors"
                  >
                    My Bookings
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/gigs/new"
                      className="text-[#57534E] hover:text-[#171717] hover:underline transition-colors"
                    >
                      Post a Gig
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-[#57534E] hover:text-[#171717] hover:underline transition-colors"
                    >
                      Creator Desk
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Role Status Column */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#847F75] font-bold">
              ACTIVE MODE
            </h4>
            <div className="space-y-2 text-sm font-sans">
              {role === "client" ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/30 rounded-sm font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                  CLIENT
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-[#59634A]/15 text-[#3D4733] border border-[#59634A]/40 rounded-sm font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#59634A]" />
                  CREATOR
                </div>
              )}
              <p className="text-xs text-[#847F75] leading-relaxed">
                {role === "client"
                  ? "Discover skills, book creators, and track incoming deliverables."
                  : "List services, receive client requests, and manage bookings."}
              </p>
            </div>
          </div>

          {/* About Column */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#847F75] font-bold">
              ABOUT
            </h4>
            <div className="space-y-1.5 text-sm text-[#57534E] leading-relaxed">
              <p className="font-medium text-[#171717]">Creator Economy</p>
              <p className="text-xs text-[#847F75]">
                Built for the Code2Career AI Hackathon
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Ledger Divider Bar */}
        <div className="pt-8 border-t border-[#D8CEBC]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#847F75]">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span className="text-[#171717] font-semibold">SkillSwap — Creator Ledger</span>
            <span>·</span>
            <span>Track 2 · Web Development</span>
          </div>
          <p>© 2026 SkillSwap</p>
        </div>
      </div>
    </footer>
  );
}
