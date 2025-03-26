import express from "express";
import {
  login,
  signUp,
  refreshToken,
  resendVerificationEmail,
  verifyEmail,
  logout,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/login", login);
router.post("/signUp", signUp);
router.get("/logout/:id", logout);
router.get("/refreshToken", refreshToken);
router.get("/verifyEmail", verifyEmail);

export default router;
