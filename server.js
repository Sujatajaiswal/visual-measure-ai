import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

// ✅ Enable CORS
app.use(cors());

app.get("/proxy", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send("Missing image URL");
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(500).send("Failed to fetch image");
    }

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});

app.listen(5000, () => {
  console.log("✅ Proxy server running at http://localhost:5000");
});
