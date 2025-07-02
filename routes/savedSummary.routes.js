import express from "express";
import { saveSummary, getSummaries } from "../controllers/savedSummary.controller.js";

const router = express.Router();

router.post("/summaries", saveSummary);
router.get("/summaries", getSummaries);

export default router;
