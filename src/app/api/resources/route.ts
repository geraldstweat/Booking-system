import { NextResponse } from "next/server";
import Resource from "../../../server/models/Resource";
import { connectDB } from "../../lib/mongodb";
import { verifyAuth } from "@/server/middleware/auth";

// 👇 GET all resources
export async function GET(req: Request) {
  await connectDB();

  try {
    const resources = await Resource.find();
    return NextResponse.json(resources, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching resources:", err);
    return NextResponse.json(
      { message: "Failed to fetch resources", error: err.message },
      { status: 500 }
    );
  }
}

// 👇 Seed default resources (Admin only)
export async function POST(req: Request) {
  await connectDB();

  const auth = await verifyAuth(req, ["admin"]);
  if ("status" in auth) return auth;

  try {
    const defaultResources = [
      { name: "Conference Room A", type: "room", capacity: 20, slots: [] },
      { name: "Conference Room B", type: "room", capacity: 10, slots: [] },
      { name: "Private Office", type: "room", capacity: 5, slots: [] },
      { name: "Projector Service", type: "service", duration: 60, slots: [] },
      { name: "Catering Service", type: "service", duration: 120, slots: [] },
    ];

    // Find existing resource names
    const existing = await Resource.find({
      name: { $in: defaultResources.map((r) => r.name) },
    }).select("name");

    const existingNames = existing.map((r) => r.name);

    // Filter out already existing resources
    const toInsert = defaultResources.filter(
      (r) => !existingNames.includes(r.name)
    );

    let inserted = [];
    if (toInsert.length > 0) {
      inserted = await Resource.insertMany(toInsert);
    }

    return NextResponse.json(
      {
        message: "Resources seeding completed",
        inserted,
        skipped: existingNames,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error seeding resources:", err);
    return NextResponse.json(
      { message: "Failed to seed resources", error: err.message },
      { status: 500 }
    );
  }
}