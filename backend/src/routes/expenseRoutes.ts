import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
} from "../controllers/expenseController";

const router = Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.delete("/:id", protect, deleteExpense);

export default router;
