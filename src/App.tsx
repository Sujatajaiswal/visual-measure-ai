import React, { useState, useEffect } from "react";
import {
  Upload,
  BarChart2,
  ChevronRight,
  Loader2,
  Eye,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import { Product, AnalysisResult } from "./types";
import ProductCard from "./components/ProductCard";
import ResultsDisplay from "./components/ResultsDisplay";

// --- Constants & Prompts ---

const SYSTEM_PROMPT = `
You are a Visual Product Measurement System. Your goal is to analyze product images and output objective, structured visual data.
Do NOT infer merchandising logic, sales potential, or user intent. Focus ONLY on observable visual characteristics.

Analyze the image based on the following dimensions. Return the result in pure JSON format.

1. VISUAL DIMENSIONS (Scale: -5.0 to +5.0)
   - Gender Expression: -5.0 (Masculine) to +5.0 (Feminine). 0 is Unisex.
   - Visual Weight: -5.0 (Sleek/Light/Minimal) to +5.0 (Bold/Heavy/Chunky).
   - Embellishment: -5.0 (Simple/Plain) to +5.0 (Ornate/Complex).
   - Unconventionality: -5.0 (Classic/Timeless) to +5.0 (Avant-garde/Weird).
   - Formality: -5.0 (Casual) to +5.0 (Formal).

2. OBSERVABLE ATTRIBUTES
   - Detect: Visible wirecore (boolean), Frame geometry (string), Transparency/Opacity (string), Dominant colors (array), Visible textures (string), Suitable for kids (boolean - based on size/colors).

RESPONSE FORMAT (JSON ONLY):
{
  "measurements": {
    "genderExpression": { "score": 0.0, "reasoning": "Reasoning for gender score..." },
    "visualWeight": { "score": 0.0, "reasoning": "Reasoning for visual weight..." },
    "embellishment": { "score": 0.0, "reasoning": "Reasoning for embellishment..." },
    "unconventionality": { "score": 0.0, "reasoning": "Reasoning for unconventionality..." },
    "formality": { "score": 0.0, "reasoning": "Reasoning for formality..." }
  },
  "attributes": {
    "wirecore": false,
    "geometry": "...",
    "transparency": "...",
    "dominantColors": ["..."],
    "texture": "...",
    "suitableForKids": false
  },
  "metadata": {
    "visualDescription": "Brief objective description of the item."
  }
}
`;

// --- Configuration ---

// TODO: PASTE YOUR API KEY HERE if you want to save it permanently.
const DEFAULT_API_KEY = "AIzaSyD33hT-y0AQaZSKDj4cYHl3kn2C4IjO0JU";

export default function App() {
  const [apiKey] = useState(DEFAULT_API_KEY);
  const [activeTab, setActiveTab] = useState<"dataset" | "single">("dataset");

  // Dataset State
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Single Image State
  const [singleImage, setSingleImage] = useState<string | null>(null);
  const [singleImagePreview, setSingleImagePreview] = useState<string | null>(
    null
  );

  // Analysis State
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelLibLoaded, setExcelLibLoaded] = useState(false);

  // --- Effects ---

  // Load SheetJS library for parsing Excel files
  useEffect(() => {
    if (!window.XLSX) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.async = true;
      script.onload = () => setExcelLibLoaded(true);
      document.body.appendChild(script);
    } else {
      setExcelLibLoaded(true);
    }
  }, []);

  // --- Handlers ---

  const handleDatasetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset current state
    setProducts([]);
    setSelectedProduct(null);
    setError(null);

    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (isExcel) {
      if (!window.XLSX && !excelLibLoaded) {
        setError(
          "Excel parser is still loading. Please wait a second and try again."
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        try {
          const workbook = window.XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0]; // Assume first sheet
          const sheet = workbook.Sheets[sheetName];
          // Convert to array of arrays
          const jsonData = window.XLSX.utils.sheet_to_json(sheet, {
            header: 1,
          });
          parseExcelData(jsonData);
        } catch (err) {
          console.error(err);
          setError(
            "Failed to parse Excel file. Please ensure it has a valid structure."
          );
        }
      };
      reader.readAsBinaryString(file);
    } else {
      // CSV Fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseExcelData = (rows: any[]) => {
    const parsedProducts: Product[] = [];

    // Iterate rows. Skip header (index 0).
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      // Map columns based on your file structure:
      // Col 0: Product Id
      // Col 1: Category
      // Col 2: Image Count
      // Col 3+: Images

      const id = row[0] ? String(row[0]) : "";
      const category = row[1] ? String(row[1]) : "";
      const imageCount = row[2] ? parseInt(row[2]) : 0;

      const images: string[] = [];
      // Look for images starting from column index 3
      for (let j = 3; j < row.length; j++) {
        const cell = row[j];
        if (
          cell &&
          typeof cell === "string" &&
          cell.trim().startsWith("http")
        ) {
          images.push(cell.trim());
        }
      }

      if (id && images.length > 0) {
        parsedProducts.push({ id, category, imageCount, images });
      }
    }

    setProducts(parsedProducts);
    setError(null);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n");
    const parsedProducts: Product[] = [];

    // Robust CSV split to handle commas inside quotes
    // Matches commas that are followed by an even number of quotes (or 0)
    const splitCSVLine = (line: string) => {
      const pattern = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      return line.split(pattern).map((val) => val.replace(/^"|"$/g, "").trim());
    };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const cols = splitCSVLine(line);
      const id = cols[0];
      const category = cols[1];
      const imageCount = parseInt(cols[2]) || 0;
      const images = cols
        .slice(3)
        .map((url) => url.trim())
        .filter((url) => url.length > 0 && url.startsWith("http"));

      if (id && images.length > 0) {
        parsedProducts.push({ id, category, imageCount, images });
      }
    }
    setProducts(parsedProducts);
    setError(null);
  };

  const handleSingleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setSingleImagePreview(previewUrl);

    // Convert to Base64 for API
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      setSingleImage(base64);
      setAnalysis(null); // Reset analysis when new image added
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    const effectiveKey = apiKey || DEFAULT_API_KEY;

    if (!effectiveKey || !effectiveKey.trim()) {
      setError("Please enter a valid Gemini API Key first.");
      return;
    }

    let imageBase64 = "";

    // Determine which image to use
    if (activeTab === "dataset") {
      if (!selectedProduct) return;
      try {
        // Need to fetch and convert the URL image to base64
        // We use a proxy fallback to handle CORS errors common with image datasets
        imageBase64 = await urlToBase64(selectedProduct.images[0]);
      } catch (e: any) {
        setError(e.message || "Could not access this image URL.");
        return;
      }
    } else {
      if (!singleImage) return;
      imageBase64 = singleImage;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    const requestBody = {
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
      },
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = `Gemini API Error: ${errorData.error.message}`;
          }
        } catch (e) {
          // Fallback if response isn't JSON
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textResult) {
        const parsed = JSON.parse(textResult);
        setAnalysis(parsed);
      } else {
        throw new Error("No analysis data received");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper: Converts Blob to Base64 string (without data: prefix)
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/...;base64, prefix
        resolve(base64String.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Improved Image Fetcher with Proxy Fallback
  const urlToBase64 = async (url: string): Promise<string> => {
    // 1. Try Direct Fetch
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Direct fetch failed");
      const blob = await response.blob();
      return await blobToBase64(blob);
    } catch (e) {
      // 2. Try Proxy (AllOrigins) to bypass CORS if direct fetch fails
      try {
        console.log("Direct fetch failed (likely CORS). Trying proxy...");
        // Using allorigins.win as a free CORS proxy for the prototype
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          url
        )}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Proxy fetch failed");
        const blob = await response.blob();
        return await blobToBase64(blob);
      } catch (proxyError) {
        throw new Error(
          "Could not download image due to browser CORS security. Please download the image manually and use 'Analyze New Image'."
        );
      }
    }
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-indigo-600" />
            <h1 className="font-bold text-xl tracking-tight">
              VisualMeasure<span className="text-indigo-600">AI</span>
            </h1>
          </div>
          {/* API Key Input Removed as requested */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm inline-flex">
            <button
              onClick={() => {
                setActiveTab("dataset");
                setAnalysis(null);
                setError(null);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "dataset"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Dataset (Excel/CSV)
            </button>
            <button
              onClick={() => {
                setActiveTab("single");
                setAnalysis(null);
                setError(null);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "single"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Analyze New Image
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
          {/* --- DATASET MODE --- */}
          {activeTab === "dataset" && (
            <div className="h-full flex flex-col md:flex-row">
              {/* Left Sidebar: Product List */}
              <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col h-[80vh]">
                {products.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="font-semibold text-slate-700 mb-2">
                      Load Dataset
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Upload your .xlsx or .csv file to browse products.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer">
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="hidden"
                        onChange={handleDatasetUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <span className="font-semibold text-slate-700 text-sm">
                        {products.length} Items
                      </span>
                      <button
                        onClick={() => setProducts([])}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {products.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          isSelected={selectedProduct?.id === p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setAnalysis(null);
                            setError(null);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Panel: Detail & Analysis */}
              <div className="w-full md:w-2/3 bg-slate-50/30 flex flex-col relative h-[80vh] overflow-y-auto">
                {selectedProduct ? (
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-32 h-32 bg-white rounded-lg border border-slate-200 p-2 flex-shrink-0">
                        <img
                          src={selectedProduct.images[0]}
                          className="w-full h-full object-contain"
                          alt="preview"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {selectedProduct.category}
                        </h2>
                        <p className="text-sm text-slate-500 font-mono mb-4">
                          ID: {selectedProduct.id}
                        </p>
                        <button
                          onClick={analyze}
                          disabled={isAnalyzing}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <BarChart2 className="w-4 h-4" />
                          )}
                          Measure Visuals
                        </button>
                      </div>
                    </div>

                    <ResultsDisplay
                      analysis={analysis}
                      error={error}
                      isAnalyzing={isAnalyzing}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <ChevronRight className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Select a product to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- SINGLE IMAGE MODE --- */}
          {activeTab === "single" && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Upload Column */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Input Image</h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-8 text-center hover:bg-slate-100 transition-colors relative group">
                    {singleImagePreview ? (
                      <div className="relative">
                        <img
                          src={singleImagePreview}
                          alt="Upload"
                          className="max-h-64 mx-auto object-contain mix-blend-multiply"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <p className="text-white font-medium">
                            Click to change
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">
                          Click to upload
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          JPG, PNG supported
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      aria-label="Upload image"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleSingleImageUpload}
                    />
                  </div>

                  <button
                    onClick={analyze}
                    disabled={!singleImage || isAnalyzing}
                    className="w-full mt-6 flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md font-medium"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BarChart2 className="w-4 h-4" />
                    )}
                    {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                  </button>
                </div>

                {/* Results Column */}
                <div className="border-l border-slate-100 pl-8 md:pl-12">
                  <ResultsDisplay
                    analysis={analysis}
                    error={error}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
