// controllers/summarize.controller.js
export const summarizeArticle = async (req, res) => {
  const { prompt } = req.body;

  console.log("📥 Received prompt:", prompt);

  if (!prompt) {
    console.log("⛔ Missing prompt");
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const summary = `• This is a dummy summary point 1\n• This is a dummy summary point 2\n• This is a dummy summary point 3`;
    
    console.log("✅ Sending dummy summary");
    return res.status(200).json({ summary });
  } catch (err) {
    console.error("❌ Summarization error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
