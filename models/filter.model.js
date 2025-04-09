import mongoose, { Schema } from "mongoose";
import { jobCategoryEnum } from "../constants/enum.js";

const filterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    categories: {
      type: [String],
      enum: jobCategoryEnum,
      required: true,
    },
    searchTerms: {
      type: [String],
      required: true,
    },
    projectType: {
      type: String,
      enum: ["Fixed", "Hourly", "both"],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    minHourlyRate: {
      type: Number,
      required: true,
    },
    maxHourlyRate: {
      type: Number,
      required: true,
    },
    minFixedPrice: {
      type: Number,
      required: true,
    },
    maxFixedPrice: {
      type: Number,
      required: true,
    },
    experienceLevel: {
      type: [String],
      enum: ["1", "2", "3"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Filter", filterSchema);
