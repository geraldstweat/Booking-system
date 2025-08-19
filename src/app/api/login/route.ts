import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../server/models/User";
import { connectDB } from "../../../lib/mongodb";
import { generateToken } from "../../../lib/jwt";  // ✅ import helper

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
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

    // ✅ Generate JWT using utility
    const token = generateToken(user._id.toString(), user.role);

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