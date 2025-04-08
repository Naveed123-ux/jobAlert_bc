import express from "express";
import { scrapeData } from "../controllers/scrape.controller.js";
const router = express.Router();

router.get("/scrapeData", scrapeData);

export default router;
