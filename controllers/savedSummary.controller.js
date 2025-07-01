// controllers/savedSummary.controller.js
import SavedSummary from "../models/savedSummary.model.js";

// POST /api/summaries
export const saveSummary = async (req, res) => {
  try {
    const { title, source, summary, date, url } = req.body;

    if (!title || !summary) {
      return res.status(400).json({ error: "Title and summary are required." });
    }

    const newEntry = new SavedSummary({ title, source, summary, date, url });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    console.error("❌ Save Summary Error:", err);
    res.status(500).json({ error: "Failed to save summary." });
  }
};

// GET /api/summaries
export const getSummaries = async (req, res) => {
  try {
    const summaries = await SavedSummary.find().sort({ date: -1 });
    res.status(200).json(summaries);
  } catch (err) {
    console.error("❌ Fetch Summaries Error:", err);
    res.status(500).json({ error: "Failed to fetch summaries." });
  }
};
