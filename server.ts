import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload size for base64 image uploads
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for Palm Analysis
app.post("/api/analyze-palm", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", name, age, language = "English" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log("Gemini API key not found or placeholder used. Utilizing smart fallback engine.");
      return res.status(200).json({
        source: "fallback",
        message: "Using fallback engine due to unconfigured API key."
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const isHindi = language === "Hindi" || language === "हिन्दी";

    const promptText = `
You are a world-renowned master palmist and intuitive analyst.
Analyze the uploaded palm photo for the user:
- Name: ${name || "User"}
- Age: ${age || "Unspecified"}
- Preferred Language: ${language}

CRITICAL RULES:
1. Examine ONLY features clearly visible in the photograph (main lines, finger shape, palm mounts, thumb structure). NEVER invent invisible details.
2. If language is "${language}" (especially Hindi/हिन्दी), generate ALL titles, descriptions, points, strengths, challenges, future guidance, summary, and disclaimer strictly in ${isHindi ? "Hindi script (Devanagari)" : "English"}.
3. Provide rich, insightful, uplifting, and realistic reading points.
4. Output strictly valid JSON conforming to the requested schema. No markdown backticks, no extra text.
`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    const sectionSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        points: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        insight: { type: Type.STRING },
      },
      required: ["title", "description", "points"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            age: { type: Type.NUMBER },
            language: { type: Type.STRING },
            handType: { type: Type.STRING },
            handTypeDescription: { type: Type.STRING },
            lifeLine: sectionSchema,
            headLine: sectionSchema,
            heartLine: sectionSchema,
            fateLine: sectionSchema,
            sunLine: sectionSchema,
            mountAnalysis: sectionSchema,
            career: sectionSchema,
            relationships: sectionSchema,
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            challenges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            futureGuidance: { type: Type.STRING },
            summary: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: [
            "name",
            "age",
            "language",
            "handType",
            "lifeLine",
            "headLine",
            "heartLine",
            "fateLine",
            "sunLine",
            "mountAnalysis",
            "career",
            "relationships",
            "strengths",
            "challenges",
            "futureGuidance",
            "summary",
            "disclaimer",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const reportData = JSON.parse(jsonText);

    return res.status(200).json({
      source: "gemini",
      data: reportData,
    });
  } catch (error: any) {
    console.error("Palm analysis API error:", error);
    return res.status(500).json({
      error: "Palm analysis failed",
      details: error?.message || "Internal server error",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PalmAI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
