"use client";

import { useState, useEffect, useMemo } from "react";
import { Gig } from "@/lib/types";
import { fetchGigs } from "@/lib/api";
import GigCard from "@/components/gigs/GigCard";
import GigFilters from "@/components/gigs/GigFilters";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function MarketplacePage() {
  const { role, setRole } = useUser();
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
        setError("Unable to load gigs from server.");
        setGigs([]);
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search
    const timeout = setTimeout(loadGigs, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  // Client-side filtering when search/category change
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
            {role === "creator" ? (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 border border-[#59634A]/40 bg-[#EAEFE4] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#3D4733] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#59634A]" />
                CREATOR MARKETPLACE · ISSUE NO. 01
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 border border-[#FF5A36]/30 bg-[#FFF2EE] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#FF5A36] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                CLIENT DISCOVERY · ISSUE NO. 01
              </div>
            )}
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#171717] leading-[1.08] mb-6 uppercase">
              Good work,
              <br />
              looking for
              <br />
              the right person.
            </h1>
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mb-8">
              {role === "creator"
                ? "Turn your specialized talent into verified services. List what you offer, set your terms, and manage client bookings on the creator ledger."
                : "A peer-to-peer creator marketplace where clients discover verified creative, technical, and educational services directly from emerging talent."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {role === "creator" ? (
                <>
                  <Link
                    href="/gigs/new"
                    className="btn-olive px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>POST GIG</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn-outline px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <span>CREATOR DESK</span>
                    <span>→</span>
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="#marketplace-gigs"
                    className="btn-signal px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>BROWSE GIGS</span>
                    <span>↓</span>
                  </a>
                  <Link
                    href="/bookings"
                    className="btn-outline px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <span>MY BOOKINGS</span>
                    <span>→</span>
                  </Link>
                </>
              )}
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
          <div className="ledger-card-flat bg-[#FFFDF8] border-2 border-[#171717] p-10 sm:p-14 text-center max-w-lg mx-auto my-10 animate-fade-in shadow-xs">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F7F3EA] border border-[#D8CEBC] rounded-sm font-mono text-xl text-[#171717] mb-4">
              ✦
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] mb-3 tracking-tight uppercase">
              {search || selectedCategory ? "No matching gigs" : "NO GIGS YET."}
            </h3>
            <p className="text-sm sm:text-base text-[#57534E] mb-8 leading-relaxed max-w-md mx-auto">
              {search || selectedCategory
                ? "No services matched your filter criteria. Try a different search keyword or reset your filters."
                : "Be the first creator to put a skill on the marketplace."}
            </p>
            {search || selectedCategory ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                className="btn-ink px-6 py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm font-bold"
              >
                Reset Filters [✕]
              </button>
            ) : (
              <Link
                href="/gigs/new"
                onClick={() => setRole("creator")}
                className="btn-olive px-6 py-3 text-xs font-mono uppercase tracking-wider font-bold inline-flex items-center gap-2 rounded-sm shadow-xs"
              >
                <span>POST A GIG</span>
                <span>→</span>
              </Link>
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
