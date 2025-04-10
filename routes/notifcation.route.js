import { Router } from "express";
import {
  setNotifcationRecieverEmail,
  setSlackWebHookUrl,
} from "../controllers/notification.controller.js";

const router = Router();

router.post("/setReceivingEmail/:id", setNotifcationRecieverEmail);
router.post("/setSlackUrl/:id", setSlackWebHookUrl);

export default router;
