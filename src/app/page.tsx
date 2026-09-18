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
  const { role, userName } = useUser();
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Find & Book
            <span className="gradient-text"> Creative Talent</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            A marketplace where young creators monetize their skills and
            clients book the services they need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {role === "creator" ? (
              <Link
                href="/gigs/new"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
              >
                Post Your Gig
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Link>
            ) : (
              !userName && (
                <p className="text-sm text-[var(--color-text-muted)]">
                  Set your name in the header to start booking gigs
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Browse Gigs
            </h2>
            {!isLoading && (
              <span className="text-sm text-[var(--color-text-muted)]">
                {filteredGigs.length} gig{filteredGigs.length !== 1 ? "s" : ""}{" "}
                found
              </span>
            )}
          </div>
          <GigFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass-card p-5 animate-pulse"
              >
                <div className="flex justify-between mb-3">
                  <div className="h-6 w-20 bg-[var(--color-bg-secondary)] rounded-full" />
                  <div className="h-6 w-14 bg-[var(--color-bg-secondary)] rounded" />
                </div>
                <div className="h-5 w-3/4 bg-[var(--color-bg-secondary)] rounded mb-2" />
                <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded mb-1" />
                <div className="h-4 w-2/3 bg-[var(--color-bg-secondary)] rounded mb-4" />
                <div className="pt-3 border-t border-[var(--color-border-light)]">
                  <div className="h-7 w-24 bg-[var(--color-bg-secondary)] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredGigs.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No gigs found</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              {search || selectedCategory
                ? "Try adjusting your search or filters"
                : "No gigs have been posted yet. Be the first!"}
            </p>
            {(search || selectedCategory) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm hover:border-[var(--color-primary)] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Gig Grid */}
        {!isLoading && !error && filteredGigs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {filteredGigs.map((gig, index) => (
              <div
                key={gig._id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
