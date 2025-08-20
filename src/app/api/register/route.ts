import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../../../server/models/User";
import { connectDB } from "../../lib/mongodb";

interface RegisterRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as RegisterRequestBody;
    const token = crypto.randomBytes(32).toString("hex");
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or SMTP config
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to: email,
      subject: "Verify your email",
      html: `
    <h1>Welcome to Our App!</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="https://yourdomain.com/verify?token=${token}">Verify Email</a>
  `,
    });

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
      role: "customer",
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


// import type { NextApiRequest, NextApiResponse } from "next";
// import jwt from "jsonwebtoken";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/server/models/User";
// import sendEmail from "@/utils/sendEmail"; // utility we'll build

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     await connectDB();
//     const { email, password } = req.body;

//     // Create user
//     const user = new User({ email, password, isVerified: false });
//     await user.save();

//     // Generate verification token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1h" }
//     );

//     const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`;

//     // Send email
//     await sendEmail(
//       user.email,
//       "Verify Your Email",
//       `<p>Click <a href="${verificationUrl}">here</a> to verify your account.</p>`
//     );

//     return res.status(200).json({ message: "Registration successful. Check your email to verify your account." });
//   } catch (err) {
//     console.error("Registration error:", err);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// }