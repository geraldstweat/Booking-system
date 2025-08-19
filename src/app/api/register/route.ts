import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../server/models/User";
import { connectDB } from "../../lib/mongodb";

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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save new user (ONLY once)
    await User.create({
      email,
      password: hashedPassword,
      role: "customer"
    });

    return NextResponse.json(
      { message: "Account created! You can now login." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}