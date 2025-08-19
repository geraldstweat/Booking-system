import { NextResponse } from "next/server";
import Booking from "../../../../server/models/Booking";
import Resource from "../../../../server/models/Resource";
import User from "../../../../server/models/User";
import { connectDB } from "../../../lib/mongodb";
import { verifyAuth } from "../../../../server/middleware/auth";

export async function POST(req: Request): Promise<Response> {
  try {
    await connectDB();
    const decoded = await verifyAuth(req, ["admin"]);

    if ("status" in decoded) {
      return NextResponse.json(decoded, { status: decoded.status });
    }
    const reqdata = await req.json();
    const resourceId = reqdata.resourceId;
    const start_time = reqdata.start_time;
    const end_time = reqdata.end_time;
    const userEmail = reqdata.userEmail;
    if (!resourceId || !userEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }
    const user = await User.findOne({ email: userEmail });
    const booking = await Booking.create({
      resource: resource._id,
      user: user._id,
      start_time,
      end_time,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (res) {
    // ✅ if verifyAuth threw NextResponse, catch and return it
    return res as NextResponse;
  }
}
