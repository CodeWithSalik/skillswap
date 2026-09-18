import { GigCategory, BookingStatus } from "./types";

/** Category metadata for display and filtering */
export const GIG_CATEGORIES: {
  value: GigCategory;
  label: string;
  icon: string;
}[] = [
  { value: "design", label: "Design", icon: "🎨" },
  { value: "editing", label: "Video Editing", icon: "🎬" },
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
  { label: string; color: string; bgColor: string }
> = {
  Pending: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  Accepted: {
    label: "Accepted",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  Declined: {
    label: "Declined",
    color: "text-red-700",
    bgColor: "bg-red-100",
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
