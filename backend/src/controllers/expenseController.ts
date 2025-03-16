import { Request, Response } from "express";
import Expense from "../models/Expense.js";

export const addExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount) {
      res.status(400).json({ message: "Please enter all required fields" });
      return;
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: date ? new Date(date) : undefined,
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense: savedExpense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user?._id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error("Fetch expenses Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;
  const expenseId = req.params.id;

  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId,
    });

    if (!deletedExpense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.status(200).json({
      message: "Expense deleted successfully",
      expense: deletedExpense,
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};
