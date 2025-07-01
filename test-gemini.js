import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const prompt = "Summarize the French Revolution in 3 bullet points.";

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:predict?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      temperature: 0.7,
      maxOutputTokens: 256,
    }),
  });

  console.log("Status:", response.status);

  const rawText = await response.text();
  console.log("Raw response text:", rawText);

  try {
    const data = JSON.parse(rawText);
    console.log("✅ Gemini API Response:", data);
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err.message);
  }
}

test();
