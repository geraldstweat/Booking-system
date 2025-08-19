import jwt, { Secret, SignOptions } from "jsonwebtoken";

export function generateToken(userId: string, role: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env.local");
  }

  // Make sure expiresIn is a valid string or number (defaulting to "1d")
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  // Cast to a valid type
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'], // Cast it directly to the right type
  };

  return jwt.sign(
    { id: userId, role },       // payload
    secret as Secret,           // cast correctly
    options                     // correctly typed SignOptions
  );
}