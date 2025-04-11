import mongoose from "mongoose";

const billingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    planName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BillingHistory", billingHistorySchema);
