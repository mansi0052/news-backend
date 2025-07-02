// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import summarizeRoute from './routes/summarize.routes.js';
import savedSummaryRoutes from './routes/savedSummary.routes.js'; // optional
import summaryRoutes from './routes/summaries.routes.js';

//environment variables
dotenv.config();

//Log environment variables
console.log("🔍 Loaded ENV:");
console.log("MONGO_URI:", process.env.MONGO_URI || "❌ MONGO_URI missing");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ GEMINI_API_KEY missing");

//if missing required env vars
if (!process.env.MONGO_URI || !process.env.GEMINI_API_KEY) {
  console.error("❌ Missing MONGO_URI or GEMINI_API_KEY in .env");
  process.exit(1);
}

const app = express();

//Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

//MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

//Routes
app.use('/api/summarize', summarizeRoute);
app.use('/api/summaries', summaryRoutes);
app.use('/api/saved', savedSummaryRoutes);

//Health route
app.get('/', (req, res) => {
  res.send('✅ Gemini summarizer backend is running');
});

//Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Gemini backend running at http://localhost:${PORT}`);
});
