import express from "express";
import authRoutes from "./auth.route.js";
import scrapeRoutes from "./scraper.routes.js";
import filterRoutes from "./filter.route.js";
import notificationRoutes from "./notifcation.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/scrape", scrapeRoutes);
router.use("/filter", filterRoutes);
router.use("/notification", notificationRoutes);

export default router;
