import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "../../lib/mongodb";
import User from "../../../server/models/User";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    const tokenString = Array.isArray(token) ? token[0] : token;
    const payload = jwt.verify(tokenString, process.env.JWT_SECRET as string) as TokenPayload;

    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.redirect("/already-verified");

    user.isVerified = true;
    await user.save();

    return res.redirect("/verified-success");
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
}