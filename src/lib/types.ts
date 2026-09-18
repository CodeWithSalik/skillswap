// ============================================
// SHARED TYPES — Contract between Frontend & Backend
// Both Ubaidullah (frontend) and Salik (backend) must agree on these.
// Do NOT modify without coordinating with your teammate.
// ============================================

/** Gig categories available on the platform */
export type GigCategory =
  | "design"
  | "editing"
  | "tutoring"
  | "music"
  | "writing"
  | "programming"
  | "marketing"
  | "other";

/** Booking status lifecycle */
export type BookingStatus = "Pending" | "Accepted" | "Declined";

/** User role — no auth, just a mode toggle */
export type UserRole = "creator" | "client";

/** A gig listing created by a creator */
export interface Gig {
  _id: string;
  title: string;
  category: GigCategory;
  rate: number; // in INR
  description: string;
  creatorName: string;
  createdAt: string; // ISO 8601 date string
}

/** Payload for creating a new gig */
export interface CreateGigPayload {
  title: string;
  category: GigCategory;
  rate: number;
  description: string;
  creatorName: string;
}

/** A booking made by a client */
export interface Booking {
  _id: string;
  gigId: string;
  gigTitle: string; // denormalized for display
  creatorName: string; // who created the gig
  clientName: string; // who booked
  clientEmail: string;
  message?: string; // optional note from client
  status: BookingStatus;
  createdAt: string; // ISO 8601 date string
}

/** Payload for creating a new booking */
export interface CreateBookingPayload {
  gigId: string;
  clientName: string;
  clientEmail: string;
  message?: string;
}

/** Payload for updating booking status */
export interface UpdateBookingPayload {
  status: "Accepted" | "Declined";
}

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
