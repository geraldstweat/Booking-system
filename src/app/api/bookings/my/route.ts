import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../../server/models/Booking";
import { verifyAuth } from "../../../../server/middleware/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const auth = await verifyAuth(req, ["customer"]);
  if ("status" in auth) return auth;

  const userId = auth.user._id;
  const now = new Date();

  const bookings = await Booking.find({
    user: userId,
    start_time: { $gte: now },
  }).populate("resource");

  return NextResponse.json(bookings);
}