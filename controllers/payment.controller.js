import { getUserIdFromToken } from "../utils/auth.js";
import User from "../models/user.model.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import {
  updateSubscriptionStatus,
  determineTrialStatus,
} from "../utils/stripe.js";
import { generateInvoiceNumber } from "../utils/invoice.js";
import BillingHistory from "../models/billing.model.js";
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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const user = await User.findById(userId);

        if (user && session.payment_status === "paid") {
          const invoiceNumber = await generateInvoiceNumber();

          await BillingHistory.create({
            userId,
            invoiceNumber,
            date: new Date(),
            planName: session.metadata.planName,
            amount: session.amount_total / 100,
            status: "Paid",
          });

          await updateSubscriptionStatus(user, event.type, session);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const userId = invoice.metadata?.userId;

        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            const invoiceNumber = await generateInvoiceNumber();

            await BillingHistory.create({
              userId,
              invoiceNumber,
              date: new Date(invoice.created * 1000),
              planName:
                invoice.metadata?.planName || user.planName || "Unknown",
              amount: invoice.amount_paid / 100,
              status: "Paid",
            });

            await updateSubscriptionStatus(user, event.type, invoice);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const userId = invoice.metadata?.userId;

        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            const invoiceNumber = await generateInvoiceNumber();

            await BillingHistory.create({
              userId,
              invoiceNumber,
              date: new Date(invoice.created * 1000),
              planName:
                invoice.metadata?.planName || user.planName || "Unknown",
              amount: invoice.amount_due / 100,
              status: "Failed",
            });

            await updateSubscriptionStatus(user, event.type, invoice);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Webhook processing error: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getBillingHistory(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const billingHistory = await BillingHistory.find({ userId }).lean();
    const formattedBillingHistory = billingHistory.map((record) => ({
      ...record,
      date: new Date(record.date).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    }));

    res.status(200).json({
      data: formattedBillingHistory,
    });
  } catch (err) {
    console.error(`Error fetching billing history: ${err.message}`);
    const statusCode =
      err.message === "Authorization token is required" ||
      err.message === "Invalid or expired token"
        ? 401
        : 500;
    res.status(statusCode).json({ error: err.message });
  }
}
export { createCheckoutSession, stripeWebhook, getBillingHistory };
