import { NextRequest } from "next/server";
import { AuthResult, AuthUser } from "../types/auth";
import jwt from "jsonwebtoken"; // if you're using JWT

export async function verifyAuth(
  req: NextRequest,
  allowedRoles: string[]
): Promise<AuthResult> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { error: "Missing or invalid token", status: 401 };
    }

    const token = authHeader.replace("Bearer ", "");

    // 🔑 Example decode (replace with your real logic)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;

    if (!allowedRoles.includes(decoded.role)) {
      return { error: "Forbidden", status: 403 };
    }

    return decoded;
  } catch (err) {
    return { error: "Unauthorized", status: 401 };
  }
}