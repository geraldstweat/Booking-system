export type AuthUser = {
  id: string;
  role: string;
};

export type AuthError = {
  error: string;
  status: number;
};

export type AuthResult = AuthUser | AuthError;