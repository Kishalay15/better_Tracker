import { Request, Response } from "express";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import { isValidObjectId, Types } from "mongoose";

export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId || !isValidObjectId(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const [totalIncome] = await Income.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [totalExpense] = await Expense.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (income) => ({
          ...income.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (expense) => ({
          ...expense.toObject(),
          type: "expense",
        })
      ),
    ]
      .sort(
        (a, b) =>
          new Date(b.date as any).getTime() - new Date(a.date as any).getTime()
      )
      .slice(0, 5);

    res.status(200).json({
      totalBalance: (totalIncome?.total || 0) - (totalExpense?.total || 0),
      totalIncome: totalIncome?.total || 0,
      totalExpense: totalExpense?.total || 0,
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
