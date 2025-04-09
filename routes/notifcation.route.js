import { Router } from "express";
import { setNotifcationRecieverEmail } from "../controllers/notification.controller.js";

const router = Router();

router.post("/setReceivingEmail/:id", setNotifcationRecieverEmail);

export default router;
