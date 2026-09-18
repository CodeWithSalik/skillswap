import { GigCategory, BookingStatus } from "./types";

/** Category metadata for display and filtering */
export const GIG_CATEGORIES: {
  value: GigCategory;
  label: string;
  icon: string;
}[] = [
  { value: "design", label: "Design", icon: "🎨" },
  { value: "editing", label: "Editing", icon: "🎬" },
  { value: "tutoring", label: "Tutoring", icon: "📚" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "writing", label: "Writing", icon: "✍️" },
  { value: "programming", label: "Programming", icon: "💻" },
  { value: "marketing", label: "Marketing", icon: "📢" },
  { value: "other", label: "Other", icon: "✨" },
];

/** Status display metadata */
export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  Pending: {
    label: "Pending",
    color: "text-[#92400E]",
    bgColor: "bg-[#FEF3C7]",
    borderColor: "border-[#FDE68A]",
  },
  Accepted: {
    label: "Accepted",
    color: "text-[#3D4733]",
    bgColor: "bg-[#EAEFE4]",
    borderColor: "border-[#B5C2A8]",
  },
  Declined: {
    label: "Declined",
    color: "text-[#991B1B]",
    bgColor: "bg-[#FEE2E2]",
    borderColor: "border-[#FCA5A5]",
  },
};

/** Helper to get category label from value */
export function getCategoryLabel(category: GigCategory): string {
  return (
    GIG_CATEGORIES.find((c) => c.value === category)?.label ?? category
  );
}

/** Helper to get category icon from value */
export function getCategoryIcon(category: GigCategory): string {
  return GIG_CATEGORIES.find((c) => c.value === category)?.icon ?? "✨";
}
