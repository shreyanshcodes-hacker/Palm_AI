import { GoogleGenAI } from "@google/genai";

export interface ChatRequestPayload {
  question?: string;
  userQuestion?: string; // backward compatibility
  report?: any;
  language?: string;
  messages?: Array<{ role: string; content: string }>;
}

export interface ChatResponseResult {
  status: number;
  body: {
    success: boolean;
    answer?: string;
    reply?: string; // backward compatibility
    error?: string;
    model?: string;
  };
}

/**
 * Formats a PalmReadingReport object into comprehensive structured context for the AI model.
 */
export function formatReportToContext(report: any): string {
  if (!report || typeof report !== "object") {
    return "No palm reading report provided.";
  }

  const formatSection = (title: string, section?: any) => {
    if (!section || typeof section !== "object") return `${title}: Not analyzed`;
    let text = `${title}:\n- Title: ${section.title || "N/A"}\n- Description: ${section.description || "N/A"}`;
    if (Array.isArray(section.points) && section.points.length > 0) {
      text += `\n- Detailed Points: ${section.points.join("; ")}`;
    }
    if (section.insight) {
      text += `\n- Key Insight: ${section.insight}`;
    }
    return text;
  };

  return `
PALM REPORT CONTEXT:
Name: ${report.name || "User"}
Age: ${report.age || "Unspecified"}
Report Language: ${report.language || "English"}
Hand Type: ${report.handType || "Unspecified"} ${report.handTypeDescription ? `(${report.handTypeDescription})` : ""}

${formatSection("Life Line", report.lifeLine)}

${formatSection("Head Line", report.headLine)}

${formatSection("Heart Line", report.heartLine)}

${formatSection("Fate Line", report.fateLine)}

${formatSection("Sun Line", report.sunLine)}

${formatSection("Mounts Analysis", report.mountAnalysis)}

${formatSection("Career Insights", report.career)}

${formatSection("Relationship Insights", report.relationships)}

Strengths: ${Array.isArray(report.strengths) ? report.strengths.join(", ") : "Not specified"}
Growth Areas / Challenges: ${Array.isArray(report.challenges) ? report.challenges.join(", ") : "Not specified"}
Summary: ${report.summary || "Not specified"}
Future Guidance: ${report.futureGuidance || "Not specified"}
`.trim();
}

/**
 * Detects whether the text contains Hindi / Devanagari script.
 */
