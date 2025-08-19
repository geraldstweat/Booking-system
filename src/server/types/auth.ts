export type AuthUser = {
  id: string;
  role: "admin" | "customer";
};

export type AuthError = {
  error: string;
  status: number;
};

export type AuthResult = AuthUser | AuthError;