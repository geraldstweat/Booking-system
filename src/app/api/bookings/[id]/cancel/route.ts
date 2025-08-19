import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Booking from "../../../../../server/models/Booking";
import { verifyAuth } from "../../../../../server/middleware/auth";

export async function PATCH(
  req: NextRequest,
  context: unknown // 👈 use any (or unknown) to match Next.js expectations
): Promise<Response> {
  await connectDB();

  const [auth, errorResponse] = await verifyAuth(req, ["customer", "admin"]);
  if (errorResponse) return errorResponse;

  const { id } = context.params as { id: string }; // 👈 safely extract param

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  const now = new Date();

  if (auth.role === "customer") {
    const cutoff = new Date(
      booking.start_time.getTime() - 2 * 60 * 60 * 1000 // 2 hours before start
    );
    if (now > cutoff) {
      return NextResponse.json(
        { message: "Too late to cancel this booking" },
        { status: 400 }
      );
    }
  }
  await booking.save();

  return NextResponse.json({ message: "Booking canceled", booking });
}