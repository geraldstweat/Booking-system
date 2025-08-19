import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyAuth(req: Request, roles: string[] = []) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role: string;
  };

  if (roles.length && !roles.includes(decoded.role)) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return decoded; // ✅ always safe, never returns NextResponse
}