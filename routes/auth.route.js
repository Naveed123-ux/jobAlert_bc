import express from "express";
import {
  login,
  signUp,
  refreshToken,
  resendVerificationEmail,
  resetPassword,
  forgotPassowrd,
  verifyResetPasswordLink,
  verifyEmail,
  logout,
  changePassword,
  updateName,
} from "../controllers/auth.controller.js";
import { checkAccessToken } from "../middlewares/jwtVerify.js";
const router = express.Router();

router.post("/login", login);
router.post("/signUp", signUp);
router.post("/logout/:id", logout);
router.get("/refreshToken", refreshToken);
router.get("/verifyEmail", verifyEmail);
router.put("/changeUsername", checkAccessToken, updateName);
router.put("/updatePassword", checkAccessToken, changePassword);
router.get("/forgotPassword", forgotPassowrd);
router.get("/verifyToken", verifyResetPasswordLink);
router.put("/resetPassword", resetPassword);

export default router;
