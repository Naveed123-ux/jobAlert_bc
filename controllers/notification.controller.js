import User from "../models/user.model.js";
import Notification from "../models/notifcation.model.js";

export async function setNotifcationRecieverEmail(req, res) {
  const { id } = req.params;
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
