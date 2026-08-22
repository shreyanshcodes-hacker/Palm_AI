import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { handlePalmChatRequest } from "./src/server/xaiChatService";
import { handlePalmAnalyzeRequest } from "./src/server/palmAnalyzeService";

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

// Health check endpoint for Chat API
app.get("/api/chat", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "PalmAI Chat API",
  });
});

// Official xAI Grok AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const result = await handlePalmChatRequest(req.body);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error("Server /api/chat error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to generate response right now.",
    });
  }
});

// Backward compatibility alias endpoint
app.post("/api/chat-palm", async (req, res) => {
  try {
    const result = await handlePalmChatRequest(req.body);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error("Server /api/chat-palm error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to generate response right now.",
    });
  }
});

// Smart Fallback Chat Helper
function generateFallbackChatReply(report: any, question: string, defaultLang: string): string {
  const qLower = question.toLowerCase();
  const isHindiQuestion = /[\u0900-\u097F]/.test(question) || defaultLang === "Hindi";

  if (isHindiQuestion) {
    if (qLower.includes("करियर") || qLower.includes("नौकरी") || qLower.includes("काम") || qLower.includes("career")) {
      return `### संक्षेप उत्तर\n${report.career?.description || 'आपकी हस्तरेखा में करियर में निरंतर प्रयास और समर्पण के संकेत दिखते हैं।'}\n\n### विस्तृत व्याख्या\nआपकी रिपोर्ट के अनुसार, ${report.career?.points?.join(' ') || 'भाग्य रेखा और सूर्य रेखा आपकी प्रतिभा और नेतृत्व क्षमताओं को दर्शाती हैं।'}\n\n### मार्गदर्शन\n${report.career?.insight || 'अपनी स्वाभाविक क्षमताओं और एकाग्रता का उपयोग करें।'}\n\n### रिमाइंडर\nहस्तरेखा मार्गदर्शन केवल प्रेरणा के लिए है। आपकी कड़ी मेहनत और निर्णय ही आपके भविष्य का निर्माण करते हैं।`;
    }
    if (qLower.includes("रिश्ते") || qLower.includes("प्यार") || qLower.includes("संबंध") || qLower.includes("relationship") || qLower.includes("love")) {
      return `### संक्षेप उत्तर\n${report.relationships?.description || 'आपकी हृदय रेखा प्रेम और संबंधों में भावनात्मक गहराई और सामंजस्य दर्शाती है।'}\n\n### विस्तृत व्याख्या\nरिपोर्ट में उल्लेख है: ${report.relationships?.points?.join(' ') || 'आप रिश्तों में सच्चाई और वफादारी को महत्व देते हैं।'}\n\n### मार्गदर्शन\n${report.relationships?.insight || 'खुले संवाद और आपसी समझ से रिश्ते मजबूत होते हैं।'}\n\n### रिमाइंडर\nसच्चा प्रेम और समझ आपसी प्रयास और सम्मान से पनपती है।`;
    }
    if (qLower.includes("भविष्य") || qLower.includes("सफलता") || qLower.includes("future") || qLower.includes("success")) {
      return `### संक्षेप उत्तर\n${report.futureGuidance || 'आपकी हस्तरेखा अनुकूल अवसरों और प्रगति का संकेत देती है।'}\n\n### विस्तृत व्याख्या\n${report.summary || 'आपकी जीवन रेखा और मस्तिष्क रेखा आपकी बुद्धिमत्ता और सहनशक्ति को दर्शाती हैं।'}\n\n### मार्गदर्शन\nअपने लक्ष्यों पर केंद्रित रहें और अपनी क्षमताओं पर विश्वास रखें।\n\n### रिमाइंडर\nभविष्य निश्चित नहीं होता, आपके आज के कर्म ही आपका कल तय करते हैं।`;
    }
    return `### संक्षेप उत्तर\nआपकी हस्तरेखा रिपोर्ट के अनुसार, आपकी मुख्य रेखाएं आपके व्यक्तित्व में संतुलन और सकारात्मक ऊर्जा दर्शाती हैं।\n\n### विस्तृत व्याख्या\n${report.summary || 'आपकी रिपोर्ट आपकी बुद्धिमत्ता, नेतृत्व क्षमता और भावनात्मक परिपक्वता को उजागर करती है।'}\n\n### मार्गदर्शन\nअपनी मुख्य शक्तियों: ${report.strengths?.slice(0, 3).join(', ') || 'एकाग्रता और नेतृत्व'} पर ध्यान दें।\n\n### रिमाइंडर\nयह हस्तरेखा विश्लेषण केवल व्यक्तिगत आत्म-चिंतन और सकारात्मक सोच को बढ़ावा देने के लिए है।`;
  }

  // English fallback
  if (qLower.includes("career") || qLower.includes("job") || qLower.includes("work") || qLower.includes("business")) {
    return `### Short Answer\n${report.career?.description || 'Your palm indicates strong career drive, leadership potential, and steady growth.'}\n\n### Explanation\nAccording to your generated report: ${report.career?.points?.join(' ') || 'Your Fate Line and Sun Line show natural talent and dedication.'}\n\n### Guidance\n${report.career?.insight || 'Leverage your analytical skills and stay focused on key priorities.'}\n\n### Reminder\nPalm reading provides reflective insights. Your consistent dedication and decisions dictate your professional destiny.`;
  }
  if (qLower.includes("relationship") || qLower.includes("love") || qLower.includes("marriage") || qLower.includes("partner")) {
    return `### Short Answer\n${report.relationships?.description || 'Your Heart Line reflects emotional depth, loyalty, and a desire for meaningful harmony.'}\n\n### Explanation\nFrom your report analysis: ${report.relationships?.points?.join(' ') || 'You value honesty and mutual empathy in your connections.'}\n\n### Guidance\n${report.relationships?.insight || 'Nurture open communication and patience with loved ones.'}\n\n### Reminder\nMeaningful relationships thrive on active empathy, trust, and shared respect.`;
  }
  if (qLower.includes("future") || qLower.includes("success") || qLower.includes("destiny")) {
    return `### Short Answer\n${report.futureGuidance || 'Your reading reflects positive momentum and bright opportunities for personal evolution.'}\n\n### Explanation\n${report.summary || 'Your Head Line and Life Line demonstrate wisdom, resilience, and adaptability.'}\n\n### Guidance\nFocus on your core strengths: ${(report.strengths || []).slice(0, 3).join(', ') || 'leadership, focus, and empathy'}.\n\n### Reminder\nNo outcome is fixed in stone—your conscious choices shape your future every day.`;
  }
  return `### Short Answer\nBased on your generated PalmAI report for ${report.name || 'you'}, your palm features showcase a well-balanced archetype.\n\n### Explanation\n${report.summary || 'Your Head Line, Heart Line, and Life Line combine to show intellectual clarity, emotional balance, and vital energy.'}\n\n### Guidance\nEmbrace your key strengths: ${(report.strengths || []).slice(0, 3).join(', ') || 'adaptability and clear intuition'}.\n\n### Reminder\nThis reading is provided for reflection, personal growth, and positive motivation.`;
}
app.post("/api/analyze-palm", async (req, res) => {
  try {
    const result = await handlePalmAnalyzeRequest(req.body);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error("Palm analysis API error:", error);
    return res.status(500).json({
      source: "error",
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
