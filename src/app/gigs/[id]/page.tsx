"use client";

import { useState, useEffect, use } from "react";
import { Gig } from "@/lib/types";
import { fetchGig, createBooking } from "@/lib/api";
import { getCategoryLabel, getCategoryIcon } from "@/lib/constants";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

// Mock gig data for development
const MOCK_GIGS: Record<string, Gig> = {
  "1": {
    _id: "1",
    title: "Professional Logo & Brand Identity Design",
    category: "design",
    rate: 2500,
    description:
      "I will create a stunning, modern logo and complete brand identity package for your business. Includes logo, color palette, typography guide, and social media assets.\n\nWhat you get:\n• 3 initial logo concepts\n• Unlimited revisions on chosen concept\n• Full brand guidelines document\n• Social media kit (profile pics, banners)\n• All source files (AI, PSD, SVG, PNG)\n\nDelivery: 3-5 business days",
    creatorName: "Ananya",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  "2": {
    _id: "2",
    title: "YouTube Video Editing with Effects & Transitions",
    category: "editing",
    rate: 1500,
    description:
      "Professional video editing for YouTube content. I handle cuts, transitions, color grading, sound design, and thumbnail creation. Fast turnaround.",
    creatorName: "Rahul",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  "3": {
    _id: "3",
    title: "Python & DSA Tutoring for Beginners",
    category: "tutoring",
    rate: 800,
    description:
      "One-on-one tutoring sessions covering Python fundamentals, data structures, and algorithms. Perfect for interview prep or college coursework.",
    creatorName: "Priya",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  "4": {
    _id: "4",
    title: "Custom Background Music & Jingles",
    category: "music",
    rate: 3000,
    description:
      "Original background music, jingles, and sound effects for your videos, podcasts, or apps. Multiple genres. Commercial license included.",
    creatorName: "Dev",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  "5": {
    _id: "5",
    title: "SEO Blog Writing & Content Strategy",
    category: "writing",
    rate: 1200,
    description:
      "SEO-optimized blog posts and articles for your website. Includes keyword research, compelling headlines, and engaging content that ranks.",
    creatorName: "Sara",
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
  "6": {
    _id: "6",
    title: "Full-Stack Web App Development",
    category: "programming",
    rate: 5000,
    description:
      "Build responsive web applications using React, Next.js, and Node.js. Clean code, modern UI, and deployed to production.",
    creatorName: "Vikram",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  "7": {
    _id: "7",
    title: "Instagram Growth & Social Media Management",
    category: "marketing",
    rate: 2000,
    description:
      "Complete social media management including content calendar, post creation, hashtag strategy, and engagement optimization for Instagram.",
    creatorName: "Zara",
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
  },
  "8": {
    _id: "8",
    title: "UI/UX Design for Mobile Apps",
    category: "design",
    rate: 4000,
    description:
      "Beautiful, user-friendly mobile app designs in Figma. Includes wireframes, high-fidelity mockups, prototypes, and developer handoff.",
    creatorName: "Karan",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
};

export default function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { userName } = useUser();

  const [gig, setGig] = useState<Gig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadGig() {
      setIsLoading(true);
      try {
        const data = await fetchGig(id);
        setGig(data);
      } catch {
        // Fallback to mock
        const mockGig = MOCK_GIGS[id];
        if (mockGig) {
          setGig(mockGig);
        } else {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadGig();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig || !userName || !clientEmail.trim()) return;

    setIsBooking(true);
    setBookingError(null);

    try {
      await createBooking({
        gigId: gig._id,
        clientName: userName,
        clientEmail: clientEmail.trim(),
        message: message.trim() || undefined,
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Failed to book. Please try again."
      );
    } finally {
      setIsBooking(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-6 w-24 bg-[var(--color-bg-secondary)] rounded-full mb-4" />
          <div className="h-8 w-3/4 bg-[var(--color-bg-secondary)] rounded mb-4" />
          <div className="h-4 w-1/4 bg-[var(--color-bg-secondary)] rounded mb-6" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-2/3 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !gig) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Gig Not Found</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            This gig may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm hover:border-[var(--color-primary)] transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Booking confirmation
  if (bookingSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center animate-slide-up">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-[var(--color-text-secondary)] mb-2">
            Your booking for &ldquo;{gig.title}&rdquo; has been submitted.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Status: <span className="text-amber-400 font-medium">Pending</span>{" "}
            — {gig.creatorName} will review your request.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bookings"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              View My Bookings
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Browse More Gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Marketplace
      </Link>

      {/* Gig Detail Card */}
      <div className="glass-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span>{getCategoryIcon(gig.category)}</span>
            {getCategoryLabel(gig.category)}
          </span>
          <span className="text-2xl font-bold text-emerald-400">
            ₹{gig.rate.toLocaleString()}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">{gig.title}</h1>

        {/* Creator */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[var(--color-bg)]/50 border border-[var(--color-border-light)]">
          <span className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            {gig.creatorName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-medium">{gig.creatorName}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Posted{" "}
              {new Date(gig.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">About This Gig</h2>
          <div className="text-[var(--color-text-secondary)] whitespace-pre-line leading-relaxed">
            {gig.description}
          </div>
        </div>

        {/* Book Button / Form */}
        {!showBookingForm ? (
          <button
            id="book-gig-btn"
            onClick={() => {
              if (!userName) {
                alert("Please set your name in the header first.");
                return;
              }
              setShowBookingForm(true);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
          >
            Book This Gig — ₹{gig.rate.toLocaleString()}
          </button>
        ) : (
          <form
            onSubmit={handleBooking}
            className="border-t border-[var(--color-border)] pt-6 space-y-4 animate-slide-up"
          >
            <h3 className="text-lg font-semibold">Book This Gig</h3>

            {/* Client name (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="booking-email"
                className="block text-sm font-medium mb-1.5"
              >
                Your Email <span className="text-red-400">*</span>
              </label>
              <input
                id="booking-email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="booking-message"
                className="block text-sm font-medium mb-1.5"
              >
                Message to Creator{" "}
                <span className="text-[var(--color-text-muted)]">
                  (optional)
                </span>
              </label>
              <textarea
                id="booking-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the creator about your project or requirements..."
                rows={3}
              />
            </div>

            {/* Error */}
            {bookingError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {bookingError}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!clientEmail.trim() || isBooking}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
