import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  title: String,
  url: { type: String, unique: true },
  source: String,
  date: Date,
  summary: String,
});

export default mongoose.model("Summary", summarySchema);
