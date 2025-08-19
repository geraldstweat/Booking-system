import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  role: "customer" | "admin";
};

export async function verifyAuth(
  req: NextRequest,
  allowedRoles: ("customer" | "admin")[]
): Promise<[AuthUser | null, NextResponse | null]> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return [null, NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })];
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");

    const decoded = jwt.verify(token, secret) as { id: string; role: "customer" | "admin" };

    if (!allowedRoles.includes(decoded.role)) {
      return [null, NextResponse.json({ message: "Forbidden" }, { status: 403 })];
    }

    return [{ id: decoded.id, role: decoded.role }, null];
  } catch {
    return [null, NextResponse.json({ message: "Unauthorized" }, { status: 401 })];
  }
}