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
      default: true,
    },
    telegramChatId: {
      type: String,
    },
    telegramNotifications: {
      type: Boolean,
    },
    slackWebHookUrl: {
      type: String,
    },
    slackNotifications: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notficationSchema);
