import mongoose from "mongoose";

const savedSummarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String },
  summary: { type: String, required: true },
  date: { type: String },
  url: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const SavedSummary = mongoose.model("SavedSummary", savedSummarySchema);

export default SavedSummary;
