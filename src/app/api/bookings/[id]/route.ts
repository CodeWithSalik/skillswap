import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

/**
 * PATCH /api/bookings/[id]
 * Update booking status to Accepted or Declined.
 * Only Pending bookings can be updated.
 * DP2: Each booking is handled individually — creator can accept/decline independently.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // --- Validation ---
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID format." },
        { status: 400 }
      );
    }

    if (!status || !["Accepted", "Declined"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'Accepted' or 'Declined'." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("bookings");

    const updatedAt = new Date().toISOString();

    // Atomic update: only succeeds if the booking exists AND status is currently "Pending"
    const updatedBooking = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), status: "Pending" },
      { $set: { status, updatedAt } },
      { returnDocument: "after" }
    );

    if (!updatedBooking) {
      // Check whether booking was not found or was already Accepted/Declined
      const existing = await collection.findOne({ _id: new ObjectId(id) });
      if (!existing) {
        return NextResponse.json(
          { error: "Booking not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          error: `This booking has already been ${existing.status.toLowerCase()}. Only pending bookings can be updated.`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      booking: {
        ...updatedBooking,
        _id: updatedBooking._id.toString(),
      },
    });
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update booking. Please try again." },
      { status: 500 }
    );
  }
}
