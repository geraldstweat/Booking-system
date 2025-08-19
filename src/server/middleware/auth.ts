import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export type AuthSuccess = {
  id: string;
  role: "customer" | "admin";
};

export type AuthError = {
  status: number;
  error: string;
};

export type AuthResult = AuthSuccess | AuthError;

export async function verifyAuth(
  req: NextRequest,
  allowedRoles: ("customer" | "admin")[]
): Promise<AuthResult> {
  try {
    // Grab the token (assuming "Authorization: Bearer <token>")
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { status: 401, error: "Missing or invalid token" };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return { status: 401, error: "Token missing" };
    }

    // Verify the JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not set");
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: "customer" | "admin";
    };

    // Check role
    if (!allowedRoles.includes(decoded.role)) {
      return { status: 403, error: "Forbidden" };
    }

    // ✅ Success
    return { id: decoded.id, role: decoded.role };
  } catch (err) {
    return { status: 401, error: "Unauthorized" };
  }
}