export function isHindiScript(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Intelligent contextual fallback response generator based strictly on the user's specific report.
 */
export function generateContextualFallbackReply(report: any, question: string, defaultLang: string = "English"): string {
  const qLower = question.toLowerCase();
  const isHindi = isHindiScript(question) || defaultLang === "Hindi" || defaultLang === "हिन्दी";

  if (isHindi) {
    if (qLower.includes("करियर") || qLower.includes("नौकरी") || qLower.includes("काम") || qLower.includes("व्यवसाय") || qLower.includes("career")) {
      return `### संक्षेप उत्तर
${report.career?.description || 'आपकी हस्तरेखा रिपोर्ट के अनुसार, आपकी हथेलियों में करियर में निरंतर प्रयास, अनुशासन और नेतृत्व क्षमता के मजबूत संकेत हैं।'}

### मुख्य अंतर्दृष्टि
- **रिपोर्ट अवलोकन**: ${report.career?.points?.join('; ') || 'आपकी भाग्य रेखा और सूर्य रेखा रचनात्मक ऊर्जा, लगन और कर्मठता को दर्शाती हैं।'}
- **विशेष अंतर्दृष्टि**: ${report.career?.insight || 'अपनी रणनीतिक सोच और एकाग्रता का उपयोग करके आप नए अवसरों का लाभ उठा सकते हैं।'}
- **प्राकृतिक शक्तियां**: ${Array.isArray(report.strengths) ? report.strengths.slice(0, 3).join(', ') : 'दृढ़ संकल्प, स्पष्ट दृष्टिकोण, समर्पण'}

### व्यावहारिक मार्गदर्शन
अपने दीर्घकालिक लक्ष्यों पर केंद्रित रहें। हस्तरेखा विश्लेषण आत्म-चिंतन और प्रेरणा के लिए है; आपके निरंतर प्रयास और सही निर्णय ही आपकी सफलता को आकार देते हैं।`;
    }

    if (qLower.includes("रिश्ते") || qLower.includes("संबंध") || qLower.includes("प्यार") || qLower.includes("विवाह") || qLower.includes("परिवार") || qLower.includes("relationship") || qLower.includes("love") || qLower.includes("family")) {
      return `### संक्षेप उत्तर
${report.relationships?.description || 'आपकी हृदय रेखा प्रेम और संबंधों में गहरी भावनात्मक समझ, सच्चाई और सामंजस्य की प्रबल इच्छा दर्शाती है।'}

### मुख्य अंतर्दृष्टि
- **संबंध शैली**: ${report.relationships?.points?.join('; ') || 'आप रिश्तों में आपसी विश्वास, स्पष्ट संवाद और सम्मान को प्राथमिकता देते हैं।'}
- **भावनात्मक अंतर्दृष्टि**: ${report.relationships?.insight || 'खुले मन से संवाद करने और धैर्य रखने से आपके रिश्ते और अधिक प्रगाढ़ होंगे।'}

### व्यावहारिक मार्गदर्शन
सच्चे संबंध आपसी समझ और निरंतर संवेदनशीलता से मजबूत होते हैं। अपने प्रियजनों के साथ समय बिताएं और अपनी भावनाओं को स्पष्टता से साझा करें।`;
    }

    if (qLower.includes("व्यक्तित्व") || qLower.includes("मस्तिष्क") || qLower.includes("दिमाग") || qLower.includes("गुण") || qLower.includes("personality") || qLower.includes("head") || qLower.includes("traits")) {
      return `### संक्षेप उत्तर
${report.headLine?.description || 'आपकी मस्तिष्क रेखा गहरी विश्लेषणात्मक क्षमता, तार्किक सोच और व्यावहारिक बुद्धिमत्ता का संकेत देती है।'}

### मुख्य अंतर्दृष्टि
- **मानसिक विशेषताएं**: ${report.headLine?.points?.join('; ') || 'आप जटिल परिस्थितियों में शांत रहकर और तथ्यों के आधार पर निर्णय लेते हैं।'}
- **संज्ञानात्मक गुण**: ${report.headLine?.insight || 'आपकी सीखने की ललक और समस्याओं को सुलझाने की क्षमता आपकी प्रमुख ताकत है।'}
- **शक्तियां**: ${Array.isArray(report.strengths) ? report.strengths.join(', ') : 'विवेक, एकाग्रता, स्पष्टता'}

### व्यावहारिक मार्गदर्शन
अपनी मानसिक ऊर्जा को रचनात्मक और सार्थक कार्यों में लगाएं। नियमित चिंतन और मानसिक शांति आपके निर्णयों को और बेहतर बनाएगी।`;
    }

    if (qLower.includes("विकास") || qLower.includes("सुधार") || qLower.includes("growth") || qLower.includes("challenge")) {
      return `### संक्षेप उत्तर
आपकी हस्तरेखा रिपोर्ट में आत्म-विकास के लिए संतुलन बनाए रखने और अत्यधिक सोचने से बचने का सुझाव दिया गया है।

### मुख्य अंतर्दृष्टि
- **सुधार के क्षेत्र**: ${Array.isArray(report.challenges) ? report.challenges.join('; ') : 'कार्य और विश्राम के बीच संतुलन बनाएं और छोटी बातों पर तनाव से बचें।'}
- **मार्गदर्शन सूत्र**: ${report.futureGuidance || 'अपनी क्षमताओं पर भरोसा रखें और नियमित दिनचर्या का पालन करें।'}

### व्यावहारिक मार्गदर्शन
सकारात्मक आत्म-संवाद अपनाएं और अपने विकास के हर छोटे कदम की सराहना करें। निरंतर अभ्यास ही श्रेष्ठता की कुंजी है।`;
    }

    if (qLower.includes("वित्त") || qLower.includes("धन") || qLower.includes("पैसा") || qLower.includes("finance") || qLower.includes("money")) {
      return `### संक्षेप उत्तर
आपकी रिपोर्ट के अनुसार, आपकी भाग्य रेखा और पर्वतों का संतुलन व्यावहारिक वित्तीय प्रबंधन और स्थिर प्रगति का संकेत देता है।

### मुख्य अंतर्दृष्टि
- **वित्तीय दृष्टिकोण**: ${report.summary || 'अनुशासित वित्तीय योजना और विवेकपूर्ण निवेश आपको दीर्घकालिक स्थिरता प्रदान करते हैं।'}
- **संबंधित शक्तियां**: ${Array.isArray(report.strengths) ? report.strengths.slice(0, 3).join(', ') : 'दूरदर्शिता और योजनाबद्ध निर्णय'}

### व्यावहारिक मार्गदर्शन
वित्तीय स्थिरता के लिए बजट और बचत की आदत बनाए रखें। हस्तरेखा संकेत पारंपरिक दृष्टिकोण पर आधारित हैं, वित्तीय सफलता विवेकपूर्ण निर्णयों पर निर्भर करती है।`;
    }

    if (qLower.includes("भविष्य") || qLower.includes("सलाह") || qLower.includes("मार्गदर्शन") || qLower.includes("future") || qLower.includes("guidance")) {
      return `### संक्षेप उत्तर
${report.futureGuidance || 'आपकी हस्तरेखा सकारात्मक प्रगति, नए अवसरों और व्यक्तिगत परिपक्वता का संकेत देती है।'}

### मुख्य अंतर्दृष्टि
- **रिपोर्ट सारांश**: ${report.summary || 'आपकी मुख्य रेखाएं ऊर्जा, स्पष्ट बुद्धि और संतुलित दृष्टिकोण को दर्शाती हैं।'}
- **प्रेरणा**: ${Array.isArray(report.strengths) ? report.strengths.join(', ') : 'आत्मविश्वास और लगन'}

### व्यावहारिक मार्गदर्शन
वर्तमान में अपने कर्तव्यों का निष्ठापूर्वक पालन करें। भविष्य आपके आज के निर्णयों और कर्मों से बनता है।`;
    }

    return `### संक्षेप उत्तर
${report.name || 'आपके'} हस्तरेखा विश्लेषण के अनुसार, आपकी हथेली में बौद्धिक स्पष्टता, भावनात्मक संतुलन और संकल्प शक्ति का सुंदर समन्वय है।

### मुख्य अंतर्दृष्टि
- **हस्त प्रकार**: ${report.handType || 'संतुलित प्रारूप'} ${report.handTypeDescription ? `(${report.handTypeDescription})` : ''}
- **मुख्य शक्तियां**: ${Array.isArray(report.strengths) ? report.strengths.join(', ') : 'नेतृत्व, संवेदनशीलता, सहनशक्ति'}
- **जीवन व सारांश**: ${report.summary || 'आपकी रेखाएं जीवन के प्रति सकारात्मक दृष्टिकोण और निरंतर आगे बढ़ने की भावना को दर्शाती हैं।'}

### व्यावहारिक मार्गदर्शन
अपनी स्वाभाविक क्षमताओं पर विश्वास रखें और जीवन में संतुलन बनाए रखें। यह विश्लेषण केवल आत्म-चिंतन और सकारात्मक प्रेरणा के लिए है।`;
  }

  // English fallback responses
  if (qLower.includes("career") || qLower.includes("job") || qLower.includes("work") || qLower.includes("business") || qLower.includes("profession")) {
    return `### Short Answer
${report.career?.description || 'Your palm reading report highlights notable ambition, strategic dedication, and strong potential for leadership.'}

### Key Insights
- **Report Highlights**: ${report.career?.points?.join('; ') || 'Your Fate Line and Mounts indicate steady professional progression and disciplined focus.'}
- **Strategic Insight**: ${report.career?.insight || 'Leveraging your core analytical strengths and clear communication will unlock meaningful career milestones.'}
- **Associated Strengths**: ${Array.isArray(report.strengths) ? report.strengths.slice(0, 3).join(', ') : 'Strategic thinking, resilience, focus'}

### Practical Reflection
Continue cultivating your specialized skills and maintain discipline. Palmistry provides reflective self-awareness—your deliberate daily actions determine your professional success.`;
  }

  if (qLower.includes("relationship") || qLower.includes("love") || qLower.includes("marriage") || qLower.includes("partner") || qLower.includes("family") || qLower.includes("heart")) {
    return `### Short Answer
${report.relationships?.description || 'Your Heart Line reflects emotional depth, empathy, and a strong value for authentic, harmonious connection.'}

### Key Insights
- **Connection Style**: ${report.relationships?.points?.join('; ') || 'You prioritize honesty, mutual respect, and emotional stability in your relationships.'}
- **Emotional Insight**: ${report.relationships?.insight || 'Active listening and open emotional dialogue help prevent misunderstandings and deepen trust.'}

### Practical Reflection
Nurture relationships with patience and clear communication. Strong, lasting connections are built through mutual empathy and consistent presence.`;
  }

  if (qLower.includes("personality") || qLower.includes("mind") || qLower.includes("intelligence") || qLower.includes("head") || qLower.includes("trait")) {
    return `### Short Answer
${report.headLine?.description || 'Your Head Line demonstrates strong analytical reasoning, practical problem-solving instincts, and creative adaptability.'}

### Key Insights
- **Mental Traits**: ${report.headLine?.points?.join('; ') || 'You approach complex situations with structured logic and grounded intuition.'}
- **Cognitive Profile**: ${report.headLine?.insight || 'Your curiosity and ability to absorb new information serve as key intellectual strengths.'}
- **Identified Qualities**: ${Array.isArray(report.strengths) ? report.strengths.join(', ') : 'Logical clarity, perseverance, empathy'}

### Practical Reflection
Channel your mental energy into purposeful projects while maintaining time for mindfulness and mental rest.`;
  }

  if (qLower.includes("growth") || qLower.includes("challenge") || qLower.includes("self growth")) {
    return `### Short Answer
Your palm report highlights personal development opportunities centered around balance and mindfulness.

### Key Insights
- **Growth Areas**: ${Array.isArray(report.challenges) ? report.challenges.join('; ') : 'Avoid overthinking decisions and maintain healthy boundaries between work and rest.'}
- **Guiding Insight**: ${report.futureGuidance || 'Trust your inner intuition and establish steady, sustainable routines.'}

### Practical Reflection
Celebrate incremental progress and maintain self-compassion during periods of transition. Continuous self-awareness is the foundation of personal growth.`;
  }

  if (qLower.includes("finance") || qLower.includes("money") || qLower.includes("wealth") || qLower.includes("stability")) {
    return `### Short Answer
Your report suggests a grounded, methodical approach to financial stability and resource management.

### Key Insights
- **Financial Profile**: ${report.summary || 'Disciplined planning, patience, and deliberate investment in your skill set support long-term security.'}
- **Supportive Strengths**: ${Array.isArray(report.strengths) ? report.strengths.slice(0, 3).join(', ') : 'Prudence, strategic planning, focus'}

### Practical Reflection
Maintain prudent budgeting habits and invest in continuous learning. While traditional palmistry reflects attitudes toward security, practical financial planning governs prosperity.`;
  }

  if (qLower.includes("future") || qLower.includes("guidance") || qLower.includes("advice") || qLower.includes("destiny")) {
    return `### Short Answer
${report.futureGuidance || 'Your reading reflects steady personal momentum, positive growth cycles, and emerging opportunities.'}

### Key Insights
- **Report Overview**: ${report.summary || 'A harmonious blend of vital energy, intellectual clarity, and emotional maturity.'}
- **Core Strengths**: ${Array.isArray(report.strengths) ? report.strengths.join(', ') : 'Focus, resilience, intuitive wisdom'}

### Practical Reflection
Approach upcoming milestones with confidence. Palm reading offers interpretive guidance for reflection—your conscious choices shape your future.`;
  }

  return `### Short Answer
Based on the PalmAI report generated for ${report.name || 'you'}, your palm exhibits a well-balanced archetype with distinctive intellectual and emotional strengths.

### Key Insights
- **Hand Archetype**: ${report.handType || 'Balanced'} ${report.handTypeDescription ? `(${report.handTypeDescription})` : ''}
- **Key Strengths**: ${Array.isArray(report.strengths) ? report.strengths.join(', ') : 'Intuition, focus, adaptability'}
- **Reading Summary**: ${report.summary || 'Your primary lines reflect resilience, thoughtful discernment, and constructive life energy.'}

### Practical Reflection
Leverage your innate qualities while remaining open to new experiences. This report is designed for self-discovery and positive personal empowerment.`;
}

/**
 * Builds the official PalmAI system prompt with strict context binding and safety guardrails.
 */
function buildSystemPrompt(reportContext: string, userLang: string, questionLang: string): string {
  const isHindiMode = questionLang === "Hindi" || userLang === "Hindi" || userLang === "हिन्दी";

  return `You are PalmAI, an AI assistant that helps users understand their generated palm-reading report.

Use the supplied PalmAI report as the primary context for answering the user's questions.

Do not invent palm characteristics that are not contained in the report.

Palmistry is a traditional interpretive practice intended for entertainment and self-reflection. Do not present palmistry as scientifically proven.

Do not make deterministic predictions about a person's future.

Do not provide medical diagnosis or treatment.

For health questions, provide only general reflective information and encourage the user to consult a qualified professional for real health concerns.

Do not provide guaranteed financial, career, relationship, or future outcomes.

Give thoughtful, personalized answers based on the user's report.

Respect the user's selected language and the language of their question.

LANGUAGE INSTRUCTIONS:
- Preferred Language: ${userLang}
- Question Detected Language: ${questionLang}
- If the question is in Hindi ("हिन्दी") or the user asks in Devanagari script, respond strictly in natural, elegant Hindi using Devanagari script.
- If the question is in English, respond in clear, refined English.

OUTPUT FORMAT:
Structure your response cleanly in markdown:
### ${isHindiMode ? "संक्षेप उत्तर" : "Short Answer"}
(1-2 clear, direct sentences)
### ${isHindiMode ? "मुख्य अंतर्दृष्टि" : "Key Insights"}
(Bullet points linking directly to the lines, mounts, or traits in the report)
### ${isHindiMode ? "व्यावहारिक मार्गदर्शन" : "Practical Reflection"}
(A supportive, uplifting takeaway emphasizing personal agency)

${reportContext}`;
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

/**
 * Handles incoming palm chat requests using xAI Grok (with multi-layer fallback resilience).
 */
export async function handlePalmChatRequest(payload: ChatRequestPayload): Promise<ChatResponseResult> {
  const question = (payload.question || payload.userQuestion || "").trim();
  const report = payload.report || {};
  const userLang = payload.language || "English";

  console.log(`[PalmAI Chat] Request received | Question length: ${question.length} chars | Language: ${userLang}`);

  // 1. Validate required question field
  if (!question) {
    console.warn("[PalmAI Chat] Validation failed: Question field is empty.");
    return {
      status: 400,
      body: {
        success: false,
        error: "Question is required.",
      },
    };
  }

  // 2. Format Palm Report Context
  const reportContext = formatReportToContext(report);
  const questionIsHindi = isHindiScript(question);
  const questionLang = questionIsHindi ? "Hindi" : userLang === "Hindi" || userLang === "हिन्दी" ? "Hindi" : "English";
  console.log(`[PalmAI Chat] Report context prepared | Has report: ${Boolean(report && report.name)} | Question Script: ${questionLang}`);

  const systemPrompt = buildSystemPrompt(reportContext, userLang, questionLang);

  // 3. Attempt xAI Grok API (Primary provider)
  const xaiApiKey = process.env.XAI_API_KEY;
  const xaiModel = process.env.XAI_MODEL || "grok-2-latest";

  if (xaiApiKey && xaiApiKey.trim() !== "") {
    console.log(`[xAI Grok] Initiating chat completion with model: ${xaiModel}`);
    try {
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ];

      const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${xaiApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: xaiModel,
          messages,
          temperature: 0.5,
          max_tokens: 1024,
        }),
      });

      console.log(`[xAI Grok] Response status code: ${xaiRes.status}`);

      if (xaiRes.ok) {
        const data = (await xaiRes.json()) as any;
        const answerText = data?.choices?.[0]?.message?.content?.trim();
        if (answerText) {
          console.log("[xAI Grok] Successfully generated answer.");
          return {
            status: 200,
            body: {
              success: true,
              answer: answerText,
              reply: answerText,
              model: xaiModel,
            },
          };
        }
      } else {
        const errorText = await xaiRes.text();
        console.warn(`[xAI Grok] API Error (${xaiRes.status}):`, errorText);
      }
    } catch (xaiError: any) {
      console.warn("[xAI Grok] Network/Request failed:", xaiError?.message || xaiError);
    }
  } else {
    console.log("[PalmAI Chat] XAI_API_KEY not set or empty. Proceeding to secondary provider / contextual engine.");
  }

  // 4. Attempt Gemini API (Secondary provider)
  const geminiAi = getGeminiClient();
  if (geminiAi) {
    try {
      console.log("[Gemini AI] Attempting conversational completion with gemini-3.6-flash");
      const fullPrompt = `${systemPrompt}\n\nUSER QUESTION:\n${question}`;
      const geminiRes = await geminiAi.models.generateContent({
        model: "gemini-3.6-flash",
        contents: fullPrompt,
      });

      const replyText = geminiRes.text?.trim();
      if (replyText) {
        console.log("[Gemini AI] Successfully generated chat answer.");
        return {
          status: 200,
          body: {
            success: true,
            answer: replyText,
            reply: replyText,
            model: "gemini-3.6-flash",
          },
        };
      }
    } catch (geminiError: any) {
      console.warn("[Gemini AI] Attempt failed:", geminiError?.message || geminiError);
    }
  }

  // 5. Contextual Fallback Engine (Guaranteed 100% uptime & zero user disruption)
  console.log("[PalmAI Chat] Generating report-specific contextual response via local engine.");
  const fallbackAnswer = generateContextualFallbackReply(report, question, userLang);

  return {
    status: 200,
    body: {
      success: true,
      answer: fallbackAnswer,
      reply: fallbackAnswer,
      model: "palm-ai-contextual-engine",
    },
  };
}
