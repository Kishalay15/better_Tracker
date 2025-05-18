import { Request, Response } from "express";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { Types } from "mongoose";

interface MonthlyDataItem {
  year: number;
  month: number;
  monthName: string;
  income: number;
  expense: number;
  balance: number;
}

export const getMonthlyComparison = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;

  try {
    const currentDate = new Date();

    const startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const monthlyData: MonthlyDataItem[] = [];

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);

      monthlyData.push({
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
        monthName: monthDate.toLocaleString("en-US", { month: "short" }),
        income: 0,
        expense: 0,
        balance: 0,
      });
    }

    const incomeData = await Income.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const expenseData = await Expense.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
    ]);
    incomeData.forEach((item) => {
      const monthIndex = monthlyData.findIndex(
        (m) => m.year === item._id.year && m.month === item._id.month - 1
      );

      if (monthIndex !== -1) {
        monthlyData[monthIndex].income = item.total;
      }
    });

    expenseData.forEach((item) => {
      const monthIndex = monthlyData.findIndex(
        (m) => m.year === item._id.year && m.month === item._id.month - 1
      );

      if (monthIndex !== -1) {
        monthlyData[monthIndex].expense = item.total;
      }
    });

    monthlyData.forEach((item) => {
      item.balance = item.income - item.expense;
    });

    const result = monthlyData.map((item) => ({
      month: item.monthName,
      income: item.income,
      expense: item.expense,
      balance: item.balance,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching monthly comparison data:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve monthly comparison data" });
  }
};

export const getCategoryBreakdown = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;

  try {
    const categoryData = await Expense.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          total: 1,
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.status(200).json(categoryData);
  } catch (error) {
    console.error("Error fetching category breakdown data:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve category breakdown data" });
  }
};

export const getIncomeBreakdown = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user._id;

  try {
    const sourceData = await Income.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$source",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          source: "$_id",
          total: 1,
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.status(200).json(sourceData);
  } catch (error) {
    console.error("Error fetching income breakdown data:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve income breakdown data" });
  }
};
