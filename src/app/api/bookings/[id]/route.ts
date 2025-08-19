import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../../server/models/Booking";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }  // ✅ correct
) {
  await connectDB();
  const { status } = await req.json();

  const booking = await Booking.findByIdAndUpdate(
    context.params.id, // ✅ access via context
    { status },
    { new: true }
  );

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } // ✅ not Promise
) {
  const { id } = context.params;

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

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }  // ✅ same fix
) {
  const { action } = await req.json(); // { action: "approve" | "reject" }

  let status = "pending";
  if (action === "approve") status = "confirmed";
  if (action === "reject") status = "canceled";

  const booking = await Booking.findByIdAndUpdate(
    context.params.id,
    { status },
    { new: true }
  );

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}