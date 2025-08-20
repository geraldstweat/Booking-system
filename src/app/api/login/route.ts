import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import User, { IUser } from "../../../server/models/User";
import { connectDB } from "../../lib/mongodb";
import { generateToken } from "../../lib/jwt";

export async function POST(req: NextRequest) {
  try {
    let body: { email?: string; password?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid or missing JSON body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ explicitly typed
    const user = await User.findOne({ email }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken(String(user._id), user.role);
    // Don’t return the password
    const data = {
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    };

    return NextResponse.json(
      { message: "Login successful", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
