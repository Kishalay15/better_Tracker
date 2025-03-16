import { Request, Response } from "express";
import Income from "../models/Income.js";

export const addIncome = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: date ? new Date(date) : undefined,
    });

    const savedIncome = await newIncome.save();

    res.status(201).json({
      message: "Income added successfully",
      income: savedIncome,
    });
  } catch (error) {
    console.error("Add Income Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

export const getAllIncomes = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user?._id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    res.json(incomes);
  } catch (error) {
    console.error("Fetch incomes Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

export const deleteIncome = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;
  const incomeId = req.params.id;

  try {
    const deletedIncome = await Income.findOneAndDelete({
      _id: incomeId,
      userId,
    });

    if (!deletedIncome) {
      res.status(404).json({ message: "Income not found" });
      return;
    }

    res.status(200).json({
      message: "Income deleted successfully",
      income: deletedIncome,
    });
  } catch (error) {
    console.error("Delete Income Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};
