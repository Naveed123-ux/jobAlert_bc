import express from "express";
import {
  login,
  signUp,
  refreshToken,
  resendVerificationEmail,
  verifyEmail,
  logout,
  changePassword,
  updateName,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/signUp", signUp);
router.post("/logout/:id", logout);
router.get("/refreshToken", refreshToken);
router.get("/verifyEmail", verifyEmail);
router.put("/changeUsername/:id", updateName);
router.put("/updatePassword/:id", changePassword);

export default router;
