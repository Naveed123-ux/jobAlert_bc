import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: "",
    },

    verificationExpiryDate: {
      type: Date,
      default: "",
    },
    currentPlan: { type: String, default: null },
    subscriptionId: { type: String, default: "" },
    trialStart: { type: Date, default: null },
    trialEnd: { type: Date, default: null },
    isTrialActive: { type: Boolean, default: false },
    subscriptionStart: { type: Date, default: null },
    subscriptionEnd: { type: Date, default: null },
    isSubscribed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
