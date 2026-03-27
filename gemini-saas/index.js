import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Added

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Zual.AI Database Connected!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- DATABASE SCHEMA ---
const ListingSchema = new mongoose.Schema({
    productDescription: String,
    result: String,
    createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', ListingSchema);

// --- GEMINI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- ROUTE 1: GENERATE & SAVE ---
app.post('/api/generate', async (req, res) => {
    try {
        const { productDescription } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
            You are an expert Malaysian E-commerce Copywriter for Shopee and TikTok Shop.
            Product: "${productDescription}"
            
            Generate an engaging, SEO-optimized product listing in:
            1. English
            2. Bahasa Melayu (natural, conversational style)
            3. Simplified Chinese (targeting Malaysian Chinese buyers)
            
            Format the output clearly with headers.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textOutput = response.text();

        // SAVE TO DATABASE
        const newListing = new Listing({
            productDescription,
            result: textOutput
        });
        await newListing.save();
        console.log("💾 Saved new listing to Zual.AI History");

        res.json({ text: textOutput });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// --- ROUTE 2: FETCH HISTORY ---
app.get('/api/history', async (req, res) => {
    try {
        const history = await Listing.find().sort({ createdAt: -1 }).limit(15);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// Change the last lines to this:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Zual.AI Backend running on port ${PORT}`));