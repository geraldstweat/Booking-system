import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../../server/models/Booking";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { status } = await req.json();

  const booking = await Booking.findByIdAndUpdate(
    params.id,
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params

  try {
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Booking deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete booking", err: error }),
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { action } = await req.json(); // { action: "approve" | "reject" }

  let status = "pending";
  if (action === "approve") status = "confirmed";
  if (action === "reject") status = "canceled";

  const booking = await Booking.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}
