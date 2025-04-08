import { Router } from "express";

import {
  addFilter,
  getFilters,
  updateFilter,
  activateOrDeactivateFilter,
  deleteFilter,
} from "../controllers/jobFilter.controller.js";

const router = Router();

router.post("/addFilter", addFilter);
router.put("/updateFilter/:id", updateFilter);
router.get("/getFilters/:userId", getFilters);
router.put("/activateOrDeactivateFilter/:id", activateOrDeactivateFilter);
router.delete("/deleteFilter/:id", deleteFilter);

export default router;
