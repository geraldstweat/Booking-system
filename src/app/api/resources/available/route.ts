import { NextResponse } from "next/server";
import Resource from "../../../../server/models/Resource";
import { connectDB } from "../../../lib/mongodb";
import { verifyAuth } from "../../../../server/middleware/auth";

export async function GET(req: Request): Promise<Response> {
  await connectDB();

  const [auth, errorResponse] = await verifyAuth(req, ["customer", "admin"]);
  if (errorResponse) return errorResponse; // ✅ always Response

  const { id, role } = auth!; // safe now

  try {
    let resources = await Resource.find();

    if (resources.length === 0) {
      const defaultResources = [
        { name: "Conference Room A", type: "room", capacity: 20, slots: [] },
        { name: "Conference Room B", type: "room", capacity: 10, slots: [] },
        { name: "Private Office", type: "room", capacity: 5, slots: [] },
        { name: "Projector Service", type: "service", duration: 60, slots: [] },
        { name: "Catering Service", type: "service", duration: 120, slots: [] },
      ];
      resources = await Resource.create(defaultResources);
    }

    return NextResponse.json(resources, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching resources:", err);
    return NextResponse.json(
      { message: "Failed to fetch resources", error: String(err) },
      { status: 500 }
    );
  }
}