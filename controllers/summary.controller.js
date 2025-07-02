import Summary from "../models/summary.js";

// Save summary
export const saveSummary = async (req, res) => {
  const { title, url, summary, source, date } = req.body;

  if (!url || !summary) {
    return res.status(400).json({ error: "URL and summary are required." });
  }

  try {
    // Check if summary exists for this
    const existing = await Summary.findOne({ url, user: req.user.id });
    if (existing) return res.status(200).json(existing);

    // Save new summary for this user
    const newSummary = new Summary({
      title,
      url,
      summary,
      source,
      date,
      user: req.user.id,
    });
    const saved = await newSummary.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Failed to save summary." });
  }
};

// Get all summaries for current user
export const getSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user.id }).sort({ date: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summaries." });
  }
};
