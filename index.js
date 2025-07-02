import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import summariesRouter from "./routes/summaries.routes.js";
import newsRouter from "./routes/news.routes.js"; // ⬅️ your new route

dotenv.config();

const app = express();

// CORS setup
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",       // local dev
  "http://localhost:5174",
  "http://localhost:5180",
  "https://news-frontend-rosy.vercel.app",  // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());

// MongoDB connection
if (!process.env.MONGO_URI || !process.env.API_KEY || !process.env.NEWS_API_KEY) {
  console.error("❌ Missing env vars.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => res.send("✅ API is running"));
app.post("/api/summarize", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
        }),
      }
    );

    const rawText = await geminiRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(500).json({ error: "Malformed JSON from Gemini" });
    }

    if (data.error || !data.candidates?.[0]?.output) {
      return res.status(200).json({
        summary: "• This is a test summary\n• Check Gemini API\n• Fallback used",
      });
    }

    res.json({ summary: data.candidates[0].output });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

app.use("/api/summaries", summariesRouter);
app.use("/api/news", newsRouter); // ⬅️ Register proxy route for NewsAPI

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
