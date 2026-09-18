import Link from "next/link";
import { Gig } from "@/lib/types";
import { getCategoryLabel, getCategoryIcon } from "@/lib/constants";

interface GigCardProps {
  gig: Gig;
}

export default function GigCard({ gig }: GigCardProps) {
  return (
    <Link href={`/gigs/${gig._id}`} className="block group">
      <article className="glass-card p-5 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span>{getCategoryIcon(gig.category)}</span>
            {getCategoryLabel(gig.category)}
          </span>
          <span className="text-lg font-bold text-emerald-400">
            ₹{gig.rate.toLocaleString()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {gig.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3 flex-1">
          {gig.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {gig.creatorName.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {gig.creatorName}
            </span>
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">
            {new Date(gig.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </article>
    </Link>
  );
}
