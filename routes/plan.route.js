import { Router } from "express";
import { getAllPlans } from "../controllers/plans.controler.js";

const router = Router();

router.get("/getAllPlans", getAllPlans);

export default router;
