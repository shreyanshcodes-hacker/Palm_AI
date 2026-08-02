import { Language, PalmReadingReport } from '../types';

export function getFallbackReading(name: string, age: number, language: Language): PalmReadingReport {
  const isHindi = language === 'Hindi';

  if (isHindi) {
    return {
      name: name || "अतिथि",
      age: age || 25,
      language: "Hindi",
      handType: "अग्नि हथेली (Fire Hand - चौड़ी हथेली व सुडौल अंगुलियां)",
      handTypeDescription: "आपकी हथेली का स्वरूप तीव्र ऊर्जा, उत्साह और नेतृत्व कौशल को दर्शाता है। आप निर्णय लेने में तेज और नए विचारों को अपनाने में निपुण हैं।",
      lifeLine: {
        title: "जीवन रेखा (Life Line)",
        description: "आपकी जीवन रेखा गहरी, सुस्पष्ट और धनुषाकार है जो मजबूत जीवन शक्ति और उत्तम रोग प्रतिरोधक क्षमता का संकेत देती है।",
        points: [
          "गहरी और सुचारू रेखा जो निरंतर ऊर्जा प्रवाह को दर्शाती है।",
          "जीवन के मध्य काल में नई प्राथमिकताओं और सकारात्मक बदलाव के संकेत।",
          "उत्कृष्ट सहनशक्ति और चुनौतियों से उबरने की मजबूत मानसिक शक्ति।"
        ],
        insight: "आपकी जीवन शक्ति आपको लंबी अवधि के लक्ष्यों को प्राप्त करने की अपार क्षमता प्रदान करती है।"
      },
      headLine: {
        title: "मस्तिष्क रेखा (Head Line)",
        description: "आपकी मस्तिष्क रेखा सीधी और हथेली के दूसरे छोर तक फैली हुई है, जो व्यावहारिक सोच और तीक्ष्ण विश्लेषण क्षमता को इंगित करती है।",
        points: [
          "तार्किक विचार प्रक्रिया और त्वरित समस्या समाधान क्षमता।",
          "जटिल परिस्थितियों में भी शांत और केंद्रित रहने का गुण।",
          "सीखने की गहरी ललक और नई तकनीकों को अपनाने की सहजता।"
        ],
        insight: "आपकी तीक्ष्ण बुद्धि आपको कठिन निर्णय लेने में हमेशा आगे रखती है।"
      },
      heartLine: {
        title: "हृदय रेखा (Heart Line)",
        description: "आपकी हृदय रेखा बृहस्पति पर्वत की ओर झुकी हुई है जो निष्ठा, सहानुभूति और गहरे भावनात्मक संबंधों का प्रतीक है।",
        points: [
          "सच्चा और भरोसेमंद स्वभाव, जो रिश्तों को अत्यधिक महत्व देता है।",
          "भावनात्मक संतुलन और दूसरों की भावनाओं को समझने की अद्भुत क्षमता।",
          "आत्मीय संबंधों में गहरी निष्ठा और समर्पण।"
        ],
        insight: "आपकी सहानुभूति और करुणा आपको लोगों के प्रिय बनाती है।"
      },
      fateLine: {
        title: "भाग्य रेखा (Fate Line)",
        description: "हथेली के आधार से शुरू होकर शनि पर्वत की ओर उठती भाग्य रेखा स्पष्ट और निर्बाध दिखती है।",
        points: [
          "करियर में निरंतर प्रगति और स्वावलंबन।",
          "व्यक्तिगत प्रयासों द्वारा सफलता प्राप्त करने के मजबूत योग।",
          "30 की उम्र के बाद वित्तीय स्थिरता और नए व्यावसायिक अवसर।"
        ],
        insight: "आपकी कड़ी मेहनत ही आपकी किस्मत का निर्माण करती है।"
      },
      sunLine: {
        title: "सूर्य रेखा (Sun Line)",
        description: "सूर्य पर्वत के नीचे एक सुस्पष्ट रेखा दिख रही है जो सामाजिक प्रतिष्ठा और रचनात्मक क्षमता का संकेत है।",
        points: [
          "कलात्मक या व्यावसायिक क्षेत्र में विशेष पहचान।",
          "समाज में मान-सम्मान और प्रशंसा प्राप्त करने के योग।",
          "रचनात्मक सोच द्वारा आय के नए स्रोत बनना।"
        ],
        insight: "आपकी मौलिकता आपको भीड़ में अलग पहचान दिलाएगी।"
      },
      mountAnalysis: {
        title: "ग्रह पर्वतों का विश्लेषण (Mount Analysis)",
        description: "गुरु और शुक्र पर्वत उभरे हुए और सुविकसित हैं जो नेतृत्व गुण और जीवन के प्रति सकारात्मक दृष्टिकोण प्रदर्शित करते हैं।",
        points: [
          "गुरु पर्वत (Jupiter): आत्मविश्वास और संगठन क्षमता का प्रतिनिधित्व करता है।",
          "शुक्र पर्वत (Venus): जीवन शैली, कला प्रेम और सौंदर्यबोध का प्रतीक।",
          "बुध पर्वत (Mercury): कुशल संचार और व्यावसायिक बुद्धिमत्ता का संकेत।"
        ],
        insight: "ग्रहों की संतुलित स्थिति आपको बहुमुखी प्रतिभा का धनी बनाती है।"
      },
      career: {
        title: "करियर व वित्तीय मार्गदर्शन (Career & Wealth)",
        description: "आपकी हस्तरेखा में स्वतंत्र कार्य शैली और नेतृत्वकारी पदों पर आसीन होने के मजबूत लक्षण दिखाई देते हैं।",
        points: [
          "प्रबंधन, तकनीक या उद्यमिता में उत्कृष्ट प्रदर्शन के योग।",
          "अनावश्य जोखिम के बजाय योजनाबद्ध निवेश से धन वृद्धि।",
          "कौशल विकास में किया गया निवेश दीर्घकालिक लाभ देगा।"
        ],
        insight: "रणनीतिक सोच और लगन आपको करियर के शीर्ष पर पहुंचाएगी।"
      },
      relationships: {
        title: "संबंध व पारिवारिक सौहार्द (Relationships)",
        description: "आप रिश्तों में स्पष्टता और आपसी सम्मान को प्राथमिकता देते हैं।",
        points: [
          "खुले विचार और पारदर्शी संचार से संबंध मजबूत होंगे।",
          "जीवनसाथी या प्रियजनों के साथ दीर्घकालिक सामंजस्य।",
          "सहानुभूतिपूर्ण व्यवहार से परिवार में सुख-शांति।"
        ],
        insight: "पारस्परिक विश्वास आपके हर रिश्ते की नींव है।"
      },
      strengths: [
        "तीक्ष्ण मानसिक एकाग्रता",
        "अद्भुत सहनशक्ति व धैर्य",
        "प्राकृतिक नेतृत्व क्षमता",
        "रचनात्मक समस्या समाधान",
        "सहानुभूतिपूर्ण व्यक्तित्व"
      ],
      challenges: [
        "अत्यधिक कार्यभार से बचना",
        "दूसरों से अत्यधिक अपेक्षा न रखना",
        "समय प्रबंधन पर ध्यान देना"
      ],
      futureGuidance: "आगामी वर्षों में आपकी प्राथमिकताएं और अधिक स्पष्ट होंगी। अपने अंतर्ज्ञान और विवेक पर भरोसा रखें। नियमित ध्यान या योग आपको मानसिक शांति और ऊर्जा प्रदान करेगा।",
      summary: `${name} जी, आपकी हथेली की रेखाएं एक ऊर्जावान, बुद्धिमान और संकल्पबद्ध व्यक्तित्व को प्रकट करती हैं। आपकी जीवन व मस्तिष्क रेखाओं का संतुलन आपको किसी भी परिस्थिति में विजयी बनाने की क्षमता रखता है।`,
      disclaimer: "यह एआई-जनरेटेड हस्तरेखा विश्लेषण केवल मनोरंजन और आत्म-अवलोकन के लिए है। हस्तरेखा विज्ञान का कोई वैज्ञानिक प्रमाण नहीं है और इसे व्यक्तिगत या चिकित्सकीय सलाह के रूप में नहीं माना जाना चाहिए।"
    };
  }

  return {
    name: name || "Guest",
    age: age || 25,
    language: "English",
    handType: "Fire Hand (Broad Palm & Well-Proportioned Fingers)",
    handTypeDescription: "Your palm archetype exhibits high vital energy, natural charisma, and decisive leadership instincts. You are adaptable, quick-thinking, and driven by creative intuition.",
    lifeLine: {
      title: "Life Line (Vitality & Energy)",
      description: "Your Life Line curves smoothly around the Venus mount with clarity and depth, signifying robust physical stamina and a strong immune resilience.",
      points: [
        "A deep, unbroken contour reflecting continuous life force and steady vitality.",
        "Positive personal transformations and shifts in life priorities around mid-life.",
        "High bounce-back ability from physical or emotional stress."
      ],
      insight: "Your steady energy reserve supports long-term personal ambitions."
    },
    headLine: {
      title: "Head Line (Intellect & Focus)",
      description: "Extending crisp and straight across the palm, your Head Line denotes analytical sharpness and pragmatic decision-making.",
      points: [
        "Strong logical comprehension and rapid problem-solving faculties.",
        "Remains calm, methodical, and centered under high-pressure scenarios.",
        "Innate intellectual curiosity and eagerness to master new competencies."
      ],
      insight: "Your clarity of thought serves as your master compass in challenging decisions."
    },
    heartLine: {
      title: "Heart Line (Emotions & Love)",
      description: "Ascending toward the Jupiter mount, your Heart Line reflects deep sincerity, high emotional intelligence, and warm empathy.",
      points: [
        "Loyal and genuine disposition with high regard for trust in relationships.",
        "Emotional balance and an intuitive gift for comforting others.",
        "Desire for deep, meaningful, and harmonious personal connections."
      ],
      insight: "Your empathy draws genuine affection and enduring friendships."
    },
    fateLine: {
      title: "Fate Line (Destiny & Life Path)",
      description: "Originating near the wrist and aiming towards the Saturn mount, indicating clear self-direction and career progression.",
      points: [
        "Strong self-reliance and achievement forged through individual diligence.",
        "Milestones of career consolidation and financial stability past age 28.",
        "Ability to turn unforeseen changes into fruitful opportunities."
      ],
      insight: "Your dedication is the primary architect of your future prosperity."
    },
    sunLine: {
      title: "Sun Line (Creativity & Success)",
      description: "A fine vertical line beneath the ring finger indicates creative talent, personal charm, and recognition in social circles.",
      points: [
        "Aptitude for creative problem-solving or artistic expression.",
        "Growing reputation and respect in professional endeavors.",
        "Ability to turn passions into rewarding income streams."
      ],
      insight: "Your authentic self-expression naturally commands positive attention."
    },
    mountAnalysis: {
      title: "Planetary Mounts Analysis",
      description: "Well-developed Jupiter and Venus mounts signify healthy self-confidence, appreciation for beauty, and natural optimism.",
      points: [
        "Jupiter Mount: Highlights innate leadership qualities and ethical values.",
        "Venus Mount: Indicates warm passion, aesthetic appreciation, and vitality.",
        "Mercury Mount: Points to articulate communication skills and practical sense."
      ],
      insight: "Balanced planetary mounts grant you a versatile and magnetic personality."
    },
    career: {
      title: "Career & Financial Outlook",
      description: "Your palm markings favor autonomous initiatives, managerial roles, or specialized expertise.",
      points: [
        "High success potential in leadership, technology, or creative enterprise.",
        "Wealth creation through calculated investments rather than speculative risks.",
        "Continuous skill upgrades yield substantial compound returns."
      ],
      insight: "Strategic foresight and patience will unlock your financial freedom."
    },
    relationships: {
      title: "Relationships & Harmony",
      description: "You thrive in relationships grounded in transparency, mutual respect, and intellectual alignment.",
      points: [
        "Open communication resolves interpersonal frictions smoothly.",
        "Long-term stability with partners who value independence.",
        "Empathetic listening strengthens family and romantic bonds."
      ],
      insight: "Mutual trust forms the unbreakable foundation of your close bonds."
    },
    strengths: [
      "Sharpened Mental Focus",
      "Resilient Stamina",
      "Natural Leadership",
      "Creative Problem Solving",
      "Empathetic Heart"
    ],
    challenges: [
      "Avoiding over-exertion",
      "Managing high expectations of self",
      "Balancing work with mindful rest"
    ],
    futureGuidance: "Trust your internal wisdom and stay true to your values. Embracing continuous learning and daily mindfulness will amplify your natural strengths and open rewarding horizons.",
    summary: `Dear ${name}, your palm markings reveal a remarkably resilient, intellectually sharp, and emotionally balanced individual. The harmonious alignment of your Life and Head lines endows you with the clarity and grit needed to realize your highest aspirations.`,
    disclaimer: "This AI-generated palm reading is intended for entertainment and self-reflection only. Palmistry is not scientifically validated and should not be considered a factual prediction of health, finances, or future events."
  };
}
