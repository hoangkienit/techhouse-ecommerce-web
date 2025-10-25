import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserPayload } from "../interfaces/jwt.interface";

export const OptionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) return next();

    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as IUserPayload;
    req.user = payload;
  } catch (err) {
    // Ignore invalid or missing token for optional auth flow
  }

  return next();
};
