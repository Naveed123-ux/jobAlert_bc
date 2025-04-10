import User from "../models/user.model.js";
import Notification from "../models/notifcation.model.js";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
export async function setNotifcationRecieverEmail(req, res) {
  const { id } = req.user;
  const { email } = req.body;
  if (!id || !email) {
    return res.status(400).json({
      success: false,
      message: "id and email are required",
    });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const notificationReciever = await Notification.findOne({
      userId: id,
    });
    if (notificationReciever) {
      notificationReciever.recievingEmail = email;

      await notificationReciever.save();
      return res.status(200).json({
        success: true,
        message: "Notification reciever email updated successfully",
      });
    }
    const newNotificationReciever = new Notification({
      userId: id,
      recievingEmail: email,
    });
    await newNotificationReciever.save();
    return res.status(200).json({
      success: true,
      message: "Notification reciever email set successfully",
    });
  } catch (error) {
    console.error("Error setting notification reciever email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function toggleEmailNotifications(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id and receive are required",
    });
  }
  try {
    const Notification = await Notification.findById(id);
    if (!Notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    Notification.emailNotifications = !Notification.emailNotifications;
    await Notification.save();
    return res
      .status(200)
      .json({ success: true, message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function setSlackWebHookUrl(req, res) {
  const { id } = req.user;
  const { slackWebHookUrl } = req.body;
  if (!slackWebHookUrl || !id) {
    return res.status(400).json({
      success: false,
      message: "id and slackWebHookUrl are required",
    });
  }
  try {
    const notifcation = await Notification.findOne({ userId: id });
    if (!notifcation) {
      await Notification.create({
        userId: id,
        slackWebHookUrl: slackWebHookUrl,
        slackNotifications: true,
      });
      return res.status(200).json({
        success: true,
        message: "Slack WebHook URL set successfully",
      });
    }
    notifcation.slackWebHookUrl = slackWebHookUrl;
    notifcation.slackNotifications = true;
    await notifcation.save();
    return res.status(200).json({
      success: true,
      message: "Slack WebHook URL updated successfully",
    });
  } catch (error) {
    console.error("Error setting Slack WebHook URL:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function toggleSlackNotifications(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id  is required",
    });
  }
  try {
    const notifcation = await Notification.findOne({ userId: id });
    if (!notifcation) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    notifcation.slackNotifications = !notifcation.slackNotifications;
    await notifcation.save();
    return res.status(200).json({
      success: true,
      message: "Slack notification updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// async function saveUserToDatabase(chatId, id) {
//   try {
//     const notifcation = await Notification.findOne({ userId: id });
//     if (!notifcation) {
//       const newNotification = new Notification({
//         userId: id,
//         telegramChatId: chatId,
//         telegramNotifications: true,
//       });
//       await newNotification.save();
//     }
//     notifcation.telegramChatId = chatId;
//     notifcation.telegramNotifications = true;
//     await notifcation.save();
//   } catch (error) {
//     console.error("Error saving user to database:", error.message);
//     throw new Error("Failed to save user to database");
//   }
// }

// bot.start(async (ctx) => {
//   const chatId = ctx.chat.id;
//   const username = ctx.from.username;
//   const id = ctx.payload;

//   await saveUserToDatabase(chatId, id);

//   ctx.reply(`You're now subscribed to job alerts on Telegram! ✅`);
// });

// bot.launch();
