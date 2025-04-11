import { Router } from "express";
import {
  setNotifcationRecieverEmail,
  setSlackWebHookUrl,
  toggleEmailNotifications,
  toggleSlackNotifications,
  getUserRelatedNotifcations,
} from "../controllers/notification.controller.js";
import { checkAccessToken } from "../middlewares/jwtVerify.js";

const router = Router();

router.post(
  "/setReceivingEmail",
  checkAccessToken,
  setNotifcationRecieverEmail
);
router.put("/toggleEmailNotifications/:id", toggleEmailNotifications);
router.put("/toggleSlackNotifications/:id", toggleSlackNotifications);
router.get(
  "/getUserRelatedNotifcations",
  checkAccessToken,
  getUserRelatedNotifcations
);
router.post("/setSlackUrl", checkAccessToken, setSlackWebHookUrl);

export default router;
