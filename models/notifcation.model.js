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
      default: "",
    },
    emailNotifications: {
      type: Boolean,
    },
    telegramChatId: {
      type: String,
      default: "",
    },
    telegramNotifications: {
      type: Boolean,
    },
    slackWebHookUrl: {
      type: String,
      default: "",
    },
    slackNotifications: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notficationSchema);
