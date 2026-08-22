import { GoogleGenAI, Type } from "@google/genai";

export interface AnalyzePalmPayload {
  imageBase64?: string;
  mimeType?: string;
  name?: string;
  age?: number | string;
  language?: string;
}

export interface AnalyzePalmResult {
  status: number;
  body: {
    source: string;
    data?: any;
    message?: string;
    error?: string;
  };
}

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

export async function handlePalmAnalyzeRequest(payload: AnalyzePalmPayload): Promise<AnalyzePalmResult> {
  const { imageBase64, mimeType = "image/jpeg", name, age, language = "English" } = payload;

  if (!imageBase64) {
    return {
      status: 400,
      body: {
        source: "validation",
        error: "Image data is required",
      },
    };
  }

  const ai = getGeminiClient();

  if (!ai) {
    console.log("Gemini API key not configured. Client will use intelligent fallback reading.");
    return {
      status: 200,
      body: {
        source: "fallback",
        message: "Using fallback engine due to unconfigured API key.",
      },
    };
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

  try {
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

    return {
      status: 200,
      body: {
        source: "gemini",
        data: reportData,
      },
    };
  } catch (error: any) {
    console.error("Gemini palm analysis error:", error);
    return {
      status: 200,
      body: {
        source: "fallback",
        message: "Analysis API unavailable. Utilizing fallback reading engine.",
      },
    };
  }
}
