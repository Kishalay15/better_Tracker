import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addIncome,
  getAllIncomes,
  deleteIncome,
} from "../controllers/incomeController";

const router = Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncomes);
router.delete("/:id", protect, deleteIncome);

export default router;
