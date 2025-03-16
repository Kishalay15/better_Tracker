import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserInfo,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUserInfo);

export default router;
