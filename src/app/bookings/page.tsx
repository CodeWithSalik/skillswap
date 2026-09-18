"use client";

import { useState, useEffect } from "react";
import { Booking } from "@/lib/types";
import { fetchBookings } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function MyBookingsPage() {
  const { role, setRole, userName, setUserName } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Pending" | "Accepted" | "Declined">("all");
  const [inlineName, setInlineName] = useState("");

  const activeUser = userName || inlineName.trim();

  useEffect(() => {
    async function loadBookings() {
      if (!activeUser) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchBookings({ clientName: activeUser });
        setBookings(data);
      } catch {
        console.warn("API not available or network error");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [activeUser]);

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    accepted: bookings.filter((b) => b.status === "Accepted").length,
    declined: bookings.filter((b) => b.status === "Declined").length,
  };

  // Name guard
  if (!activeUser) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4 py-12">
        <div className="ledger-card bg-[#FFFDF8] border border-[#D8CEBC] p-8 max-w-md w-full text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-[#847F75] mb-2">
            CLIENT IDENTITY
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#171717] mb-3">
            Set Your Client Name
          </h2>
          <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
            Enter your display name to view and track your submitted gig booking requests.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inlineName}
              onChange={(e) => setInlineName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inlineName.trim()) {
                  setUserName(inlineName.trim());
                }
              }}
              placeholder="Your name"
              className="text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                if (inlineName.trim()) setUserName(inlineName.trim());
              }}
              disabled={!inlineName.trim()}
              className="btn-signal px-4 text-xs font-mono uppercase tracking-wider whitespace-nowrap disabled:opacity-50 font-semibold"
            >
              Set Name
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 pb-6 border-b border-[#D8CEBC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 border border-[#FF5A36]/30 bg-[#FFF2EE] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#FF5A36] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]"></span>
            CLIENT LEDGER · {activeUser}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight mb-2 uppercase">
            MY BOOKINGS
          </h1>
          <p className="text-[#57534E] text-sm font-sans">
            Track requests you&apos;ve sent.
          </p>
        </div>
        <Link
          href="/"
          className="btn-outline px-5 py-2.5 text-xs font-mono uppercase tracking-wider self-start sm:self-auto inline-flex items-center gap-2"
        >
          <span>Browse More Gigs →</span>
        </Link>
      </div>

      {/* Role Reminder if current role is creator */}
      {role === "creator" && (
        <div className="mb-8 p-4 bg-[#F7F3EA] border border-[#D8CEBC] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-xs text-[#57534E]">
            Note: You are currently toggled to <strong>Creator mode</strong> in the header. These are your requests made as a <strong>Client</strong>.
          </p>
          <button
            type="button"
            onClick={() => setRole("client")}
            className="text-xs font-mono uppercase text-[#FF5A36] underline hover:text-[#E64B29] whitespace-nowrap"
          >
            Switch to Client Mode
          </button>
        </div>
      )}

      {/* Stats Tally Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-[#171717]", bg: "bg-[#FFFDF8]", border: "border-[#D8CEBC]" },
          { label: "Pending", value: stats.pending, color: "text-[#92400E]", bg: "bg-[#FEF3C7]", border: "border-[#FDE68A]" },
          { label: "Accepted", value: stats.accepted, color: "text-[#3D4733]", bg: "bg-[#EAEFE4]", border: "border-[#B5C2A8]" },
          { label: "Declined", value: stats.declined, color: "text-[#991B1B]", bg: "bg-[#FEE2E2]", border: "border-[#FCA5A5]" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 border ${stat.border} ${stat.bg} rounded-sm text-left`}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#57534E] block mb-1">
              {stat.label}
            </span>
            <span className={`font-mono text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 pb-2 border-b border-[#D8CEBC] overflow-x-auto">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#847F75] pr-2 flex-shrink-0">
          STATUS:
        </span>
        {(["all", "Pending", "Accepted", "Declined"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
              filter === f
                ? "bg-[#171717] text-[#FFFDF8] font-bold"
                : "bg-[#FFFDF8] border border-[#D8CEBC] text-[#57534E] hover:border-[#171717]"
            }`}
          >
            {f === "all" ? "All Bookings" : f}
            <span className="ml-1.5 opacity-60">
              (
              {f === "all"
                ? stats.total
                : f === "Pending"
                ? stats.pending
                : f === "Accepted"
                ? stats.accepted
                : stats.declined}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ledger-card p-6 bg-[#FFFDF8] border border-[#D8CEBC] animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-48 bg-[#EBE5D8] rounded-sm" />
                <div className="h-6 w-20 bg-[#EBE5D8] rounded-sm" />
              </div>
              <div className="h-3 w-36 bg-[#EBE5D8] rounded-sm" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredBookings.length === 0 && (
        <div className="ledger-card-flat bg-[#FFFDF8] border border-[#D8CEBC] p-12 text-center my-6">
          <div className="font-mono text-2xl text-[#847F75] mb-2">📋</div>
          <h3 className="font-serif text-lg font-bold text-[#171717] mb-1">
            No bookings found.
          </h3>
          <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
            {filter !== "all"
              ? `You have no bookings marked as "${filter}".`
              : "When you book a gig from the marketplace, your requests and their progress will appear here."}
          </p>
          <Link
            href="/"
            className="btn-signal px-5 py-2.5 text-xs font-mono uppercase tracking-wider inline-block"
          >
            Browse Marketplace Gigs →
          </Link>
        </div>
      )}

      {/* Booking List */}
      {!isLoading && filteredBookings.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === "Pending";
            const isAccepted = booking.status === "Accepted";
            const isDeclined = booking.status === "Declined";

            return (
              <div
                key={booking._id}
                className="ledger-card p-6 bg-[#FFFDF8] border border-[#D8CEBC] transition-all hover:border-[#171717]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Gig Title */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#F7F3EA] border border-[#D8CEBC] text-[#57534E] rounded-sm font-semibold">
                        SERVICE
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#171717] truncate">
                        {booking.gigTitle}
                      </h3>
                    </div>

                    {/* Creator & Timestamp */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#57534E] mb-3">
                      <span>
                        Creator: <strong className="text-[#171717]">{booking.creatorName}</strong>
                      </span>
                      <span>·</span>
                      <span className="text-[#847F75]">
                        Booked {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Client Message */}
                    {booking.message && (
                      <div className="p-3 bg-[#F7F3EA] border border-[#D8CEBC]/70 rounded-sm font-sans text-sm text-[#171717] leading-relaxed mb-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#847F75] block mb-1">
                          Your Note:
                        </span>
                        &ldquo;{booking.message}&rdquo;
                      </div>
                    )}

                    {/* DP1 Clear Rejection Explanation */}
                    {isDeclined && (
                      <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-sm text-xs text-[#991B1B] font-mono leading-relaxed mt-2">
                        <p className="font-bold mb-1">Notice (DP1):</p>
                        <p className="mb-2">
                          The creator wasn&apos;t able to take this request.
                        </p>
                        <Link
                          href="/"
                          className="inline-flex items-center gap-1 font-bold underline hover:text-[#7F1D1D] uppercase tracking-wider text-[11px]"
                        >
                          <span>BROWSE OTHER GIGS</span>
                          <span>→</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-start md:items-end flex-shrink-0 pt-2 md:pt-0">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold rounded-sm bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B45309] animate-pulse"></span>
                        PENDING
                      </span>
                    )}
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold rounded-sm bg-[#EAEFE4] text-[#3D4733] border border-[#B5C2A8]">
                        <span>✓</span> ACCEPTED
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold rounded-sm bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]">
                        <span>✕</span> DECLINED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
