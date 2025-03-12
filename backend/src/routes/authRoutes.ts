import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserInfo,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUserInfo);

export default router;
