import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Desk — SkillSwap",
  description: "Manage incoming client booking requests and accept or decline services.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
