import jwt from "jsonwebtoken";

type AuthResult =
  | { decoded: { id: string; role: string }; error?: undefined }
  | { decoded?: undefined; error: Response };

export const verifyAuth = (req: Request, roles: string[] = []): AuthResult => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return { error: new Response(JSON.stringify({ message: "No token" }), { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

    if (roles.length && !roles.includes(decoded.role)) {
      return { error: new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 }) };
    }

    return { decoded };
  } catch {
    return { error: new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 }) };
  }
};