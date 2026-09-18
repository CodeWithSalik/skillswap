import {
  Gig,
  Booking,
  CreateGigPayload,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "./types";

const BASE_URL = "/api";

// ============================================
// GIG ENDPOINTS
// ============================================

/** Fetch all gigs, optionally filtered by search query and category */
export async function fetchGigs(params?: {
  search?: string;
  category?: string;
}): Promise<Gig[]> {
  const url = new URL(`${BASE_URL}/gigs`, window.location.origin);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.category) url.searchParams.set("category", params.category);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch gigs");

  const data = await res.json();
  return data.gigs ?? data.data ?? data;
}

/** Fetch a single gig by ID */
export async function fetchGig(id: string): Promise<Gig> {
  const res = await fetch(`${BASE_URL}/gigs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch gig");

  const data = await res.json();
  return data.gig ?? data.data ?? data;
}

/** Create a new gig */
export async function createGig(payload: CreateGigPayload): Promise<Gig> {
  const res = await fetch(`${BASE_URL}/gigs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to create gig");
  }

  const data = await res.json();
  return data.gig ?? data.data ?? data;
}

// ============================================
// BOOKING ENDPOINTS
// ============================================

/** Fetch bookings — filter by clientName (for My Bookings) or creatorName (for Dashboard) */
export async function fetchBookings(params?: {
  clientName?: string;
  creatorName?: string;
}): Promise<Booking[]> {
  const url = new URL(`${BASE_URL}/bookings`, window.location.origin);
  if (params?.clientName)
    url.searchParams.set("clientName", params.clientName);
  if (params?.creatorName)
    url.searchParams.set("creatorName", params.creatorName);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch bookings");

  const data = await res.json();
  return data.bookings ?? data.data ?? data;
}

/** Create a new booking */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<Booking> {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to create booking");
  }

  const data = await res.json();
  return data.booking ?? data.data ?? data;
}

/** Update booking status (accept/decline) */
export async function updateBookingStatus(
  bookingId: string,
  payload: UpdateBookingPayload
): Promise<Booking> {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to update booking");
  }

  const data = await res.json();
  return data.booking ?? data.data ?? data;
}
