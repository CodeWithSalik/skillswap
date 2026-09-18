import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings — SkillSwap",
  description: "Track the status of your requested gig bookings with creators.",
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
