import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = Router();

router.get("/", protect, getDashboardData);

export default router;
