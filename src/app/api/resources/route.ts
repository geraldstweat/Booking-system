import { NextRequest, NextResponse } from "next/server";
import Resource from "../../../server/models/Resource";
import { connectDB } from "../../lib/mongodb";
import { verifyAuth } from "../../../server/middleware/auth";

export async function POST(req: NextRequest): Promise<Response> {
  await connectDB();

  const [auth, errorResponse] = await verifyAuth(req, ["admin"]);
  if (errorResponse) return errorResponse; // ✅ always a Response

  try {
    const body = await req.json();
    const { resources } = body as { resources: any[] };

    if (!resources || !Array.isArray(resources)) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    // Insert, but avoid duplicates by name
    const inserted: any[] = [];
    const skipped: string[] = [];

    for (const resource of resources) {
      const exists = await Resource.findOne({ name: resource.name });
      if (exists) {
        skipped.push(resource.name);
      } else {
        const newResource = new Resource(resource);
        await newResource.save();
        inserted.push(newResource);
      }
    }

    return NextResponse.json(
      { message: "Resources processed", inserted, skipped },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating resources:", err);
    return NextResponse.json(
      { message: "Failed to create resources", error: String(err) },
      { status: 500 }
    );
  }
}