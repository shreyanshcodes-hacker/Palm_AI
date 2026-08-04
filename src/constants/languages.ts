import { Language } from '../types';

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  English: {
    appName: "PalmAI",
    appTagline: "AI Palm Reading",
    heroHeading: "AI Palm Reading",
    heroSubtitle: "Upload your palm photo to reveal a luxury, deeply personalized AI palmistry report in seconds.",
    startReadingBtn: "Upload Palm",
    generateReportBtn: "Generate Report",
    badgeText: "Powered by Gemini Vision AI",
    freeBadge: "100% Free • Instant • Private",
    
    // Form
    stepDetailsHeading: "Enter Your Details",
    stepDetailsSub: "Personalize your reading report",
    nameLabel: "Full Name",
    namePlaceholder: "e.g., Sophia Vance",
    nameRequired: "Please enter your name.",
    ageLabel: "Age",
    agePlaceholder: "e.g., 26",
    ageRequired: "Please enter an age between 10 and 100.",
    langLabel: "Preferred Reading Language",
    continueBtn: "Continue to Upload",
    backBtn: "Back",

    // Upload
    uploadHeading: "Upload Your Palm",
    uploadSub: "Drag & drop your palm photo or capture directly using your camera",
    dragDropText: "Drag and drop your palm photo here",
    orText: "or",
    browseFilesBtn: "Browse Image",
    takePhotoBtn: "Take Photo via Camera",
    supportedFormats: "Supports JPG, JPEG, PNG, WEBP (Max 10MB)",
    guidelinesTitle: "Guidelines for Best Results",
    guideLighting: "Good & bright lighting",
    guideFingers: "Fingers fully visible & uncrossed",
    guideEntirePalm: "Entire palm frame visible",
    guideBackground: "Neutral background preferred",
    changePhotoBtn: "Change Image",
    analyzeNowBtn: "Generate Palm Reading",

    // Camera Modal
    cameraModalTitle: "Capture Palm Photo",
    captureBtn: "Snap Photo",
    closeCameraBtn: "Cancel",

    // Loading
    step1: "Detecting Palm...",
    step2: "Finding Main Lines...",
    step3: "Analyzing Palm Shape...",
    step4: "Studying Finger Structure...",
    step5: "Preparing Reading...",
    step6: "Designing Premium Report...",
    loadingSubtitle: "Gemini Vision is examining your palm lines and mounts...",
    estTime: "Estimated time: 8–15 seconds",

    // Report
    reportTitle: "Personalized AI Palmistry Report",
    clientProfile: "Client Profile",
    handTypeLabel: "Palm Archetype",
    overviewLabel: "General Overview",
    uploadedPhotoLabel: "Uploaded Palm Photo",
    lineDiagramLabel: "Palm Line Map",
    hoverDiagramTip: "Hover or click on a line below to view line details",

    // Card Titles
    lifeLineTitle: "Life Line (Vitality & Energy)",
    headLineTitle: "Head Line (Intellect & Focus)",
    heartLineTitle: "Heart Line (Emotions & Love)",
    fateLineTitle: "Fate Line (Destiny & Life Path)",
    sunLineTitle: "Sun Line (Creativity & Success)",
    mountAnalysisTitle: "Planetary Mounts Analysis",
    careerTitle: "Career & Prosperity",
    relationshipsTitle: "Relationships & Harmony",
    strengthsTitle: "Core Strengths",
    challengesTitle: "Growth Areas & Challenges",
    futureGuidanceTitle: "Future Guidance & Wisdom",
    summaryTitle: "Executive Summary",

    // Actions
    downloadPngBtn: "Download PNG",
    downloadPdfBtn: "Download PDF",
    analyzeAgainBtn: "Analyze Again",
    shareBtn: "Share Reading",
    navHome: "Home",
    navAbout: "About Developer",
    copiedToast: "Report link copied to clipboard!",
    shareModalTitle: "Share Palm Reading Report",
    shareModalSub: "Share your luxury AI report with friends and social networks.",
    shareNativeBtn: "Share via Web Share API",
    shareCopyLink: "Copy Report Link",
    shareWhatsApp: "Share on WhatsApp",
    shareX: "Share on X (Twitter)",
    shareFacebook: "Share on Facebook",
    shareTelegram: "Share on Telegram",

    // AI Palm Guide Chat
    chatTitle: "💬 Ask PalmAI",
    chatSubtitle: "Ask anything about your palm reading report.",
    chatPlaceholder: "Ask about your career, relationships, personality, strengths, future guidance...",
    emptyChatState: "Generate your palm reading first to unlock AI Palm Guide.",
    chatErrorMsg: "Sorry, I couldn't answer that. Please try again.",
    retryBtnText: "Retry",

    // Legal
    disclaimerTitle: "Disclaimer",
    disclaimerText: "This AI-generated palm reading is intended for entertainment and self-reflection only. Palmistry is not scientifically validated and should not be considered a factual prediction of personality, health, relationships, or future events."
  },
  Hindi: {
    appName: "PalmAI",
    appTagline: "एआई हस्तरेखा विश्लेषण",
    heroHeading: "एआई हस्तरेखा विश्लेषण",
    heroSubtitle: "अपनी हथेली की फोटो अपलोड करें और सेकंडों में एक शानदार, व्यक्तिगत एआई पामिस्ट्री रिपोर्ट प्राप्त करें।",
    startReadingBtn: "हथेली अपलोड करें",
    generateReportBtn: "रिपोर्ट बनाएं",
    badgeText: "जेमिनी विजन एआई द्वारा संचालित",
    freeBadge: "100% मुफ्त • त्वरित • सुरक्षित",

    // Form
    stepDetailsHeading: "अपनी जानकारी दर्ज करें",
    stepDetailsSub: "अपनी रिपोर्ट को व्यक्तिगत बनाएं",
    nameLabel: "पूरा नाम",
    namePlaceholder: "जैसे, राहुल शर्मा",
    nameRequired: "कृपया अपना नाम दर्ज करें।",
    ageLabel: "आयु",
    agePlaceholder: "जैसे, 26",
    ageRequired: "कृपया 10 से 100 के बीच की आयु दर्ज करें।",
    langLabel: "रिपोर्ट की पसंदीदा भाषा",
    continueBtn: "आगे बढ़ें (फोटो अपलोड)",
    backBtn: "पीछे जाएं",

    // Upload
    uploadHeading: "अपनी हथेली अपलोड करें",
    uploadSub: "हथेली की फोटो ड्राप करें या सीधे कैमरे से फोटो खींचें",
    dragDropText: "हथेली की फोटो यहाँ खींचकर लाएँ",
    orText: "अथवा",
    browseFilesBtn: "फोटो चुनें",
    takePhotoBtn: "कैमरे से फोटो लें",
    supportedFormats: "समर्थित फ़ाइलें: JPG, JPEG, PNG, WEBP (अधिकतम 10MB)",
    guidelinesTitle: "सर्वोत्तम परिणाम के लिए निर्देश",
    guideLighting: "अच्छा एवं स्पष्ट प्रकाश",
    guideFingers: "उंगलियां पूरी तरह सीधी व स्पष्ट दिखें",
    guideEntirePalm: "पूरी हथेली फ्रेम में होनी चाहिए",
    guideBackground: "सादा पृष्ठभूमि बेहतर है",
    changePhotoBtn: "दूसरी फोटो चुनें",
    analyzeNowBtn: "हस्तरेखा विश्लेषण शुरू करें",

    // Camera Modal
    cameraModalTitle: "हथेली की फोटो लें",
    captureBtn: "फोटो खींचें",
    closeCameraBtn: "रद्द करें",

    // Loading
    step1: "हथेली की पहचान जारी है...",
    step2: "मुख्य रेखाओं का विश्लेषण...",
    step3: "हथेली के आकार का अध्ययन...",
    step4: "उंगलियों की संरचना की जांच...",
    step5: "अंतिम निष्कर्ष तैयार किया जा रहा है...",
    step6: "लक्जरी रिपोर्ट डिजाइन हो रही है...",
    loadingSubtitle: "जेमिनी विजन आपकी रेखाओं और पर्वतों का गहन अध्ययन कर रहा है...",
    estTime: "अनुमानित समय: 8–15 सेकंड",

    // Report
    reportTitle: "व्यक्तिगत एआई हस्तरेखा रिपोर्ट",
    clientProfile: "उपयोगकर्ता विवरण",
    handTypeLabel: "हथेली का स्वरूप",
    overviewLabel: "सामान्य अवलोकन",
    uploadedPhotoLabel: "आपकी हथेली की फोटो",
    lineDiagramLabel: "मुख्य रेखाओं का मानचित्र",
    hoverDiagramTip: "रेखा विवरण देखने के लिए नीचे चित्र पर क्लिक करें या कर्सर लाएं",

    // Card Titles
    lifeLineTitle: "जीवन रेखा (आयु व जीवन ऊर्जा)",
    headLineTitle: "मस्तिष्क रेखा (बुद्धि व विचारशीलता)",
    heartLineTitle: "हृदय रेखा (भावनाएं व प्रेम सम्बन्ध)",
    fateLineTitle: "भाग्य रेखा (करियर व जीवन पथ)",
    sunLineTitle: "सूर्य रेखा (सफलता व प्रसिद्धि)",
    mountAnalysisTitle: "ग्रह पर्वतों का विश्लेषण",
    careerTitle: "करियर और समृद्धि",
    relationshipsTitle: "संबंध और सामंजस्य",
    strengthsTitle: "प्रमुख शक्तियां",
    challengesTitle: "सुधार के क्षेत्र व चुनौतियाँ",
    futureGuidanceTitle: "भविष्य दर्शन व मार्गदर्शन",
    summaryTitle: "मुख्य सारांश",

    // Actions
    downloadPngBtn: "PNG डाउनलोड करें",
    downloadPdfBtn: "PDF डाउनलोड करें",
    analyzeAgainBtn: "पुनः विश्लेषण करें",
    shareBtn: "शेयर करें",
    navHome: "होम",
    navAbout: "डेवलपर के बारे में",
    copiedToast: "रिपोर्ट लिंक कॉपी हो गया!",
    shareModalTitle: "हस्तरेखा रिपोर्ट शेयर करें",
    shareModalSub: "अपनी लक्जरी एआई रिपोर्ट दोस्तों और सोशल नेटवर्क पर शेयर करें।",
    shareNativeBtn: "वेब शेयर एपीआई से भेजें",
    shareCopyLink: "रिपोर्ट लिंक कॉपी करें",
    shareWhatsApp: "व्हाट्सएप पर शेयर करें",
    shareX: "X (ट्विटर) पर शेयर करें",
    shareFacebook: "फेसबुक पर शेयर करें",
    shareTelegram: "टेलीग्राम पर शेयर करें",

    // AI Palm Guide Chat
    chatTitle: "💬 पाम-एआई से पूछें",
    chatSubtitle: "अपनी हस्तरेखा रिपोर्ट के बारे में कोई भी सवाल पूछें।",
    chatPlaceholder: "करियर, रिश्तों, व्यक्तित्व, शक्तियों, या मार्गदर्शन के बारे में पूछें...",
    emptyChatState: "एआई पाम गाइड का उपयोग करने के लिए पहले हस्तरेखा रिपोर्ट बनाएं।",
    chatErrorMsg: "क्षमा करें, उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।",
    retryBtnText: "पुनः प्रयास करें",

    // Legal
    disclaimerTitle: "अस्वीकरण (Disclaimer)",
    disclaimerText: "यह एआई-जनरेटेड हस्तरेखा विश्लेषण केवल मनोरंजन और आत्म-अवलोकन के लिए है। हस्तरेखा विज्ञान का कोई वैज्ञानिक प्रमाण नहीं है और इसे व्यक्तित्व, स्वास्थ्य, संबंधों या भविष्य की घटनाओं की सटीक भविष्यवाणी नहीं माना जाना चाहिए।"
  }
};
