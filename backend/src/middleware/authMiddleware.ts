import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface TokenPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;

      if (!decoded || !decoded.id) {
        const error = new Error("Not authorized, invalid token");
        res.status(401);
        return next(error);
      }

      req.user = { id: decoded.id };
      next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  } else {
    res.status(401);
    return next(new Error("Not authorized, no token provided"));
  }
};
