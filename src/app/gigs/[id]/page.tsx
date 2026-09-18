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
  const { userName, setUserName } = useUser();

  const [gig, setGig] = useState<Gig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [clientName, setClientName] = useState("");
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
    const activeClientName = userName || clientName.trim();
    if (!gig || !activeClientName || !clientEmail.trim()) {
      if (!activeClientName) {
        setBookingError("Please enter your name.");
      }
      return;
    }

    if (!userName && clientName.trim()) {
      setUserName(clientName.trim());
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      await createBooking({
        gigId: gig._id,
        clientName: activeClientName,
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="ledger-card p-8 bg-[#FFFDF8] border border-[#D8CEBC] animate-pulse space-y-4">
          <div className="h-4 w-28 bg-[#EBE5D8] rounded-sm" />
          <div className="h-8 w-3/4 bg-[#EBE5D8] rounded-sm" />
          <div className="h-4 w-1/3 bg-[#EBE5D8] rounded-sm pb-4 border-b border-[#D8CEBC]/50" />
          <div className="space-y-2 py-4">
            <div className="h-3 w-full bg-[#EBE5D8] rounded-sm" />
            <div className="h-3 w-full bg-[#EBE5D8] rounded-sm" />
            <div className="h-3 w-4/5 bg-[#EBE5D8] rounded-sm" />
          </div>
          <div className="h-12 w-full bg-[#EBE5D8] rounded-sm" />
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !gig) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="ledger-card-flat bg-[#FFFDF8] border border-[#D8CEBC] p-8 max-w-md w-full text-center">
          <div className="font-mono text-2xl text-[#847F75] mb-2">⌕</div>
          <h2 className="font-serif text-2xl font-bold text-[#171717] mb-2">Gig Not Found</h2>
          <p className="text-sm text-[#57534E] mb-6">
            This service listing could not be found or has been removed.
          </p>
          <Link
            href="/"
            className="btn-outline inline-block px-5 py-2.5 text-xs font-mono uppercase tracking-wider"
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
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="ledger-card bg-[#FFFDF8] border-2 border-[#171717] p-8 sm:p-10 max-w-lg w-full text-center animate-slide-up shadow-sm">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] mb-4 font-mono text-xl">
            ✓
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mb-2 uppercase tracking-tight">
            REQUEST SENT
          </h2>
          <p className="text-[#57534E] text-base mb-6 leading-relaxed">
            Your request is now waiting for the creator&apos;s response.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-mono text-xs font-bold uppercase tracking-wider mb-8">
            <span className="h-2 w-2 rounded-full bg-[#B45309] animate-pulse"></span>
            STATUS: PENDING
          </div>

          <div className="pt-6 border-t border-[#D8CEBC] flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bookings"
              className="btn-signal px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider text-center"
            >
              View My Bookings →
            </Link>
            <Link
              href="/"
              className="btn-outline px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider text-center"
            >
              Browse More Gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#57534E] hover:text-[#171717] transition-colors mb-8"
      >
        <span>←</span> Back to Marketplace
      </Link>

      {/* Gig Detail Card */}
      <div className="ledger-card bg-[#FFFDF8] border border-[#D8CEBC] p-6 sm:p-10">
        {/* Top Ledger Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 mb-6 border-b border-[#D8CEBC]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#57534E] font-bold flex items-center gap-1.5">
            <span>{getCategoryIcon(gig.category)}</span>
            <span>{getCategoryLabel(gig.category)}</span>
          </span>
          <div className="text-right">
            <span className="text-xs font-mono uppercase text-[#847F75] mr-2">Rate:</span>
            <span className="font-mono text-3xl font-bold text-[#171717]">
              ₹{gig.rate.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] mb-6 leading-tight">
          {gig.title}
        </h1>

        {/* Creator Info Ledger Row */}
        <div className="flex items-center justify-between p-4 mb-8 bg-[#F7F3EA] border border-[#D8CEBC] rounded-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#171717] text-[#FFFDF8] flex items-center justify-center font-serif text-sm font-bold">
              {gig.creatorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-mono text-xs uppercase font-bold text-[#171717]">
                {gig.creatorName}
              </p>
              <p className="text-xs text-[#847F75]">
                Creator · {getCategoryLabel(gig.category)}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-[#847F75]">
            Listed {new Date(gig.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Description Section */}
        <div className="mb-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#847F75] font-bold mb-3">
            ABOUT THIS SERVICE
          </h2>
          <div className="text-[#171717] whitespace-pre-line leading-relaxed text-base font-sans">
            {gig.description}
          </div>
        </div>

        {/* Primary CTA / Booking Form */}
        {!showBookingForm ? (
          <div className="pt-6 border-t border-[#D8CEBC]">
            <button
              id="book-gig-btn"
              type="button"
              onClick={() => setShowBookingForm(true)}
              className="btn-signal w-full py-3.5 text-center font-mono text-sm uppercase tracking-wider rounded-sm font-bold flex items-center justify-center gap-2"
            >
              <span>BOOK THIS GIG</span>
              <span>— ₹{gig.rate.toLocaleString("en-IN")}</span>
              <span>→</span>
            </button>
          </div>
        ) : (
          <div className="border-t-2 border-[#171717] pt-8 mt-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D8CEBC]">
              <h3 className="font-serif text-2xl font-bold text-[#171717] tracking-tight">
                REQUEST THIS SERVICE
              </h3>
              <span className="font-mono text-xs uppercase tracking-wider text-[#847F75]">
                LEDGER FORM
              </span>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              {/* Client Name Field */}
              <div>
                <label
                  htmlFor="booking-client-name"
                  className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
                >
                  Name <span className="text-[#DC2626]">*</span>
                </label>
                {userName ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#F7F3EA] border border-[#D8CEBC] rounded-sm">
                    <span className="font-mono text-sm text-[#171717]">{userName}</span>
                    <span className="font-mono text-[10px] uppercase text-[#847F75]">Active Client</span>
                  </div>
                ) : (
                  <input
                    id="booking-client-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full text-sm"
                  />
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="booking-email"
                  className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
                >
                  Email <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full text-sm"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="booking-message"
                  className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
                >
                  Message <span className="text-[#847F75] font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="booking-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your requirements, project scope, or timeline..."
                  rows={3}
                  className="w-full text-sm"
                />
              </div>

              {/* Inline Error State */}
              {bookingError && (
                <div className="p-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs font-mono rounded-sm">
                  <p className="font-bold mb-1">Notice:</p>
                  <p>{bookingError}</p>
                  {bookingError.includes("declined") && (
                    <div className="mt-3 pt-2 border-t border-[#FCA5A5]/60">
                      <Link
                        href="/"
                        className="btn-outline inline-block px-3 py-1 text-[11px] font-mono uppercase tracking-wider"
                      >
                        Browse Other Gigs →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="btn-outline flex-1 py-3 text-xs font-mono uppercase tracking-wider text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    (!userName && !clientName.trim()) ||
                    !clientEmail.trim() ||
                    isBooking
                  }
                  className="btn-signal flex-1 py-3 text-xs font-mono uppercase tracking-wider font-bold text-center disabled:opacity-50"
                >
                  {isBooking ? "Submitting Request..." : "Confirm Booking Request"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
