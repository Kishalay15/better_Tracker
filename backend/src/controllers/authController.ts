import { Request, Response } from "express";
import jwt from "jsonwebtoken";

//shhhhhhhhhhhhh
export const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//signup
export const registerUser = async (req: Request, res: Response) => {
  // Implementation will go here
};

//login
export const loginUser = async (req: Request, res: Response) => {
  // Implementation will go here
};

//fetch
export const getUserInfo = async (req: Request, res: Response) => {
  // Implementation will go here
};
