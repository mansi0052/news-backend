// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import summariesRouter from "./routes/summaries.routes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://news-frontend-rosy.vercel.app/",
  credentials: true
}));

app.use(express.json());

//environment variables
if (!process.env.MONGO_URI || !process.env.API_KEY) {
  console.error("❌ Missing MONGO_URI or API_KEY in .env");
  process.exit(1);
}

//MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// root
app.get("/", (req, res) => res.send("✅ API is running"));

//Summarize route
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
    console.log("🔍 Raw Gemini Response Text:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      return res.status(500).json({ error: "Malformed JSON from Gemini API" });
    }

    //Summary
    if (data.error || !data.candidates?.[0]?.output) {
      console.warn("⚠️ Gemini failed. Using dummy summary.");
      return res.status(200).json({
        summary:
          "• This is a test summary line 1\n• This is a test summary line 2\n• This is a test summary line 3",
      });
    }

    const summary = data.candidates[0].output;
    res.json({ summary });
  } catch (err) {
    console.error("❌ Summarization error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/summaries", summariesRouter);

//Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
