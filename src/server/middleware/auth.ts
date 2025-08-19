import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyAuth(req: Request, allowedRoles: string[]) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Server config error" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      role: string;
    };

    // ✅ check role
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // ✅ return decoded inside NextResponse
    return NextResponse.json({ id: decoded.id, role: decoded.role }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}