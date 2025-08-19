import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../../server/models/Booking";
import { verifyAuth } from "../../../../server/middleware/auth";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    await connectDB();
    const auth = await verifyAuth(req, ["customer"]);

    if (auth && typeof auth === "object" && "status" in auth) {
      // Explicitly assert it's an error response
      const err = auth as { status: number; error?: string; message?: string };
      return NextResponse.json(err, { status: err.status });
    }

    // ✅ At this point, auth is AuthUser
    const userId = (auth as AuthUser).id;
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
