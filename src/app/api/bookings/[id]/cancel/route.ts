import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Booking from "../../../../../server/models/Booking";
import { verifyAuth } from "../../../../../server/middleware/auth";
import { AuthUser } from "../../../../../server/types/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  await connectDB();

  // ✅ Destructure tuple from verifyAuth
  const [auth, errorResponse] = await verifyAuth(req, ["customer", "admin"]);
  if (errorResponse) return errorResponse;

  const booking = await Booking.findById(params.id).populate("resource");
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

  // ✅ Actually cancel the booking
  booking.status = "canceled";
  await booking.save();

  return NextResponse.json({ message: "Booking canceled", booking });
}