import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

/**
 * GET /api/gigs/[id]
 * Fetch a single gig by its MongoDB ObjectId.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid gig ID format." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("gigs");

    const gig = await collection.findOne({ _id: new ObjectId(id) });

    if (!gig) {
      return NextResponse.json(
        { error: "Gig not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      gig: {
        ...gig,
        _id: gig._id.toString(),
      },
    });
  } catch (error) {
    console.error("GET /api/gigs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gig. Please try again." },
      { status: 500 }
    );
  }
}
