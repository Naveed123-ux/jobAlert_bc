import mongoose, { Schema } from "mongoose";

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
