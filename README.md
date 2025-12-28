VisualMeasure AI: AI-Powered Visual Product Measurement System

📋 Overview

VisualMeasure AI is a prototype system designed to extract objective, measurable visual attributes directly from product images.
Unlike traditional catalog tagging that relies on manual labeling, this system uses AI-powered vision models to analyze visual characteristics and convert them into structured, numerical insights.
It enables brands, designers, and researchers to quantify subjective attributes such as formality, visual weight, and style in a consistent, machine-readable format.

✨ Features

Multi-Dimensional Visual Analysis
Evaluates each product on multiple visual dimensions using a standardized scale from –5.0 to +5.0.

🔹 Automatic Attribute Detection
Identifies attributes such as:
Frame geometry
Texture and finish
Rim structure
Color composition
Visual complexity

🔹 Dual Analysis Modes
Dataset Mode – Upload CSV/Excel files to analyze large product collections.
Single Image Mode – Upload an image to instantly analyze visual attributes.

🔹 Structured Output
Clean, consistent JSON-based output
Easy to store, compare, and integrate into databases or analytics pipelines

📊 Visual Dimensions

The system evaluates products on the following independent scales (-5.0 to +5.0):
Gender Expression: Masculine (-5.0) ↔ Feminine (+5.0)
Visual Weight: Sleek/Light (-5.0) ↔ Bold/Heavy (+5.0)
Embellishment: Simple/Plain (-5.0) ↔ Ornate/Complex (+5.0)
Unconventionality: Classic/Timeless (-5.0) ↔ Avant-garde (-5.0)
Formality: Casual (-5.0) ↔ Formal (+5.0)

🛠️ Technical Stack
Frontend
React.js – UI framework
TypeScript – Type safety
Vite – Fast build tool
Tailwind CSS – Styling
Lucide Icons – UI icons

Backend / Processing
Node.js + Express – API & proxy server
Google Gemini Vision API – Image understanding & analysis
SheetJS (xlsx) – Excel & CSV parsing

🚀 Getting Started

Prerequisites

Node.js (v16 or higher)
A Google Gemini API Key

Installation

git clone https://github.com/Sujatajaiswal/visual-measure-ai.git
cd visual-measure-ai
npm install

Install dependencies
npm install

Run the development server
npm run dev

Open in Browser
Navigate to http://localhost:5173 (or the URL shown in your terminal).

Configure API Key
.env
VITE_GEMINI_API_KEY=your_api_key_here


🏗️ Design & Architecture (Deliverable #2)
User Image
   ↓
React UI
   ↓
Node.js Proxy (CORS Handling)
   ↓
Gemini Vision API
   ↓
AI Analysis (JSON Output)
   ↓
Visual Dashboard

High-Level Architecture
The application is built as a Client-Side SPA (Single Page Application). It interacts directly with the AI provider's API from the browser.
Input Layer: React components handle file parsing (CSV/Excel) and image conversion (Blob to Base64).
Processing Layer: A prompt engineering layer constructs a strict system prompt that enforces JSON schema outputs from the vision model.
Presentation Layer: The JSON response is parsed and mapped to visual UI components (Score Bars, Attribute Boxes).

Key Decisions

Prompt Engineering vs. Fine-Tuning: A "Zero-shot" prompting strategy was chosen using a robust system prompt. This allows for rapid iteration on the definition of visual dimensions without retraining a model.
Client-Side Processing: To keep the architecture simple for this prototype, images are processed in the browser. A proxy service (allorigins) is used as a fallback to handle CORS issues when fetching remote image URLs from datasets.

Limitations

Latency: Please Note: The visual measurement analysis involves complex image processing by the LLM. Generation times can be a little slow (typically 3–8 seconds per image) depending on API load and image resolution.

Non-Determinism: As with all LLMs, running the analysis on the exact same image twice may yield slightly different floating-point scores (e.g., 2.4 vs 2.5), though the semantic reasoning usually remains consistent.

🔮 Future Improvements

Batch Processing Queue: Implement a backend queue (Redis/Bull) to handle bulk dataset processing asynchronously.
caching: Cache analysis results by Image Hash to prevent re-analyzing the same image.
Confidence Scores: Request the model to output a confidence interval for its measurements.
Deployment (Vercel / Netlify + Cloud Functions)

📄 License
This project is licensed under the MIT License.
