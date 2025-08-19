import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../../server/models/Booking";
import { verifyAuth } from "../../../../server/middleware/auth";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    await connectDB();
    const auth = await verifyAuth(req, ["customer"]); // ✅ always safe
    if ("status" in auth) {
      return NextResponse.json(auth, { status: auth.status });
    }
    const userId = auth.id; // or auth.user._id depending on what you decode
    const now = new Date();

    const bookings = await Booking.find({
      user: userId,
      start_time: { $gte: now },
    }).populate("resource");

    return NextResponse.json(bookings);
  } catch (err) {
    if (err instanceof Response) return err; // catch thrown NextResponse
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
