"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { role, setRole, userName, setUserName } = useUser();
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSetName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setShowNameInput(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8CEBC] bg-[#F7F3EA]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 bg-[#171717] text-[#FFFDF8] flex items-center justify-center font-serif text-lg font-bold transition-transform group-hover:scale-105">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-tight font-bold text-[#171717] leading-none">
                  SKILLSWAP
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#847F75] leading-tight mt-0.5">
                  CREATOR LEDGER
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 border-l border-[#D8CEBC] pl-6 h-7">
              <Link
                href="/"
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive("/")
                    ? "text-[#FF5A36] font-semibold"
                    : "text-[#171717]/70 hover:text-[#171717]"
                }`}
              >
                Marketplace
              </Link>
              {role === "creator" && (
                <>
                  <Link
                    href="/gigs/new"
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive("/gigs/new")
                        ? "text-[#FF5A36] font-semibold"
                        : "text-[#171717]/70 hover:text-[#171717]"
                    }`}
                  >
                    Post a Gig
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive("/dashboard")
                        ? "text-[#FF5A36] font-semibold"
                        : "text-[#171717]/70 hover:text-[#171717]"
                    }`}
                  >
                    Creator Desk
                  </Link>
                </>
              )}
              {role === "client" && (
                <Link
                  href="/bookings"
                  className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive("/bookings")
                      ? "text-[#FF5A36] font-semibold"
                      : "text-[#171717]/70 hover:text-[#171717]"
                  }`}
                >
                  My Bookings
                </Link>
              )}
            </nav>
          </div>

          {/* Right side: Demo Identity (Role Switcher + Display Name) */}
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center bg-[#EFE9DC] p-1 border border-[#D8CEBC] rounded-sm">
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-[#847F75] px-2">
                YOU ARE:
              </span>
              <button
                id="role-client-btn"
                type="button"
                onClick={() => setRole("client")}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all rounded-sm ${
                  role === "client"
                    ? "bg-[#171717] text-[#FFFDF8] font-bold shadow-xs"
                    : "text-[#171717]/60 hover:text-[#171717]"
                }`}
              >
                Client
              </button>
              <button
                id="role-creator-btn"
                type="button"
                onClick={() => setRole("creator")}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all rounded-sm ${
                  role === "creator"
                    ? "bg-[#FF5A36] text-white font-bold shadow-xs"
                    : "text-[#171717]/60 hover:text-[#171717]"
                }`}
              >
                Creator
              </button>
            </div>

            {/* User Name Badge */}
            {userName ? (
              <button
                type="button"
                onClick={() => {
                  setNameInput(userName);
                  setShowNameInput(true);
                }}
                title="Click to change display name"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-[#D8CEBC] bg-[#FFFDF8] text-[#171717] hover:border-[#171717] transition-colors rounded-sm"
              >
                <span className="text-[#847F75]">Name:</span>
                <span className="font-semibold text-[#171717] underline decoration-dotted decoration-[#D8CEBC] underline-offset-2">
                  {userName}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowNameInput(true)}
                className="hidden sm:flex items-center px-3 py-1 text-xs font-mono uppercase tracking-wider border border-[#FF5A36] text-[#FF5A36] bg-[#FFF2EE] hover:bg-[#FF5A36] hover:text-white transition-colors rounded-sm"
              >
                Set Name
              </button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#171717] hover:bg-[#EFE9DC] border border-[#D8CEBC] rounded-sm"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#D8CEBC] bg-[#F7F3EA] animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-mono uppercase tracking-wider ${
                  isActive("/") ? "bg-[#EFE9DC] text-[#FF5A36] font-bold" : "text-[#171717]"
                }`}
              >
                Marketplace
              </Link>
              {role === "creator" && (
                <>
                  <Link
                    href="/gigs/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-mono uppercase tracking-wider ${
                      isActive("/gigs/new") ? "bg-[#EFE9DC] text-[#FF5A36] font-bold" : "text-[#171717]"
                    }`}
                  >
                    Post a Gig
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-mono uppercase tracking-wider ${
                      isActive("/dashboard") ? "bg-[#EFE9DC] text-[#FF5A36] font-bold" : "text-[#171717]"
                    }`}
                  >
                    Creator Desk
                  </Link>
                </>
              )}
              {role === "client" && (
                <Link
                  href="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-mono uppercase tracking-wider ${
                    isActive("/bookings") ? "bg-[#EFE9DC] text-[#FF5A36] font-bold" : "text-[#171717]"
                  }`}
                >
                  My Bookings
                </Link>
              )}
              <div className="pt-2 border-t border-[#D8CEBC] px-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNameInput(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-mono uppercase text-[#FF5A36] underline"
                >
                  {userName ? `Display Name: ${userName} (Edit)` : "Set Display Name"}
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Demo Identity Name Modal */}
      {showNameInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="ledger-card-flat bg-[#FFFDF8] p-6 w-full max-w-sm border-2 border-[#171717] shadow-xl animate-slide-up">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8CEBC]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#171717] font-bold">
                DEMO IDENTITY
              </h3>
              <button
                type="button"
                onClick={() => setShowNameInput(false)}
                className="text-[#847F75] hover:text-[#171717] text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[#57534E] mb-4 leading-relaxed">
              Enter a display name to test booking or posting gigs. No password or account is required.
            </p>
            <div className="mb-4">
              <label htmlFor="modal-name-input" className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                Display Name
              </label>
              <input
                id="modal-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                placeholder="e.g., Salik or Alex"
                className="w-full text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNameInput(false)}
                className="flex-1 py-2 text-xs font-mono uppercase tracking-wider border border-[#D8CEBC] hover:bg-[#EFE9DC] text-[#171717] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetName}
                disabled={!nameInput.trim()}
                className="flex-1 py-2 text-xs font-mono uppercase tracking-wider bg-[#FF5A36] text-white font-semibold hover:bg-[#E64B29] disabled:opacity-50 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
