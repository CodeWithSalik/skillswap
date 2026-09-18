import { UserRole } from "./types";

export interface NavItem {
  label: string;
  href: string;
}

export const SHARED_ROUTES = ["/", "/gigs"] as const;
export const CLIENT_ONLY_ROUTES = ["/bookings"] as const;
export const CREATOR_ONLY_ROUTES = ["/dashboard", "/gigs/new"] as const;

/**
 * Validates whether a given role can access a specific route pathname.
 */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  // Shared routes
  if (pathname === "/" || pathname.startsWith("/gigs/") && pathname !== "/gigs/new") {
    return true;
  }

  // Client-only routes
  if (pathname === "/bookings" || pathname.startsWith("/bookings/")) {
    return role === "client";
  }

  // Creator-only routes
  if (pathname === "/gigs/new" || pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return role === "creator";
  }

  // Any other page is treated as shared/public by default
  return true;
}

/**
 * Action permission helpers
 */
export function canBookGig(role: UserRole): boolean {
  return role === "client";
}

export function canPostGig(role: UserRole): boolean {
  return role === "creator";
}

export function canManageBookings(role: UserRole): boolean {
  return role === "creator";
}

export function canViewClientBookings(role: UserRole): boolean {
  return role === "client";
}

/**
 * Returns role-aware navigation items without exposing cross-role links.
 */
export function getNavigationItems(role: UserRole): NavItem[] {
  if (role === "creator") {
    return [
      { label: "Marketplace", href: "/" },
      { label: "Post a Gig", href: "/gigs/new" },
      { label: "Creator Desk", href: "/dashboard" },
    ];
  }

  return [
    { label: "Marketplace", href: "/" },
    { label: "My Bookings", href: "/bookings" },
  ];
}
