import jwt from "jsonwebtoken";

export const generateToken = (userId: string, role: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env.local");
  }
  return jwt.sign(
    { id: userId, role }, // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};