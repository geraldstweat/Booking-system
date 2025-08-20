import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../../server/models/Booking";

// Custom type for reuse
interface RouteParams {
  params: { id: string };
}

type BookingAction = "approve" | "reject";

interface BookingActionBody {
  action: BookingAction;
}

interface BookingUpdateBody {
  status: string;
}

// ---------------- PATCH ----------------
export async function PATCH(req: NextRequest, context: unknown) {
  const { id } = (context as RouteParams).params;

  // Explicitly type the body
  const body: BookingActionBody = await req.json();
  const { action } = body;

  let status = "pending";
  if (action === "approve") status = "confirmed";
  if (action === "reject") status = "canceled";

  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

// ---------------- PUT ----------------
export async function PUT(req: NextRequest, context: unknown) {
  await connectDB();

  const { id } = (context as RouteParams).params;

  const body: BookingUpdateBody = await req.json();
  const { status } = body;

  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest, context: unknown) {
  const { id } = (context as RouteParams).params;

  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete booking", err: String(error) },
      { status: 500 }
    );
  }
}