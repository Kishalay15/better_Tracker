import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addIncome,
  getAllIncomes,
  deleteIncome,
} from "../controllers/incomeController.js";

const router = Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncomes);
router.delete("/:id", protect, deleteIncome);

export default router;
