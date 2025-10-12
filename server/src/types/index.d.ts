import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      userId: string;
      fullname: string;
      email: string;
      role?: string;
    }

    interface Request {
      user?: UserPayload; 
    }
  }
}

export {};
