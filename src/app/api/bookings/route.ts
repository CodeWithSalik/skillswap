import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

/**
 * GET /api/bookings
 * List bookings filtered by clientName (My Bookings) or creatorName (Dashboard).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientName = searchParams.get("clientName")?.trim();
    const creatorName = searchParams.get("creatorName")?.trim();

    if (!clientName && !creatorName) {
      return NextResponse.json(
        { error: "Please provide clientName or creatorName to filter bookings." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("bookings");

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (clientName) query.clientName = clientName;
    if (creatorName) query.creatorName = creatorName;

    const bookings = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBookings = bookings.map((b) => ({
      ...b,
      _id: b._id.toString(),
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Create a new booking.
 * DP1 enforcement: Prevents a client from rebooking a gig they were already declined on.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gigId, clientName, clientEmail, message } = body;

    // --- Validation ---
    const errors: string[] = [];

    if (!gigId || typeof gigId !== "string") {
      errors.push("Gig ID is required.");
    }

    if (!clientName || typeof clientName !== "string" || clientName.trim().length < 1) {
      errors.push("Your name is required.");
    }

    if (!clientEmail || typeof clientEmail !== "string") {
      errors.push("Email is required.");
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail.trim())) {
        errors.push("Please provide a valid email address.");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(" ") },
        { status: 400 }
      );
    }

    const db = await getDb();

    // --- Verify gig exists ---
    if (!ObjectId.isValid(gigId)) {
      return NextResponse.json(
        { error: "Invalid gig ID." },
        { status: 400 }
      );
    }

    const gigsCollection = db.collection("gigs");
    const gig = await gigsCollection.findOne({ _id: new ObjectId(gigId) });

    if (!gig) {
      return NextResponse.json(
        { error: "Gig not found. It may have been removed." },
        { status: 404 }
      );
    }

    // --- DP1: Prevent rebooking after decline ---
    const bookingsCollection = db.collection("bookings");
    const declinedBooking = await bookingsCollection.findOne({
      gigId,
      clientName: clientName.trim(),
      status: "Declined",
    });

    if (declinedBooking) {
      return NextResponse.json(
        {
          error:
            "You previously booked this gig and it was declined. Please browse other gigs instead.",
        },
        { status: 409 }
      );
    }

    // --- Create booking ---
    const newBooking = {
      gigId,
      gigTitle: gig.title,
      creatorName: gig.creatorName,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      message: message?.trim() || undefined,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const result = await bookingsCollection.insertOne(newBooking);

    const booking = {
      ...newBooking,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
