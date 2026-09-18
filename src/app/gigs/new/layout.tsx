import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Gig — SkillSwap",
  description: "List a service on the SkillSwap creator ledger so clients can book your skills.",
};

export default function PostGigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
