import mongoose, { Schema } from "mongoose";

const notficationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recievingEmail: {
      type: String,
      required: true,
    },
    emailNotifications: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notficationSchema);
