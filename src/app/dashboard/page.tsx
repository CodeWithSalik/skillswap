"use client";

import { useState, useEffect } from "react";
import { Booking } from "@/lib/types";
import { fetchBookings, updateBookingStatus } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function DashboardPage() {
  const { role, setRole, userName, setUserName } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "Pending" | "Accepted" | "Declined">("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [inlineName, setInlineName] = useState("");

  const activeUser = userName || inlineName.trim();

  useEffect(() => {
    async function loadBookings() {
      if (!activeUser) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setActionError(null);
      try {
        const data = await fetchBookings({ creatorName: activeUser });
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

  const handleStatusUpdate = async (
    bookingId: string,
    status: "Accepted" | "Declined"
  ) => {
    setUpdatingId(bookingId);
    setActionError(null);
    try {
      const updated = await updateBookingStatus(bookingId, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updated : b))
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update booking status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

  // Access state: Creator mode required
  if (role !== "creator") {
    return (
      <div className="min-h-[55vh] flex items-center justify-center px-4 py-12">
        <div className="ledger-card bg-[#FFFDF8] border-2 border-[#171717] p-8 sm:p-10 max-w-md w-full text-center animate-fade-in shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 border border-[#59634A]/40 bg-[#EAEFE4] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#3D4733] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#59634A]"></span>
            CREATOR MODE REQUIRED
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] mb-3 uppercase tracking-tight">
            Creator Mode Required
          </h2>
          <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
            This page is part of the Creator workspace. Switch to Creator Mode to continue.
          </p>
          <button
            type="button"
            onClick={() => setRole("creator")}
            className="btn-olive w-full py-3 text-xs font-mono uppercase tracking-wider font-bold rounded-sm inline-flex items-center justify-center gap-2 shadow-xs"
          >
            <span>SWITCH TO CREATOR MODE →</span>
          </button>
        </div>
      </div>
    );
  }

  // Name guard
  if (!activeUser) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4 py-12">
        <div className="ledger-card bg-[#FFFDF8] border border-[#D8CEBC] p-8 max-w-md w-full text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-[#847F75] mb-2">
            CREATOR IDENTITY
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#171717] mb-3">
            Set Your Creator Name
          </h2>
          <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
            Enter your display name to view and manage booking requests sent to your services.
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
              className="btn-olive px-4 text-xs font-mono uppercase tracking-wider whitespace-nowrap disabled:opacity-50"
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 border border-[#59634A]/40 bg-[#EAEFE4] rounded-sm font-mono text-[10px] uppercase tracking-widest text-[#3D4733] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#59634A]"></span>
            CREATOR WORKSPACE · {activeUser}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight mb-2 uppercase">
            CREATOR DESK
          </h1>
          <p className="text-[#57534E] text-sm font-sans">
            Manage incoming requests.
          </p>
        </div>
        <Link
          href="/gigs/new"
          className="btn-olive px-5 py-2.5 text-xs font-mono uppercase tracking-wider self-start sm:self-auto inline-flex items-center gap-2 shadow-xs"
        >
          <span>+ Post New Gig</span>
        </Link>
      </div>

      {/* Metrics Tally Bar */}
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
            {f === "all" ? "All Requests" : f}
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

      {/* Inline Action Error (Never a browser alert!) */}
      {actionError && (
        <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs font-mono rounded-sm flex items-start justify-between">
          <div>
            <p className="font-bold mb-0.5">Action Notice:</p>
            <p>{actionError}</p>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-sm font-bold text-[#991B1B] hover:opacity-75 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Section Headline */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-[#171717] tracking-tight">
          INCOMING REQUESTS
        </h2>
        <span className="font-mono text-xs text-[#847F75]">
          {filteredBookings.length} record{filteredBookings.length !== 1 ? "s" : ""}
        </span>
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
          <div className="font-mono text-2xl text-[#847F75] mb-2">📭</div>
          <h3 className="font-serif text-2xl font-bold text-[#171717] mb-2 uppercase tracking-tight">
            {filter !== "all" ? "No matching requests" : "NO INCOMING REQUESTS"}
          </h3>
          <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
            {filter !== "all"
              ? `No requests currently marked as "${filter}".`
              : "New client booking requests will appear here."}
          </p>
          <Link
            href="/gigs/new"
            className="btn-olive px-5 py-2.5 text-xs font-mono uppercase tracking-wider inline-block font-bold rounded-sm shadow-xs"
          >
            Post a New Gig →
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
                        GIG
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#171717] truncate">
                        {booking.gigTitle}
                      </h3>
                    </div>

                    {/* Client Information */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#57534E] mb-3">
                      <span>
                        Client: <strong className="text-[#171717]">{booking.clientName}</strong>
                      </span>
                      <span>·</span>
                      <span className="text-[#171717] underline decoration-dotted">{booking.clientEmail}</span>
                      <span>·</span>
                      <span className="text-[#847F75]">
                        {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Client Message */}
                    {booking.message && (
                      <div className="p-3 bg-[#F7F3EA] border border-[#D8CEBC]/70 rounded-sm font-sans text-sm text-[#171717] leading-relaxed">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#847F75] block mb-1">
                          Client Note:
                        </span>
                        &ldquo;{booking.message}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 md:flex-col md:items-end flex-shrink-0 pt-2 md:pt-0">
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          id={`accept-booking-${booking._id}`}
                          type="button"
                          onClick={() => handleStatusUpdate(booking._id, "Accepted")}
                          disabled={updatingId === booking._id}
                          className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#3D4733] text-white font-bold rounded-sm hover:bg-[#2F3727] transition-colors disabled:opacity-50"
                        >
                          {updatingId === booking._id ? "Updating..." : "ACCEPT"}
                        </button>
                        <button
                          id={`decline-booking-${booking._id}`}
                          type="button"
                          onClick={() => handleStatusUpdate(booking._id, "Declined")}
                          disabled={updatingId === booking._id}
                          className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#DC2626] text-[#DC2626] bg-[#FFFDF8] hover:bg-[#FEE2E2] font-bold rounded-sm transition-colors disabled:opacity-50"
                        >
                          {updatingId === booking._id ? "Updating..." : "DECLINE"}
                        </button>
                      </div>
                    ) : isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold rounded-sm bg-[#EAEFE4] text-[#3D4733] border border-[#B5C2A8]">
                        <span>✓</span> ACCEPTED
                      </span>
                    ) : isDeclined ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold rounded-sm bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]">
                        <span>✕</span> DECLINED
                      </span>
                    ) : null}
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
