"use client";

import { useState, useEffect, useMemo } from "react";
import { Gig } from "@/lib/types";
import { fetchGigs } from "@/lib/api";
import GigCard from "@/components/gigs/GigCard";
import GigFilters from "@/components/gigs/GigFilters";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

// Mock data for development — remove when Salik's API is ready
const MOCK_GIGS: Gig[] = [
  {
    _id: "1",
    title: "Professional Logo & Brand Identity Design",
    category: "design",
    rate: 2500,
    description:
      "I will create a stunning, modern logo and complete brand identity package for your business. Includes logo, color palette, typography guide, and social media assets.",
    creatorName: "Ananya",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: "2",
    title: "YouTube Video Editing with Effects & Transitions",
    category: "editing",
    rate: 1500,
    description:
      "Professional video editing for YouTube content. I handle cuts, transitions, color grading, sound design, and thumbnail creation. Fast turnaround.",
    creatorName: "Rahul",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    _id: "3",
    title: "Python & DSA Tutoring for Beginners",
    category: "tutoring",
    rate: 800,
    description:
      "One-on-one tutoring sessions covering Python fundamentals, data structures, and algorithms. Perfect for interview prep or college coursework.",
    creatorName: "Priya",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    _id: "4",
    title: "Custom Background Music & Jingles",
    category: "music",
    rate: 3000,
    description:
      "Original background music, jingles, and sound effects for your videos, podcasts, or apps. Multiple genres. Commercial license included.",
    creatorName: "Dev",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: "5",
    title: "SEO Blog Writing & Content Strategy",
    category: "writing",
    rate: 1200,
    description:
      "SEO-optimized blog posts and articles for your website. Includes keyword research, compelling headlines, and engaging content that ranks.",
    creatorName: "Sara",
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
  {
    _id: "6",
    title: "Full-Stack Web App Development",
    category: "programming",
    rate: 5000,
    description:
      "Build responsive web applications using React, Next.js, and Node.js. Clean code, modern UI, and deployed to production.",
    creatorName: "Vikram",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    _id: "7",
    title: "Instagram Growth & Social Media Management",
    category: "marketing",
    rate: 2000,
    description:
      "Complete social media management including content calendar, post creation, hashtag strategy, and engagement optimization for Instagram.",
    creatorName: "Zara",
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
  },
  {
    _id: "8",
    title: "UI/UX Design for Mobile Apps",
    category: "design",
    rate: 4000,
    description:
      "Beautiful, user-friendly mobile app designs in Figma. Includes wireframes, high-fidelity mockups, prototypes, and developer handoff.",
    creatorName: "Karan",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

export default function MarketplacePage() {
  const { role } = useUser();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gigs on mount and when filters change
  useEffect(() => {
    async function loadGigs() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchGigs({
          search: search || undefined,
          category: selectedCategory || undefined,
        });
        setGigs(data);
      } catch {
        // Fallback to mock data if API isn't ready
        console.warn("API not available, using mock data");
        setGigs(MOCK_GIGS);
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search
    const timeout = setTimeout(loadGigs, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  // Client-side filtering on mock data (when API handles it, this is redundant but harmless)
  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      const matchesSearch =
        !search ||
        gig.title.toLowerCase().includes(search.toLowerCase()) ||
        gig.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory || gig.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [gigs, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#171717]">
      {/* Editorial Hero Section */}
      <section className="border-b border-[#D8CEBC] bg-[#FFFDF8] py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 border border-[#D8CEBC] bg-[#F7F3EA] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#57534E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]"></span>
              MARKETPLACE LEDGER · ISSUE NO. 01
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#171717] leading-[1.08] mb-6 uppercase">
              Good work,
              <br />
              looking for
              <br />
              the right person.
            </h1>
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mb-8">
              A peer-to-peer creator marketplace where emerging talent monetize their skills
              and clients discover and book verified services directly.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {role === "creator" ? (
                <Link
                  href="/gigs/new"
                  className="btn-signal px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <span>Post a Gig</span>
                  <span>→</span>
                </Link>
              ) : (
                <Link
                  href="/bookings"
                  className="btn-ink px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <span>Track My Bookings</span>
                  <span>→</span>
                </Link>
              )}
              <a
                href="#marketplace-gigs"
                className="btn-outline px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>Browse Ledger</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Catalog Section */}
      <section id="marketplace-gigs" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Filter Toolbar */}
        <div className="mb-10 pb-6 border-b border-[#D8CEBC]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                LATEST GIGS
              </h2>
              <p className="font-mono text-xs text-[#847F75] mt-1">
                {!isLoading && (
                  <>
                    <span className="font-semibold text-[#171717]">{filteredGigs.length}</span>{" "}
                    gig{filteredGigs.length !== 1 ? "s" : ""} available ·{" "}
                  </>
                )}
                <span className="text-[#57534E]">Sorted by Newest first</span>
              </p>
            </div>
            {(search || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                className="font-mono text-xs uppercase tracking-wider text-[#FF5A36] hover:underline self-start sm:self-auto"
              >
                Reset Filters [✕]
              </button>
            )}
          </div>

          <GigFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Loading State: Paper Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="ledger-card p-6 bg-[#FFFDF8] border border-[#D8CEBC] animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#D8CEBC]/50">
                  <div className="h-3 w-16 bg-[#EBE5D8] rounded-sm" />
                  <div className="h-4 w-12 bg-[#EBE5D8] rounded-sm" />
                </div>
                <div className="h-5 w-4/5 bg-[#EBE5D8] rounded-sm" />
                <div className="space-y-2 py-2">
                  <div className="h-3 w-full bg-[#EBE5D8] rounded-sm" />
                  <div className="h-3 w-5/6 bg-[#EBE5D8] rounded-sm" />
                  <div className="h-3 w-2/3 bg-[#EBE5D8] rounded-sm" />
                </div>
                <div className="pt-4 border-t border-[#D8CEBC]/70 flex justify-between">
                  <div className="h-3 w-20 bg-[#EBE5D8] rounded-sm" />
                  <div className="h-3 w-14 bg-[#EBE5D8] rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="ledger-card-flat bg-[#FFFDF8] border border-[#DC2626]/30 p-8 text-center max-w-md mx-auto my-12">
            <p className="font-serif text-lg font-bold text-[#991B1B] mb-2">
              Couldn&apos;t load these gigs.
            </p>
            <p className="text-sm text-[#57534E] mb-4">
              Please check your connection or server status and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-outline px-4 py-2 text-xs font-mono uppercase tracking-wider"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredGigs.length === 0 && (
          <div className="ledger-card-flat bg-[#FFFDF8] border border-[#D8CEBC] p-12 text-center max-w-lg mx-auto my-8 animate-fade-in">
            <div className="font-mono text-2xl text-[#847F75] mb-3">⌕</div>
            <h3 className="font-serif text-xl font-bold text-[#171717] mb-2">
              No gigs found.
            </h3>
            <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
              {search || selectedCategory
                ? "Try another search or clear your filters to explore available creator listings."
                : "No gigs have been published to the ledger yet. Switch to Creator mode to be the first!"}
            </p>
            {search || selectedCategory ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                className="btn-ink px-5 py-2.5 text-xs font-mono uppercase tracking-wider"
              >
                Clear Filters
              </button>
            ) : (
              role === "creator" && (
                <Link
                  href="/gigs/new"
                  className="btn-signal px-5 py-2.5 text-xs font-mono uppercase tracking-wider inline-block"
                >
                  Post the First Gig →
                </Link>
              )
            )}
          </div>
        )}

        {/* Gig Grid */}
        {!isLoading && !error && filteredGigs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredGigs.map((gig) => (
              <div key={gig._id}>
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
