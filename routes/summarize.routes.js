import express from "express";
import { summarizeArticle } from "../controllers/summarize.controller.js";

const router = express.Router();
router.post("/summarize", summarizeArticle);
export default router;
