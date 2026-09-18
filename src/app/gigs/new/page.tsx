"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { GIG_CATEGORIES } from "@/lib/constants";
import { createGig } from "@/lib/api";
import { GigCategory } from "@/lib/types";

export default function PostGigPage() {
  const router = useRouter();
  const { role, userName } = useUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GigCategory | "">("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validation
  const isValid =
    title.trim().length >= 5 &&
    category !== "" &&
    Number(rate) > 0 &&
    description.trim().length >= 20 &&
    userName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createGig({
        title: title.trim(),
        category: category as GigCategory,
        rate: Number(rate),
        description: description.trim(),
        creatorName: userName,
      });
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create gig. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center animate-slide-up">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Gig Posted!</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Your gig &ldquo;{title}&rdquo; is now live on the marketplace.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Redirecting to marketplace...
          </p>
        </div>
      </div>
    );
  }

  // Role guard
  if (role !== "creator") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔄</div>
          <h2 className="text-xl font-bold mb-2">Switch to Creator Mode</h2>
          <p className="text-[var(--color-text-secondary)]">
            You need to be in Creator mode to post a gig. Use the toggle in
            the header to switch.
          </p>
        </div>
      </div>
    );
  }

  // Name guard
  if (!userName) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✏️</div>
          <h2 className="text-xl font-bold mb-2">Set Your Name First</h2>
          <p className="text-[var(--color-text-secondary)]">
            Click &ldquo;Set Name&rdquo; in the header to set your display name before
            posting a gig.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a New Gig</h1>
        <p className="text-[var(--color-text-secondary)]">
          List your service on the marketplace. Clients will be able to find
          and book you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="gig-title"
            className="block text-sm font-medium mb-1.5"
          >
            Gig Title <span className="text-red-400">*</span>
          </label>
          <input
            id="gig-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Professional Logo Design"
            maxLength={100}
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {title.length}/100 characters (min 5)
          </p>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="gig-category"
            className="block text-sm font-medium mb-1.5"
          >
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="gig-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GigCategory)}
          >
            <option value="">Select a category</option>
            {GIG_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rate */}
        <div>
          <label
            htmlFor="gig-rate"
            className="block text-sm font-medium mb-1.5"
          >
            Rate (₹) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              ₹
            </span>
            <input
              id="gig-rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="1000"
              min="1"
              step="1"
              className="pl-8"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="gig-description"
            className="block text-sm font-medium mb-1.5"
          >
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="gig-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your service in detail. What do you offer? What's included? What should the client expect?"
            rows={5}
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {description.length}/1000 characters (min 20)
          </p>
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg)]/50 border border-[var(--color-border-light)]">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            {userName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Posting as creator
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Posting...
            </span>
          ) : (
            "Post Gig"
          )}
        </button>
      </form>
    </div>
  );
}
