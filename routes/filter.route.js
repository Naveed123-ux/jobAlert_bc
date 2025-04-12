import { Router } from "express";

import {
  addFilter,
  getFilters,
  updateFilter,
  activateOrDeactivateFilter,
  deleteFilter,
  getSpecificFilter,
} from "../controllers/jobFilter.controller.js";
import { checkAccessToken } from "../middlewares/jwtVerify.js";

const router = Router();

router.post("/addFilter", checkAccessToken, addFilter);
router.put("/updateFilter/:id", checkAccessToken, updateFilter);
router.get("/getFilters", checkAccessToken, getFilters);
router.put("/activateOrDeactivateFilter/:id", activateOrDeactivateFilter);
router.delete("/deleteFilter/:id", deleteFilter);
router.get("/getSpecificFilter/:id", getSpecificFilter);

export default router;
