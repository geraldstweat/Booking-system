export type AuthUser = {
  id: string;
  role: "admin" | "customer"; // tighten up roles
};

export type AuthError = {
  error: string;
  status: number;
};

export type AuthResult = AuthUser | AuthError;