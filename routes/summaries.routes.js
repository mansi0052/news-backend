// routes/summaries.routes.js
import express from "express";
import Summary from "../models/summary.js";

const router = express.Router();

// 🔹 GET summary by ID (optional)
router.get("/:id", async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ error: "Summary not found" });
    res.json(summary);
  } catch (err) {
    console.error("❌ Fetch by ID error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// 🔹 GET all summaries
router.get("/", async (req, res) => {
  try {
    const all = await Summary.find().sort({ date: -1 });
    res.json(all);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});

// 🔹 POST a new summary
router.post("/", async (req, res) => {
  const { title, url, source, date, summary } = req.body;

  try {
    // Prevent duplicates
    const exists = await Summary.findOne({ url });
    if (exists) return res.status(400).json({ error: "Summary already saved." });

    const newSummary = new Summary({ title, url, source, date, summary });
    await newSummary.save();

    res.status(201).json(newSummary);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Failed to save summary" });
  }
});

// 🔹 DELETE summary by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Summary.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// 🔹 PATCH (update) summary text
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Summary.findByIdAndUpdate(
      req.params.id,
      { $set: { summary: req.body.summary } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
