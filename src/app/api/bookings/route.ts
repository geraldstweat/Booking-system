import { NextResponse } from "next/server";
import Booking from "../../../server/models/Booking";
import Resource from "../../../server/models/Resource";
import User from "../../../server/models/User";
import { connectDB } from "../../lib/mongodb";
import { NextRequest } from "next/server";

// GET: fetch bookings (admin → all, customer → own by email from token/session)
export async function GET(req: NextRequest) {
  // await connectDB();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // string | null
  const email = searchParams.get("email"); // string | null
  const user = email ? await User.findOne({ email }) : null;
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }
  let bookings;
  if (role === "admin") {
    bookings = await Booking.find().populate("resource");
  } else {
    bookings = await Booking.find({ user: user._id }).populate("resource");
  }
  return Response.json(bookings);
}

// POST: customer creates booking
export async function POST(req: NextRequest) {
  await connectDB();
  const { resourceId, start_time, end_time } = await req.json();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email"); // string | null
  const resource = await Resource.findById(resourceId);
  if (!resource)
    return new Response(JSON.stringify({ message: "Resource not found" }), {
      status: 404,
    });

  // for simplicity assume slot is ISO string
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }
  const booking = await Booking.create({
    resource: resource._id,
    user: user._id,
    start_time,
    end_time,
  });

  // return Response.json(await booking.populate("resource"));
  return NextResponse.json(booking, { status: 201 });
}
