import express from "express";
import { scrapeData, sendMessage } from "../controllers/scrape.controller.js";
const router = express.Router();

router.get("/scrapeData", scrapeData);
router.get("/sendMesaage", sendMessage);

export default router;
