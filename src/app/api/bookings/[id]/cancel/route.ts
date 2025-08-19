import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Booking from "../../../../../server/models/Booking";
import { verifyAuth } from "../../../../../server/middleware/auth";

export async function PATCH(req: NextRequest, context: any) {
  await connectDB();
  const auth = await verifyAuth(req, ["customer", "admin"]);

  if ("status" in auth) {
    return NextResponse.json(
      { message: auth.error ?? "Unauthorized" },
      { status: auth.status }
    );
  }

  // ✅ cast context to add type-safety
  const { id } = (context as { params: { id: string } }).params;

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  const now = new Date();

  if (auth.role === "customer") {
    const cutoff = new Date(
      booking.start_time.getTime() - 2 * 60 * 60 * 1000 // 2h before start
    );
    if (now > cutoff) {
      return NextResponse.json(
        { message: "Too late to cancel this booking" },
        { status: 400 }
      );
    }
  }

  booking.status = "canceled";
  await booking.save();

  return NextResponse.json({ message: "Booking canceled", booking });
}