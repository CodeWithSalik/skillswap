"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function Header() {
  const { role, setRole, userName, setUserName } = useUser();
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSetName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setShowNameInput(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-bold text-lg transition-transform group-hover:scale-110">
              S
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">
              SkillSwap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Marketplace
            </Link>
            {role === "creator" && (
              <>
                <Link
                  href="/gigs/new"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  Post a Gig
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
            {role === "client" && (
              <Link
                href="/bookings"
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Right side: Role Switcher + User Name */}
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center rounded-lg bg-[var(--color-bg-secondary)] p-0.5 border border-[var(--color-border)]">
              <button
                id="role-client-btn"
                onClick={() => setRole("client")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  role === "client"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Client
              </button>
              <button
                id="role-creator-btn"
                onClick={() => setRole("creator")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  role === "creator"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Creator
              </button>
            </div>

            {/* User Name */}
            {userName ? (
              <button
                onClick={() => {
                  setNameInput(userName);
                  setShowNameInput(true);
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
              >
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
                {userName}
              </button>
            ) : (
              <button
                onClick={() => setShowNameInput(true)}
                className="hidden sm:flex px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                Set Name
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-[var(--color-border)] animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
              >
                Marketplace
              </Link>
              {role === "creator" && (
                <>
                  <Link
                    href="/gigs/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                  >
                    Post a Gig
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              {role === "client" && (
                <Link
                  href="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                >
                  My Bookings
                </Link>
              )}
              {!userName && (
                <button
                  onClick={() => {
                    setShowNameInput(true);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-left text-indigo-400 hover:bg-[var(--color-bg-secondary)]"
                >
                  Set Your Name
                </button>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-6 w-full max-w-sm mx-4 animate-slide-up">
            <h3 className="text-lg font-semibold mb-1">
              {userName ? "Update Your Name" : "Welcome to SkillSwap!"}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Enter a display name to get started. No account needed.
            </p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetName()}
              placeholder="Your name (e.g., Alex)"
              className="mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNameInput(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSetName}
                disabled={!nameInput.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
