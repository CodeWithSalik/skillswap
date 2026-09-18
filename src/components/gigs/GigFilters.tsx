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
    <div className="space-y-4">
      {/* Search Bar + Dropdown Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847F75] pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="search-gigs"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search skills, services..."
            className="pl-10 pr-4 py-2.5 bg-[#FFFDF8] border border-[#D8CEBC] text-sm text-[#171717] focus:border-[#FF5A36] rounded-sm w-full font-sans"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#847F75] hover:text-[#171717]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="md:w-60">
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
            className="w-full bg-[#FFFDF8] border border-[#D8CEBC] py-2.5 px-3 text-sm text-[#171717] rounded-sm cursor-pointer font-sans"
          >
            <option value="">All Categories</option>
            {GIG_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#847F75] pr-1 flex-shrink-0">
          FILTER:
        </span>
        <button
          type="button"
          onClick={() => onCategoryChange("")}
          className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex-shrink-0 ${
            selectedCategory === ""
              ? "bg-[#171717] text-[#FFFDF8] font-bold"
              : "bg-[#FFFDF8] border border-[#D8CEBC] text-[#57534E] hover:border-[#171717]"
          }`}
        >
          All
        </button>
        {GIG_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex-shrink-0 ${
              selectedCategory === cat.value
                ? "bg-[#171717] text-[#FFFDF8] font-bold"
                : "bg-[#FFFDF8] border border-[#D8CEBC] text-[#57534E] hover:border-[#171717]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
