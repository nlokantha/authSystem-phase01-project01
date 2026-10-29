

type RequestUserRole = "USER" | "ADMIN"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: RequestUserRole;
      };
    }
  }
}

export {};
