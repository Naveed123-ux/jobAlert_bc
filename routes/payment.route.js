import express from "express";
import {
  createCheckoutSession,
  getBillingHistory,
  stripeWebhook,
} from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/checkout", createCheckoutSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
router.get("/billing", getBillingHistory);

export default router;
