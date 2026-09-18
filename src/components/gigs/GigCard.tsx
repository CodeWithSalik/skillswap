import Link from "next/link";
import { Gig } from "@/lib/types";
import { getCategoryLabel, getCategoryIcon } from "@/lib/constants";

interface GigCardProps {
  gig: Gig;
}

export default function GigCard({ gig }: GigCardProps) {
  const formattedDate = new Date(gig.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link href={`/gigs/${gig._id}`} className="block group h-full">
      <article className="ledger-card p-6 h-full flex flex-col bg-[#FFFDF8] border border-[#D8CEBC] hover:border-[#171717] hover:shadow-xs transition-all">
        {/* Top Header: Category + Rate */}
        <div className="flex items-baseline justify-between gap-2 mb-3 pb-2 border-b border-[#D8CEBC]/50">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#57534E] font-semibold flex items-center gap-1">
            <span>{getCategoryIcon(gig.category)}</span>
            <span>{getCategoryLabel(gig.category)}</span>
          </span>
          <span className="font-mono text-base font-bold text-[#171717]">
            ₹{gig.rate.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-[#171717] mb-2.5 line-clamp-2 group-hover:text-[#FF5A36] transition-colors leading-snug">
          {gig.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#57534E] mb-6 line-clamp-3 flex-1 leading-relaxed">
          {gig.description}
        </p>

        {/* Editorial Footer */}
        <div className="flex items-end justify-between pt-4 border-t border-[#D8CEBC]/70 mt-auto">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase font-bold text-[#171717] tracking-wider">
              {gig.creatorName}
            </span>
            <span className="text-[11px] text-[#847F75] font-sans">
              {getCategoryLabel(gig.category)} · {formattedDate}
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A36] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View gig <span>→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
