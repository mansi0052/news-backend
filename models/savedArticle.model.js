import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  source: String,
  summary: String,
  url: String,
  date: String,
});

export default mongoose.model("SavedArticle", savedArticleSchema);
