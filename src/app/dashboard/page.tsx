"use client";

import { useState, useEffect } from "react";
import { Booking } from "@/lib/types";
import { fetchBookings, updateBookingStatus } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { BOOKING_STATUS_CONFIG } from "@/lib/constants";
import Link from "next/link";

export default function DashboardPage() {
  const { role, userName } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "Pending" | "Accepted" | "Declined">("all");

  useEffect(() => {
    async function loadBookings() {
      if (!userName) return;
      setIsLoading(true);
      try {
        const data = await fetchBookings({ creatorName: userName });
        setBookings(data);
      } catch {
        console.warn("API not available");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [userName]);

  const handleStatusUpdate = async (
    bookingId: string,
    status: "Accepted" | "Declined"
  ) => {
    setUpdatingId(bookingId);
    try {
      const updated = await updateBookingStatus(bookingId, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updated : b))
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to update booking status"
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

  // Role guard
  if (role !== "creator") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔄</div>
          <h2 className="text-xl font-bold mb-2">Switch to Creator Mode</h2>
          <p className="text-[var(--color-text-secondary)]">
            The dashboard is for creators. Use the toggle in the header to
            switch to Creator mode.
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
            Click &ldquo;Set Name&rdquo; in the header to see your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Creator Dashboard</h1>
          <p className="text-[var(--color-text-secondary)]">
            Manage your incoming bookings
          </p>
        </div>
        <Link
          href="/gigs/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post New Gig
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-[var(--color-text)]" },
          { label: "Pending", value: stats.pending, color: "text-amber-400" },
          { label: "Accepted", value: stats.accepted, color: "text-emerald-400" },
          { label: "Declined", value: stats.declined, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-6 overflow-x-auto">
        {(["all", "Pending", "Accepted", "Declined"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              filter === f
                ? "bg-[var(--color-bg-elevated)] text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {f === "all" ? "All" : f}
            {f !== "all" && (
              <span className="ml-1.5 text-xs opacity-60">
                {f === "Pending"
                  ? stats.pending
                  : f === "Accepted"
                  ? stats.accepted
                  : stats.declined}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 w-48 bg-[var(--color-bg-secondary)] rounded" />
                <div className="h-6 w-20 bg-[var(--color-bg-secondary)] rounded-full" />
              </div>
              <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded mt-3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredBookings.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {filter !== "all"
              ? `No ${filter.toLowerCase()} bookings found.`
              : "When clients book your gigs, they'll appear here."}
          </p>
          <Link
            href="/gigs/new"
            className="inline-flex px-4 py-2 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            Post a gig to get started →
          </Link>
        </div>
      )}

      {/* Booking list */}
      {!isLoading && filteredBookings.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {filteredBookings.map((booking) => {
            const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
            return (
              <div
                key={booking._id}
                className="glass-card p-5 transition-all hover:border-[rgba(99,102,241,0.3)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Gig title */}
                    <h3 className="font-semibold truncate mb-1">
                      {booking.gigTitle}
                    </h3>
                    {/* Client info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                          {booking.clientName.charAt(0).toUpperCase()}
                        </span>
                        {booking.clientName}
                      </span>
                      <span>{booking.clientEmail}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    {/* Message */}
                    {booking.message && (
                      <p className="mt-2 text-sm text-[var(--color-text-muted)] italic">
                        &ldquo;{booking.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {booking.status === "Pending" ? (
                      <>
                        <button
                          id={`accept-booking-${booking._id}`}
                          onClick={() =>
                            handleStatusUpdate(booking._id, "Accepted")
                          }
                          disabled={updatingId === booking._id}
                          className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                          {updatingId === booking._id
                            ? "..."
                            : "Accept"}
                        </button>
                        <button
                          id={`decline-booking-${booking._id}`}
                          onClick={() =>
                            handleStatusUpdate(booking._id, "Declined")
                          }
                          disabled={updatingId === booking._id}
                          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {updatingId === booking._id
                            ? "..."
                            : "Decline"}
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                      >
                        {statusConfig.label}
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
