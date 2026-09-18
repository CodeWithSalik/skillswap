import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// Valid categories — must match frontend constants
const VALID_CATEGORIES = [
  "design",
  "editing",
  "tutoring",
  "music",
  "writing",
  "programming",
  "marketing",
  "other",
];

/**
 * GET /api/gigs
 * List all gigs with optional search and category filtering.
 * Sorted newest-first (DP3 — Discovery).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();

    const db = await getDb();
    const collection = db.collection("gigs");

    // Build MongoDB query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    // Category filter
    if (category && VALID_CATEGORIES.includes(category)) {
      query.category = category;
    }

    // Search filter — case-insensitive match on title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch gigs, newest first (DP3)
    const gigs = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Transform _id to string for JSON response
    const formattedGigs = gigs.map((gig) => ({
      ...gig,
      _id: gig._id.toString(),
    }));

    return NextResponse.json({ gigs: formattedGigs });
  } catch (error) {
    console.error("GET /api/gigs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gigs. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gigs
 * Create a new gig with server-side validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, rate, description, creatorName } = body;

    // --- Server-side validation ---
    const errors: string[] = [];

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      errors.push("Title must be at least 3 characters.");
    }
    if (title && title.trim().length > 100) {
      errors.push("Title must be at most 100 characters.");
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      errors.push("Invalid category. Choose a valid category.");
    }

    if (rate === undefined || rate === null || typeof rate !== "number" || rate <= 0) {
      errors.push("Rate must be a positive number.");
    }
    if (rate > 1000000) {
      errors.push("Rate seems too high. Maximum is ₹10,00,000.");
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 10
    ) {
      errors.push("Description must be at least 10 characters.");
    }
    if (description && description.trim().length > 1000) {
      errors.push("Description must be at most 1000 characters.");
    }

    if (
      !creatorName ||
      typeof creatorName !== "string" ||
      creatorName.trim().length < 1
    ) {
      errors.push("Creator name is required.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(" ") },
        { status: 400 }
      );
    }

    // --- Insert into database ---
    const db = await getDb();
    const collection = db.collection("gigs");

    const newGig = {
      title: title.trim(),
      category,
      rate: Number(rate),
      description: description.trim(),
      creatorName: creatorName.trim(),
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newGig);

    const gig = {
      ...newGig,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json({ gig }, { status: 201 });
  } catch (error) {
    console.error("POST /api/gigs error:", error);
    return NextResponse.json(
      { error: "Failed to create gig. Please try again." },
      { status: 500 }
    );
  }
}
