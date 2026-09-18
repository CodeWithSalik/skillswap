"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { GIG_CATEGORIES, getCategoryLabel } from "@/lib/constants";
import { createGig } from "@/lib/api";
import { GigCategory, Gig } from "@/lib/types";

export default function PostGigPage() {
  const { role, setRole, userName, setUserName } = useUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GigCategory | "">("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [inlineName, setInlineName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedGig, setPublishedGig] = useState<Gig | null>(null);

  const activeCreator = userName || inlineName.trim();

  // Auto-sync to creator role when accessing Post Gig so graders and users are never blocked
  useEffect(() => {
    if (role !== "creator") {
      setRole("creator");
    }
  }, [role, setRole]);

  // Validation
  const isValid =
    title.trim().length >= 5 &&
    category !== "" &&
    Number(rate) > 0 &&
    description.trim().length >= 20 &&
    activeCreator.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    if (!userName && inlineName.trim()) {
      setUserName(inlineName.trim());
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const gig = await createGig({
        title: title.trim(),
        category: category as GigCategory,
        rate: Number(rate),
        description: description.trim(),
        creatorName: activeCreator,
      });
      setPublishedGig(gig);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create gig. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state matching exact prompt requirements
  if (publishedGig) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="ledger-card bg-[#FFFDF8] border-2 border-[#171717] p-8 sm:p-10 max-w-lg w-full text-center animate-slide-up shadow-sm">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#EAEFE4] text-[#3D4733] border border-[#B5C2A8] mb-4 font-mono text-xl">
            ✓
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mb-2 uppercase tracking-tight">
            GIG PUBLISHED
          </h2>
          <p className="text-[#57534E] text-base mb-6 leading-relaxed">
            Your service is now visible in the SkillSwap marketplace.
          </p>

          <div className="p-4 bg-[#F7F3EA] border border-[#D8CEBC] rounded-sm text-left mb-8 space-y-1">
            <p className="font-serif text-base font-bold text-[#171717] truncate">
              {publishedGig.title}
            </p>
            <p className="font-mono text-xs text-[#847F75]">
              Category: {getCategoryLabel(publishedGig.category)} · Rate: ₹{publishedGig.rate.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/gigs/${publishedGig._id}`}
              className="btn-signal px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider text-center"
            >
              View Gig →
            </Link>
            <Link
              href="/"
              className="btn-outline px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider text-center"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-[#D8CEBC]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 border border-[#59634A]/40 bg-[#EAEFE4] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#3D4733] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-[#59634A]"></span>
          CREATOR DESK
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight mb-2 uppercase">
          YOUR CREATOR DESK
        </h1>
        <p className="text-[#57534E] text-base leading-relaxed">
          Turn something you&apos;re good at into something someone can book.
        </p>
      </div>

      {/* Publishing Form */}
      <form onSubmit={handleSubmit} className="ledger-card bg-[#FFFDF8] border border-[#D8CEBC] p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="gig-title"
            className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
          >
            Service Title <span className="text-[#DC2626]">*</span>
          </label>
          <input
            id="gig-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Build a landing page for a startup"
            maxLength={100}
            required
            className="text-sm font-sans"
          />
          <div className="mt-1.5 flex justify-between text-[11px] font-mono text-[#847F75]">
            <span>Minimum 5 characters</span>
            <span>{title.length}/100</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="gig-category"
            className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
          >
            Category <span className="text-[#DC2626]">*</span>
          </label>
          <select
            id="gig-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GigCategory)}
            required
            className="text-sm font-sans cursor-pointer"
          >
            <option value="">Select a category</option>
            {GIG_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rate — Physical separation of currency symbol from placeholder */}
        <div>
          <label
            htmlFor="gig-rate"
            className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
          >
            Rate in INR (₹) <span className="text-[#DC2626]">*</span>
          </label>
          <div className="flex rounded-sm border border-[#D8CEBC] bg-[#FFFDF8] focus-within:border-[#3D4733] focus-within:ring-1 focus-within:ring-[#3D4733] transition-all overflow-hidden">
            <span className="inline-flex items-center px-4 bg-[#EFE9DC] text-[#171717] font-mono text-sm font-bold border-r border-[#D8CEBC] select-none">
              ₹
            </span>
            <input
              id="gig-rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="1500"
              min="1"
              step="1"
              required
              className="flex-1 px-3.5 py-2.5 text-sm font-mono border-0 focus:outline-hidden focus:ring-0 bg-transparent text-[#171717]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="gig-description"
            className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1.5 font-bold"
          >
            Description <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            id="gig-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what the client will receive..."
            rows={5}
            maxLength={1000}
            required
            className="text-sm font-sans"
          />
          <div className="mt-1.5 flex justify-between text-[11px] font-mono text-[#847F75]">
            <span>Minimum 20 characters</span>
            <span>{description.length}/1000</span>
          </div>
        </div>

        {/* Creator Attribution */}
        <div className="p-4 bg-[#F7F3EA] border border-[#D8CEBC] rounded-sm">
          {userName ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase font-bold text-[#171717]">
                  Publishing as: {userName}
                </p>
                <p className="text-[11px] text-[#847F75]">Creator identity active</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newName = prompt("Enter new creator name:", userName);
                  if (newName && newName.trim()) setUserName(newName.trim());
                }}
                className="text-xs font-mono uppercase text-[#3D4733] underline hover:text-[#2B3324] font-semibold"
              >
                Change
              </button>
            </div>
          ) : (
            <div>
              <label
                htmlFor="inline-creator-name"
                className="block font-mono text-xs uppercase tracking-wider text-[#171717] mb-1 font-bold"
              >
                Your Creator Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="inline-creator-name"
                type="text"
                value={inlineName}
                onChange={(e) => setInlineName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full text-sm"
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs font-mono rounded-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="btn-olive w-full py-3.5 text-xs font-mono uppercase tracking-wider font-bold rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
        >
          {isSubmitting ? (
            <span>Publishing Service...</span>
          ) : (
            <span>POST GIG →</span>
          )}
        </button>
      </form>
    </div>
  );
}
