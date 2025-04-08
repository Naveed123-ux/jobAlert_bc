import express from "express";
import authRoutes from "./auth.route.js";
import scrapeRoutes from "./scraper.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/scrape", scrapeRoutes);

export default router;
