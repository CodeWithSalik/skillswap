"use client";

import { GIG_CATEGORIES } from "@/lib/constants";

interface GigFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function GigFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: GigFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="search-gigs"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search gigs by title or description..."
          className="pl-10 pr-4"
        />
      </div>

      {/* Category Filter */}
      <div className="sm:w-52">
        <select
          id="filter-category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full cursor-pointer"
        >
          <option value="">All Categories</option>
          {GIG_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
