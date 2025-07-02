import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/news?category=business&q=apple
router.get("/news", async (req, res) => {
  const { category = "general", q = "" } = req.query;

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category,
        q,
        language: "en",
        pageSize: 30,
        apiKey: process.env.NEWS_API_KEY,
      },
      headers: {
        "User-Agent": "NewsDash/1.0", // important for 426 fix
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ NewsAPI fetch failed:", err?.response?.data || err.message);
    res.status(500).json({ error: "NewsAPI fetch failed" });
  }
});

export default router;
