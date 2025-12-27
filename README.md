VisualMeasure AI: AI-Powered Visual Product Measurement System

📋 Overview

VisualMeasure AI is a prototype system designed to extract objective, observable visual characteristics directly from product images. Unlike traditional categorization which relies on manual tagging or merchandising logic, this system uses a vision-enabled Large Language Model (LLM) to produce structured, floating-point measurements based purely on visual appearance.

This project was built to demonstrate how AI can quantify abstract visual concepts like "Visual Weight" or "Formality" into machine-readable data (JSON).

✨ Features

Multi-Dimensional Analysis: Scores products on a scale of -5.0 to +5.0 across five distinct visual dimensions.
Attribute Detection: Automatically detects physical attributes like wirecore visibility, frame geometry, transparency, and textures.

Dual Modes:
Dataset Mode: Parse and analyze lists of products from Excel (.xlsx) or CSV files.
Single Image Mode: Upload and analyze individual images for quick testing.
Structured Output: Returns data in a strict JSON format suitable for database integration.

📊 Visual Dimensions

The system evaluates products on the following independent scales (-5.0 to +5.0):
Gender Expression: Masculine (-5.0) ↔ Feminine (+5.0)
Visual Weight: Sleek/Light (-5.0) ↔ Bold/Heavy (+5.0)
Embellishment: Simple/Plain (-5.0) ↔ Ornate/Complex (+5.0)
Unconventionality: Classic/Timeless (-5.0) ↔ Avant-garde (-5.0)
Formality: Casual (-5.0) ↔ Formal (+5.0)

🛠️ Technical Stack

Frontend: React (v18), TypeScript, Vite
Styling: Tailwind CSS, Lucide React (Icons)
AI Integration: Google Gemini API (Multimodal Vision)
Data Parsing: SheetJS (XLSX) for Excel file processing

🚀 Getting Started

Prerequisites

Node.js (v16 or higher)
A Google Gemini API Key

Installation

Clone the repository
((https://github.com/Sujatajaiswal/visual-measure-ai/))

git clone [https://github.com/Sujatajaiswal/visual-measure-ai.git](https://github.com/Sujatajaiswal/visual-measure-ai.git)
cd visual-measure-ai


Install dependencies

npm install

Run the development server
npm run dev


Open in Browser
Navigate to http://localhost:5173 (or the URL shown in your terminal).

Configure API Key
Enter your Gemini API key in the src/App.tsx file (variable DEFAULT_API_KEY) or via the UI if configured.

🏗️ Design & Architecture (Deliverable #2)

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

📄 License

MIT
