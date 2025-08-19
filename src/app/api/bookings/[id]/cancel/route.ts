import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Booking from "../../../../../server/models/Booking";
import { verifyAuth } from "../../../../../server/middleware/auth";

export async function PATCH(req: NextRequest, context: unknown) {
  await connectDB();
  const auth = await verifyAuth(req, ["customer", "admin"]);

if ("error" in auth) {
  return NextResponse.json(
    { message: auth.error },
    { status: auth.status }
  );
}
  // ✅ safely cast context
  const { id } = (context as { params: { id: string } }).params;

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  const now = new Date();
  
if (auth.role === "customer") {
  const cutoff = new Date(
    booking.start_time.getTime() - 2 * 60 * 60 * 1000
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
