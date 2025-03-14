import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface IUserInput {
  name: string;
  email: string;
  password: string;
}

export const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// signup
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body as IUserInput;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      user,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

// login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as IUserInput;

  if (!email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      id: user._id.toString(),
      user,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

// fetch
export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};
