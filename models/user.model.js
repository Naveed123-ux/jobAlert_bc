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
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
