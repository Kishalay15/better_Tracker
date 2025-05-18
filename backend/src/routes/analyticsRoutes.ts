import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMonthlyComparison,
  getCategoryBreakdown,
  getIncomeBreakdown,
} from "../controllers/analyticsController.js";

const router = Router();

//income vs expense
router.get("/monthly-comparison", protect, getMonthlyComparison);

// expense
router.get("/category-breakdown", protect, getCategoryBreakdown);

// income
router.get("/income-breakdown", protect, getIncomeBreakdown);

export default router;
