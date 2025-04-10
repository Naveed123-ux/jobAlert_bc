import { getUserIdFromToken } from "../utils/auth.js";
import User from "../models/user.model.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import {
  updateSubscriptionStatus,
  determineTrialStatus,
} from "../utils/stripe.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    const { priceId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const plan = await mongoose.connection.db
      .collection("plans")
      .findOne({ priceId: priceId });

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const planName = plan.name;
    console.log(planName);
    const trialStatus = await determineTrialStatus(user);
    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        userId: userId,
        planName: planName,
      },
    };
    if (trialStatus.shouldStartTrial) {
      sessionConfig.subscription_data = {
        trial_period_days: trialStatus.trialDays,
      };
    }
    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err.message);
    const statusCode =
      err.message === "Authorization token is required" ||
      err.message === "Invalid or expired token"
        ? 401
        : 500;
    res.status(statusCode).json({ error: err.message });
  }
}

async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const userId = event.data.object.metadata.userId;
      const user = await User.findById(userId);
      if (user) {
        await updateSubscriptionStatus(user, event.type, event.data.object);
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

export { createCheckoutSession, stripeWebhook };
