import { Router } from "express";
import {
  setNotifcationRecieverEmail,
  setSlackWebHookUrl,
} from "../controllers/notification.controller.js";
import { checkAccessToken } from "../middlewares/jwtVerify.js";

const router = Router();

router.post(
  "/setReceivingEmail",
  checkAccessToken,
  setNotifcationRecieverEmail
);
router.post("/setSlackUrl", checkAccessToken, setSlackWebHookUrl);

export default router;
