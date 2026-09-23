
/**
 * CAT Smart Operator Assistant — React Frontend v4
 * Pre-Shift Safety Gate · 5 Tabs · EN / HI / TA / TE
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ===========================================================================
// i18n DICTIONARY  (EN · HI · TA · TE)
// ===========================================================================
const DICT = {
  // ── ENGLISH ────────────────────────────────────────────────────────────────
  en: {
    lang: "en", voiceLang: "en-US",
    appTitle:    "CAT Smart Operator Assistant",
    appSubtitle: "EXC001 · OP1001 · Live Operations",
    navTasks:    "📋 Tasks",      navTelemetry: "📊 Telemetry",
    navSafety:   "⚠️ Safety",    navEnv:       "🌧️ Env. Analysis",
    navTraining: "🎓 Training",
    loading: "Loading data…",
    errorLoad: "Failed to load. Ensure the backend is running on port 5000.",
    errorPost: "Request failed. Check backend connection.",

    // Pre-shift gate
    gateTitle:       "REQUIRED PRE-SHIFT EQUIPMENT INSPECTION",
    gateSubtitle:    "All 8 items must be verified before the shift can begin.",
    gateProgress:    (n, t) => `${n}/${t} Completed`,
    gateUnlockBtn:   "START SHIFT & UNLOCK MACHINE",
    gateLockedHint:  "Complete all checklist items to unlock.",
    gateChecklistItems: [
      "Inspect hydraulic line pressure & leak check",
      "Verify bucket teeth & attachment integrity",
      "Check engine oil & coolant levels",
      "Test horn, lights, and reverse alarm",
      "Fasten seatbelt and test buckle sensor",
      "Clear personnel from 3 m swing radius",
      "Confirm radio & telemetry comms operational",
      "Inspect track tension & undercarriage",
    ],
    gateLogNote: "Pre-shift inspection completed by OP1001 — all 8 items signed off.",

    // Safety banner
    safetyBannerTitle: "⚠ ACTIVE SAFETY ALERT",
    seatbeltAlert:     "Seatbelt UNFASTENED — Fasten immediately before operating.",
    idlingAlert:       (m) => `Excessive idling: ${m} min detected (threshold: 45 min).`,
    playAudio: "🔊 Play Voice Alert",
    dismiss:   "Dismiss",

    // Tasks
    taskTitle:      "Daily Task Dashboard",
    taskSubtitle:   "Today's scheduled work orders — 2025-05-02",
    kpiTotal:       "Total Tasks",    kpiCompleted:    "Completed",
    kpiRemaining:   "Remaining",      kpiNextPriority: "Next Priority",
    markComplete: "✔ Complete", markProgress: "▶ Start", markPending: "⏸ Pause",
    high: "High", normal: "Normal",
    inProgress: "In Progress", pending: "Pending", completed: "Completed",
    cycleProgress: (d, t) => `${d}/${t} cycles`,

    // Telemetry
    telemetryTitle: "Live Telemetry Feed",
    colTimestamp: "Timestamp", colEngineHrs: "Engine Hrs", colFuel: "Fuel (L)",
    colLoadCycles: "Load Cycles", colIdle: "Idle (min)",
    colSeatbelt: "Seatbelt", colAlert: "Alert",
    fastened: "Fastened", unfastened: "Unfastened", yes: "YES", no: "NO",
    kpiEngineHrs: "Engine Hours", kpiFuelTotal: "Total Fuel",
    kpiLoadCycles: "Load Cycles", kpiAlerts: "Safety Alerts",

    // Safety & Proximity
    safetyTitle:         "Safety & Proximity Radar",
    proximityTitle:      "Live Proximity Hazard Monitor",
    noHazards:           "No active proximity hazards detected.",
    incidentTitle:       "Log New Incident",
    incidentType:        "Incident Type",   incidentSeverity: "Severity",
    incidentLocation:    "Location",        incidentNotes:    "Notes / Description",
    incidentSubmit:      "Submit Incident Report",
    incidentSubmitting:  "Submitting…",
    incidentSuccess:     "✅ Incident logged successfully.",
    incidentHistoryTitle:"Incident History",
    incidentTypes:       ["Near Miss","Equipment Fault","Safety Violation","Environmental","Injury","Property Damage"],
    severities:          ["LOW","MODERATE","HIGH","CRITICAL"],
    zone: "Zone", hazardType: "Hazard", severity: "Severity",
    distance: "Distance", bearing: "Bearing", operator: "Operator",

    // Env Analysis
    envTitle:      "Environmental Impact & ML Action Center",
    envSubtitle:   "Enter operating conditions for ML-powered ETA, risk assessment, and guidance.",
    lblLoadCycles: "Load Cycles",          lblFuel:    "Estimated Fuel (L)",
    lblWeather:    "Weather Severity",     lblGround:  "Ground Stability",
    lblTemp:       "Ambient Temp (°C)",
    weatherOpts:   ["0 — Clear","1 — Light Rain","2 — Heavy Rain","3 — Storm"],
    groundOpts:    ["0 — Firm / Dry","1 — Soft / Wet","2 — Loose / Muddy","3 — Unstable / Rocky"],
    analyzeBtn:    "Analyze Conditions",   analyzing:  "Analyzing…",
    resultETA:     "Predicted Task ETA",   resultRisk: "Safety Risk Level",
    resultImpacts: "Machine Limits Impact",resultActions:"Recommended Next Steps",
    minutes: "min",

    // Training
    trainingTitle:  "Operator Training & Simulation Hub",
    checklistTitle: "Pre-Shift Safety Checklist",
    checklistItems: [
      "Inspect hydraulic lines for leaks",
      "Verify bucket teeth & attachment integrity",
      "Check engine oil & coolant levels",
      "Test horn, lights, and reverse alarm",
      "Fasten seatbelt before engine start",
      "Clear personnel from 3 m swing radius",
      "Confirm radio / comms operational",
      "Check track tension and undercarriage",
    ],
    checkAll:   "All checks complete — Safe to operate! ✅",
    microTitle: "Micro-Learning Cards",
    cards: [
      { icon:"🔄", title:"Safe Swing Zones",         tag:"Safety",     body:"Always check blind spots before rotating. Maintain a 3 m exclusion zone at all times." },
      { icon:"⛽", title:"Fuel-Efficient Digging",   tag:"Efficiency", body:"Match bucket size to material density. Short cycles reduce fuel consumption by up to 18%." },
      { icon:"🏔️", title:"Adverse Terrain Protocol",tag:"Terrain",    body:"On slopes >15°, lower boom fully when parking. Engage Travel Lock on muddy surfaces." },
      { icon:"🌡️", title:"Extreme Temperature Ops", tag:"Climate",    body:"Below 0°C: 10-min warm-up idle. Above 35°C: check coolant every 2 hours." },
    ],
    simTitle: "Safety Simulator & Instructor Booking",
    simScenarios: [
      { id:"sim1", icon:"🏔️", title:"Slope Stabilisation Simulation",  desc:"Practice safe excavation on 15°–30° embankments. Includes tilt-alarm scenarios." },
      { id:"sim2", icon:"👷", title:"Pedestrian Proximity Response",    desc:"React-time drill for personnel detection within 3 m and 5 m exclusion zones." },
      { id:"sim3", icon:"⚡", title:"Overhead Utility Avoidance",       desc:"Boom height management near live cables. Includes emergency shutdown procedure." },
      { id:"sim4", icon:"🌊", title:"Flood & Soft Ground Recovery",     desc:"Machine recovery protocol on waterlogged terrain. Track-lock and extraction steps." },
    ],
    launchSim:     "Launch Simulation",
    bookInstructor:"Book Instructor Session",
    simModalTitle: "Simulation Launch",
    simModalBody:  (t) => `Launching: "${t}"\n\nIn a production build this opens the full VR/AR simulation module. Scenario parameters have been preloaded.`,
    bookModalTitle:"Instructor Booking",
    bookName:      "Your Name",    bookDate: "Preferred Date", bookScenario: "Scenario",
    bookSubmit:    "Confirm Booking",
    bookSuccess:   "✅ Booking confirmed! Instructor will contact you within 2 hours.",
    closeModal:    "Close",

    footerText: "© 2025 Caterpillar Inc. · Smart Operator Assistant · Hackathon Prototype",
  },

  // ── HINDI ──────────────────────────────────────────────────────────────────
  hi: {
    lang: "hi", voiceLang: "hi-IN",
    appTitle:    "CAT स्मार्ट ऑपरेटर सहायक",
    appSubtitle: "EXC001 · OP1001 · लाइव ऑपरेशन",
    navTasks:    "📋 टास्क",      navTelemetry: "📊 टेलीमेट्री",
    navSafety:   "⚠️ सुरक्षा",   navEnv:       "🌧️ पर्यावरण",
    navTraining: "🎓 प्रशिक्षण",
    loading:   "डेटा लोड हो रहा है…",
    errorLoad: "लोड नहीं हुआ। पोर्ट 5000 पर बैकएंड चला रहे हैं?",
    errorPost: "अनुरोध विफल। बैकएंड कनेक्शन जांचें।",

    gateTitle:       "अनिवार्य प्री-शिफ्ट उपकरण निरीक्षण",
    gateSubtitle:    "शिफ्ट शुरू करने से पहले सभी 8 आइटम सत्यापित होने चाहिए।",
    gateProgress:    (n, t) => `${n}/${t} पूर्ण`,
    gateUnlockBtn:   "शिफ्ट शुरू करें और मशीन अनलॉक करें",
    gateLockedHint:  "मशीन अनलॉक करने के लिए सभी आइटम पूर्ण करें।",
    gateChecklistItems: [
      "हाइड्रोलिक लाइन प्रेशर और लीक जांचें",
      "बकेट टीथ और अटैचमेंट की जांच करें",
      "इंजन ऑयल और कूलेंट स्तर जांचें",
      "हॉर्न, लाइट और रिवर्स अलार्म टेस्ट करें",
      "सीटबेल्ट लगाएं और बकल सेंसर टेस्ट करें",
      "3 मीटर स्विंग रेडियस से कर्मियों को हटाएं",
      "रेडियो और टेलीमेट्री कमांड की पुष्टि करें",
      "ट्रैक टेंशन और अंडरकैरिज की जांच करें",
    ],
    gateLogNote: "प्री-शिफ्ट निरीक्षण OP1001 द्वारा पूर्ण — सभी 8 आइटम हस्ताक्षरित।",

    safetyBannerTitle: "⚠ सक्रिय सुरक्षा चेतावनी",
    seatbeltAlert:     "सीटबेल्ट नहीं लगी — ऑपरेट करने से पहले तुरंत लगाएं!",
    idlingAlert:       (m) => `अत्यधिक आइडलिंग: ${m} मिनट (सीमा: 45 मिनट)।`,
    playAudio: "🔊 वॉयस अलर्ट चलाएं",
    dismiss:   "बंद करें",

    taskTitle:      "दैनिक टास्क डैशबोर्ड",
    taskSubtitle:   "आज के निर्धारित कार्य — 2025-05-02",
    kpiTotal:       "कुल टास्क",     kpiCompleted:    "पूर्ण",
    kpiRemaining:   "शेष",            kpiNextPriority: "अगली प्राथमिकता",
    markComplete: "✔ पूर्ण करें", markProgress: "▶ शुरू करें", markPending: "⏸ रोकें",
    high: "उच्च", normal: "सामान्य",
    inProgress: "प्रगति में", pending: "प्रतीक्षारत", completed: "पूर्ण",
    cycleProgress: (d, t) => `${d}/${t} साइकिल`,

    telemetryTitle: "लाइव टेलीमेट्री फीड",
    colTimestamp: "समय", colEngineHrs: "इंजन घंटे", colFuel: "ईंधन (L)",
    colLoadCycles: "लोड साइकिल", colIdle: "आइडल (मिनट)",
    colSeatbelt: "सीटबेल्ट", colAlert: "अलर्ट",
    fastened: "लगी है", unfastened: "नहीं लगी", yes: "हाँ", no: "नहीं",
    kpiEngineHrs: "इंजन घंटे", kpiFuelTotal: "कुल ईंधन",
    kpiLoadCycles: "लोड साइकिल", kpiAlerts: "सुरक्षा अलर्ट",

    safetyTitle:         "सुरक्षा और निकटता रडार",
    proximityTitle:      "लाइव निकटता खतरा मॉनिटर",
    noHazards:           "कोई सक्रिय निकटता खतरा नहीं मिला।",
    incidentTitle:       "नई घटना दर्ज करें",
    incidentType:        "घटना का प्रकार",  incidentSeverity: "गंभीरता",
    incidentLocation:    "स्थान",            incidentNotes:    "नोट्स / विवरण",
    incidentSubmit:      "घटना रिपोर्ट सबमिट करें",
    incidentSubmitting:  "सबमिट हो रहा है…",
    incidentSuccess:     "✅ घटना सफलतापूर्वक दर्ज की गई।",
    incidentHistoryTitle:"घटना इतिहास",
    incidentTypes:       ["नियर मिस","उपकरण खराबी","सुरक्षा उल्लंघन","पर्यावरण","चोट","संपत्ति क्षति"],
    severities:          ["कम","मध्यम","उच्च","गंभीर"],
    zone: "ज़ोन", hazardType: "खतरा", severity: "गंभीरता",
    distance: "दूरी", bearing: "दिशा", operator: "ऑपरेटर",

    envTitle:      "पर्यावरण प्रभाव और ML एक्शन सेंटर",
    envSubtitle:   "ऑपरेटिंग कंडीशन दर्ज करें — ML आधारित ETA, जोखिम और मार्गदर्शन पाएं।",
    lblLoadCycles: "लोड साइकिल",       lblFuel:    "अनुमानित ईंधन (L)",
    lblWeather:    "मौसम गंभीरता",     lblGround:  "भूमि स्थिरता",
    lblTemp:       "परिवेश तापमान (°C)",
    weatherOpts:   ["0 — साफ","1 — हल्की बारिश","2 — भारी बारिश","3 — तूफान"],
    groundOpts:    ["0 — ठोस / सूखा","1 — मुलायम / गीला","2 — ढीला / कीचड़","3 — अस्थिर / चट्टानी"],
    analyzeBtn:    "स्थिति का विश्लेषण करें", analyzing: "विश्लेषण हो रहा है…",
    resultETA:     "अनुमानित टास्क ETA",  resultRisk:    "सुरक्षा जोखिम स्तर",
    resultImpacts: "मशीन सीमा प्रभाव",   resultActions: "अनुशंसित अगले कदम",
    minutes: "मिनट",

    trainingTitle:  "ऑपरेटर प्रशिक्षण और सिमुलेशन केंद्र",
    checklistTitle: "प्री-शिफ्ट सुरक्षा चेकलिस्ट",
    checklistItems: [
      "हाइड्रोलिक लाइनें जांचें",
      "बकेट टीथ की जांच करें",
      "इंजन ऑयल और कूलेंट जांचें",
      "हॉर्न, लाइट और रिवर्स अलार्म टेस्ट करें",
      "इंजन से पहले सीटबेल्ट लगाएं",
      "3 मीटर स्विंग रेडियस खाली करें",
      "रेडियो संचार की जांच करें",
      "ट्रैक टेंशन और अंडरकैरिज जांचें",
    ],
    checkAll:   "सभी जांच पूरी — ऑपरेट करना सुरक्षित है! ✅",
    microTitle: "माइक्रो-लर्निंग कार्ड",
    cards: [
      { icon:"🔄", title:"सुरक्षित स्विंग ज़ोन",      tag:"सुरक्षा",  body:"घुमाने से पहले ब्लाइंड स्पॉट जांचें। 3 मीटर एक्सक्लूज़न ज़ोन बनाए रखें।" },
      { icon:"⛽", title:"ईंधन-कुशल खुदाई",           tag:"दक्षता",   body:"बकेट साइज़ सामग्री के अनुसार चुनें। छोटे चक्र ईंधन 18% बचाते हैं।" },
      { icon:"🏔️", title:"प्रतिकूल भूमि प्रोटोकॉल",  tag:"भूमि",     body:"15° से अधिक ढलान पर बूम नीचे करें। गीली सतह पर ट्रैवल लॉक लगाएं।" },
      { icon:"🌡️", title:"अत्यधिक तापमान ऑपरेशन",    tag:"जलवायु",   body:"0°C से नीचे: 10 मिनट वार्म-अप। 35°C से ऊपर: हर 2 घंटे कूलेंट जांचें।" },
    ],
    simTitle: "सेफ्टी सिमुलेटर और इंस्ट्रक्टर बुकिंग",
    simScenarios: [
      { id:"sim1", icon:"🏔️", title:"स्लोप स्टेबिलाइज़ेशन सिमुलेशन",  desc:"15°–30° तटबंध पर सुरक्षित खुदाई अभ्यास।" },
      { id:"sim2", icon:"👷", title:"पैदल यात्री निकटता प्रतिक्रिया",   desc:"3 मीटर और 5 मीटर ज़ोन में कर्मियों का पता लगाने पर अभ्यास।" },
      { id:"sim3", icon:"⚡", title:"ओवरहेड केबल से बचाव",              desc:"लाइव केबल के पास बूम ऊंचाई प्रबंधन और आपातकालीन शटडाउन।" },
      { id:"sim4", icon:"🌊", title:"मुलायम भूमि पुनर्प्राप्ति",         desc:"जलभराव वाले क्षेत्र पर मशीन रिकवरी प्रोटोकॉल।" },
    ],
    launchSim: "सिमुलेशन शुरू करें", bookInstructor: "इंस्ट्रक्टर बुक करें",
    simModalTitle: "सिमुलेशन लॉन्च",
    simModalBody:  (t) => `लॉन्च हो रहा है: "${t}"\n\nप्रोडक्शन में यह VR/AR मॉड्यूल खोलता है।`,
    bookModalTitle:"इंस्ट्रक्टर बुकिंग",
    bookName: "आपका नाम", bookDate: "पसंदीदा तारीख", bookScenario: "परिदृश्य",
    bookSubmit:  "बुकिंग की पुष्टि करें",
    bookSuccess: "✅ बुकिंग की पुष्टि हुई! इंस्ट्रक्टर 2 घंटे में संपर्क करेगा।",
    closeModal:  "बंद करें",
    footerText: "© 2025 Caterpillar Inc. · स्मार्ट ऑपरेटर सहायक · हैकाथॉन प्रोटोटाइप",
  },

  // ── TAMIL ──────────────────────────────────────────────────────────────────
  ta: {
    lang: "ta", voiceLang: "ta-IN",
    appTitle:    "CAT ஸ்மார்ட் ஆபரேட்டர் உதவியாளர்",
    appSubtitle: "EXC001 · OP1001 · நேரடி செயல்பாடு",
    navTasks:    "📋 பணிகள்",    navTelemetry: "📊 டெலிமெட்ரி",
    navSafety:   "⚠️ பாதுகாப்பு", navEnv:      "🌧️ சுற்றுச்சூழல்",
    navTraining: "🎓 பயிற்சி",
    loading:   "தரவு ஏற்றப்படுகிறது…",
    errorLoad: "ஏற்ற முடியவில்லை. போர்ட் 5000-ல் பேக்எண்ட் இயங்குகிறதா?",
    errorPost: "கோரிக்கை தோல்வியடைந்தது. பேக்எண்ட் இணைப்பை சரிபார்க்கவும்.",

    gateTitle:       "கட்டாய முன்-சாளர உபகரண ஆய்வு",
    gateSubtitle:    "சாளர தொடங்கும் முன் 8 உருப்படிகளும் சரிபார்க்கப்பட வேண்டும்.",
    gateProgress:    (n, t) => `${n}/${t} முடிந்தது`,
    gateUnlockBtn:   "சாளர தொடங்கு & இயந்திரத்தை திற",
    gateLockedHint:  "இயந்திரத்தை திறக்க அனைத்து உருப்படிகளையும் முடிக்கவும்.",
    gateChecklistItems: [
      "ஹைட்ராலிக் லைன் அழுத்தம் & கசிவு சோதனை",
      "வாளி பற்கள் & இணைப்பு ஒருமைப்பாடு சரிபார்க்கவும்",
      "இஞ்சின் எண்ணெய் & குளிரூட்டி அளவுகளை சரிபார்க்கவும்",
      "ஹார்ன், விளக்குகள் மற்றும் தலைகீழ் அலாரம் சோதிக்கவும்",
      "இருக்கை பெல்ட் கட்டி, கொக்கி சென்சார் சோதிக்கவும்",
      "3 மீ சுழல் ஆரையிலிருந்து பணியாளர்களை விலக்கவும்",
      "ரேடியோ & டெலிமெட்ரி தகவல்தொடர்பை உறுதிப்படுத்தவும்",
      "தண்டு இழுவிசை & அடிக்கட்டமைப்பை சரிபார்க்கவும்",
    ],
    gateLogNote: "முன்-சாளர ஆய்வு OP1001 ஆல் முடிக்கப்பட்டது — 8 உருப்படிகளும் கையெழுத்திடப்பட்டது.",

    safetyBannerTitle: "⚠ செயலில் உள்ள பாதுகாப்பு எச்சரிக்கை",
    seatbeltAlert:     "இருக்கை பெல்ட் கட்டப்படவில்லை — இயக்குவதற்கு முன் உடனடியாக கட்டவும்!",
    idlingAlert:       (m) => `அதிகப்படியான இட்லிங்: ${m} நிமிடம் (வரம்பு: 45 நிமிடம்).`,
    playAudio: "🔊 குரல் எச்சரிக்கை இயக்கவும்",
    dismiss:   "மூடு",

    taskTitle:      "தினசரி பணி டாஷ்போர்டு",
    taskSubtitle:   "இன்றைய திட்டமிடப்பட்ட பணி ஆர்டர்கள் — 2025-05-02",
    kpiTotal:       "மொத்த பணிகள்",    kpiCompleted:    "முடிந்தது",
    kpiRemaining:   "மீதமுள்ளது",       kpiNextPriority: "அடுத்த முன்னுரிமை",
    markComplete: "✔ முடி", markProgress: "▶ தொடங்கு", markPending: "⏸ இடைநிறுத்து",
    high: "உயர்", normal: "சாதாரண",
    inProgress: "நடப்பில்", pending: "நிலுவையில்", completed: "முடிந்தது",
    cycleProgress: (d, t) => `${d}/${t} சுழற்சிகள்`,

    telemetryTitle: "நேரடி டெலிமெட்ரி ஊட்டம்",
    colTimestamp: "நேரம்", colEngineHrs: "இஞ்சின் மணி", colFuel: "எரிபொருள் (L)",
    colLoadCycles: "சுமை சுழற்சி", colIdle: "இட்லிங் (நிமிடம்)",
    colSeatbelt: "இருக்கை பெல்ட்", colAlert: "எச்சரிக்கை",
    fastened: "கட்டப்பட்டது", unfastened: "கட்டவில்லை", yes: "ஆம்", no: "இல்லை",
    kpiEngineHrs: "இஞ்சின் மணிகள்", kpiFuelTotal: "மொத்த எரிபொருள்",
    kpiLoadCycles: "சுமை சுழற்சிகள்", kpiAlerts: "பாதுகாப்பு எச்சரிக்கைகள்",

    safetyTitle:         "பாதுகாப்பு & அருகாமை ரேடார்",
    proximityTitle:      "நேரடி அருகாமை அபாய மானிட்டர்",
    noHazards:           "செயலில் உள்ள அருகாமை அபாயங்கள் எதுவும் கண்டறியப்படவில்லை.",
    incidentTitle:       "புதிய சம்பவத்தை பதிவு செய்",
    incidentType:        "சம்பவ வகை",  incidentSeverity: "தீவிரம்",
    incidentLocation:    "இடம்",        incidentNotes:    "குறிப்புகள் / விவரம்",
    incidentSubmit:      "சம்பவ அறிக்கை சமர்ப்பி",
    incidentSubmitting:  "சமர்ப்பிக்கிறது…",
    incidentSuccess:     "✅ சம்பவம் வெற்றிகரமாக பதிவு செய்யப்பட்டது.",
    incidentHistoryTitle:"சம்பவ வரலாறு",
    incidentTypes:       ["அருகில் தவறியது","உபகரண தோல்வி","பாதுகாப்பு மீறல்","சுற்றுச்சூழல்","காயம்","சொத்து சேதம்"],
    severities:          ["குறைவு","மிதமான","உயர்","முக்கியமான"],
    zone: "மண்டலம்", hazardType: "அபாயம்", severity: "தீவிரம்",
    distance: "தூரம்", bearing: "திசை", operator: "இயக்குநர்",

    envTitle:      "சுற்றுச்சூழல் தாக்கம் & ML செயல் மையம்",
    envSubtitle:   "ML சக்தியுள்ள ETA, ஆபத்து மதிப்பீடு மற்றும் வழிகாட்டுதலுக்கு நிலைமைகளை உள்ளிடவும்.",
    lblLoadCycles: "சுமை சுழற்சிகள்",   lblFuel:    "மதிப்பிட்ட எரிபொருள் (L)",
    lblWeather:    "வானிலை தீவிரம்",     lblGround:  "தரை நிலைப்பாடு",
    lblTemp:       "சுற்றுப்புற வெப்பம் (°C)",
    weatherOpts:   ["0 — தெளிவான","1 — லேசான மழை","2 — கனமழை","3 — புயல்"],
    groundOpts:    ["0 — திட / உலர்","1 — மென்மையான / ஈரமான","2 — தளர்வான / சேறு","3 — நிலையற்ற / பாறை"],
    analyzeBtn:    "நிலைமைகளை பகுப்பாய்வு செய்",  analyzing: "பகுப்பாய்வு செய்கிறது…",
    resultETA:     "கணிக்கப்பட்ட பணி ETA",         resultRisk:    "பாதுகாப்பு ஆபத்து நிலை",
    resultImpacts: "இயந்திர வரம்பு தாக்கம்",        resultActions: "பரிந்துரைக்கப்பட்ட அடுத்த படிகள்",
    minutes: "நிமிடம்",

    trainingTitle:  "இயக்குநர் பயிற்சி & உருவகப்படுத்தல் மையம்",
    checklistTitle: "முன்-சாளர பாதுகாப்பு சரிபார்ப்பு பட்டியல்",
    checklistItems: [
      "ஹைட்ராலிக் லைன்களில் கசிவு சரிபார்க்கவும்",
      "வாளி பற்கள் & இணைப்பு சரிபார்க்கவும்",
      "இஞ்சின் எண்ணெய் & குளிரூட்டி சரிபார்க்கவும்",
      "ஹார்ன், விளக்குகள் & தலைகீழ் அலாரம் சோதிக்கவும்",
      "இஞ்சின் தொடங்கும் முன் இருக்கை பெல்ட் கட்டவும்",
      "3 மீ சுழல் ஆரையை காலி செய்யவும்",
      "ரேடியோ தகவல்தொடர்பை உறுதிப்படுத்தவும்",
      "தண்டு இழுவிசை & அடிக்கட்டமைப்பை சரிபார்க்கவும்",
    ],
    checkAll:   "அனைத்து சோதனைகளும் முடிந்தது — இயக்குவது பாதுகாப்பானது! ✅",
    microTitle: "மைக்ரோ-கற்றல் அட்டைகள்",
    cards: [
      { icon:"🔄", title:"பாதுகாப்பான சுழல் மண்டலங்கள்", tag:"பாதுகாப்பு",   body:"சுழற்றுவதற்கு முன் குருட்டு புள்ளிகளை சரிபார்க்கவும். 3 மீ விலக்கு மண்டலம் பராமரிக்கவும்." },
      { icon:"⛽", title:"எரிபொருள்-திறமையான தோண்டல்", tag:"திறன்",        body:"வாளி அளவை பொருள் அடர்த்திக்கு பொருத்தவும். குறுகிய சுழற்சிகள் 18% வரை எரிபொருளை மிச்சப்படுத்துகின்றன." },
      { icon:"🏔️", title:"பாதகமான நிலப்பரப்பு நெறிமுறை",tag:"நிலப்பரப்பு", body:">15° சரிவுகளில் நிறுத்தும்போது붐-ஐ குறைக்கவும். சேற்று நிலையில் பயண பூட்டை இயக்கவும்." },
      { icon:"🌡️", title:"தீவிர வெப்பநிலை செயல்பாடு",  tag:"காலநிலை",   body:"0°C கீழே: 10 நிமிட வார்ம்-அப். 35°C மேலே: ஒவ்வொரு 2 மணி நேரமும் குளிரூட்டி சரிபார்க்கவும்." },
    ],
    simTitle: "பாதுகாப்பு சிமுலேட்டர் & பயிற்றுனர் முன்பதிவு",
    simScenarios: [
      { id:"sim1", icon:"🏔️", title:"சரிவு நிலைப்படுத்தல் உருவகப்படுத்தல்", desc:"15°–30° கரையில் பாதுகாப்பான தோண்டல் பயிற்சி." },
      { id:"sim2", icon:"👷", title:"பாதசாரி அருகாமை எதிர்வினை",            desc:"3 மீ மற்றும் 5 மீ மண்டலங்களில் கண்டறிவதற்கான பதில் பயிற்சி." },
      { id:"sim3", icon:"⚡", title:"மேல் கேபிள் தவிர்ப்பு",                  desc:"நேரடி கேபிள்களுக்கு அருகில்붐 உயர நிர்வாகம்." },
      { id:"sim4", icon:"🌊", title:"வெள்ளம் & மென்மையான தரை மீட்பு",       desc:"நீர் தேங்கிய நிலத்தில் இயந்திர மீட்பு நெறிமுறை." },
    ],
    launchSim: "உருவகப்படுத்தல் தொடங்கு", bookInstructor: "பயிற்றுனரை முன்பதிவு செய்",
    simModalTitle: "உருவகப்படுத்தல் தொடக்கம்",
    simModalBody:  (t) => `தொடங்குகிறது: "${t}"\n\nதயாரிப்பில் இது VR/AR தொகுதியை திறக்கிறது.`,
    bookModalTitle:"பயிற்றுனர் முன்பதிவு",
    bookName: "உங்கள் பெயர்", bookDate: "விரும்பிய தேதி", bookScenario: "காட்சி",
    bookSubmit:  "முன்பதிவை உறுதிப்படுத்தவும்",
    bookSuccess: "✅ முன்பதிவு உறுதிப்படுத்தப்பட்டது! பயிற்றுனர் 2 மணி நேரத்தில் தொடர்பு கொள்வார்.",
    closeModal:  "மூடு",
    footerText: "© 2025 Caterpillar Inc. · ஸ்மார்ட் ஆபரேட்டர் உதவியாளர் · ஹேக்கத்தான் முன்மாதிரி",
  },

  // ── TELUGU ─────────────────────────────────────────────────────────────────
  te: {
    lang: "te", voiceLang: "te-IN",
    appTitle:    "CAT స్మార్ట్ ఆపరేటర్ అసిస్టెంట్",
    appSubtitle: "EXC001 · OP1001 · లైవ్ ఆపరేషన్స్",
    navTasks:    "📋 టాస్క్‌లు",   navTelemetry: "📊 టెలిమెట్రీ",
    navSafety:   "⚠️ భద్రత",       navEnv:       "🌧️ పర్యావరణం",
    navTraining: "🎓 శిక్షణ",
    loading:   "డేటా లోడ్ అవుతోంది…",
    errorLoad: "లోడ్ కాలేదు. పోర్ట్ 5000లో బ్యాకెండ్ నడుస్తోందా?",
    errorPost: "అభ్యర్థన విఫలమైంది. బ్యాకెండ్ కనెక్షన్ తనిఖీ చేయండి.",

    gateTitle:       "తప్పనిసరి ముందు-షిఫ్ట్ పరికర తనిఖీ",
    gateSubtitle:    "షిఫ్ట్ ప్రారంభించే ముందు 8 అంశాలు తప్పకుండా ధృవీకరించాలి.",
    gateProgress:    (n, t) => `${n}/${t} పూర్తయింది`,
    gateUnlockBtn:   "షిఫ్ట్ ప్రారంభించు & మెషీన్ అన్‌లాక్ చేయి",
    gateLockedHint:  "మెషీన్ అన్‌లాక్ చేయడానికి అన్ని అంశాలు పూర్తి చేయండి.",
    gateChecklistItems: [
      "హైడ్రాలిక్ లైన్ ప్రెషర్ & లీక్ తనిఖీ చేయండి",
      "బకెట్ దంతాలు & అటాచ్‌మెంట్ సమగ్రత ధృవీకరించండి",
      "ఇంజిన్ ఆయిల్ & కూలెంట్ స్థాయిలు తనిఖీ చేయండి",
      "హార్న్, లైట్లు మరియు రివర్స్ అలారం పరీక్షించండి",
      "సీట్‌బెల్ట్ పెట్టుకుని, బకిల్ సెన్సర్ పరీక్షించండి",
      "3 మీ స్వింగ్ రేడియస్ నుండి సిబ్బందిని తొలగించండి",
      "రేడియో & టెలిమెట్రీ కమ్యూనికేషన్ నిర్ధారించండి",
      "ట్రాక్ టెన్షన్ & అండర్‌కేరేజ్ తనిఖీ చేయండి",
    ],
    gateLogNote: "ముందు-షిఫ్ట్ తనిఖీ OP1001 చేత పూర్తయింది — 8 అంశాలు సంతకం చేయబడ్డాయి.",

    safetyBannerTitle: "⚠ చురుకైన భద్రతా హెచ్చరిక",
    seatbeltAlert:     "సీట్‌బెల్ట్ పెట్టుకోలేదు — ఆపరేట్ చేయడానికి ముందు వెంటనే పెట్టుకోండి!",
    idlingAlert:       (m) => `అధిక ఐడ్లింగ్: ${m} నిమిషాలు గుర్తించబడింది (పరిమితి: 45 నిమిషాలు).`,
    playAudio: "🔊 వాయిస్ అలర్ట్ ప్లే చేయండి",
    dismiss:   "మూసివేయి",

    taskTitle:      "రోజువారీ టాస్క్ డాష్‌బోర్డ్",
    taskSubtitle:   "నేటి షెడ్యూల్ చేసిన వర్క్ ఆర్డర్లు — 2025-05-02",
    kpiTotal:       "మొత్తం టాస్క్‌లు",   kpiCompleted:    "పూర్తయింది",
    kpiRemaining:   "మిగిలినవి",             kpiNextPriority: "తదుపరి ప్రాధాన్యత",
    markComplete: "✔ పూర్తి చేయి", markProgress: "▶ ప్రారంభించు", markPending: "⏸ పాజ్ చేయి",
    high: "అధిక", normal: "సాధారణ",
    inProgress: "పురోగతిలో", pending: "పెండింగ్‌లో", completed: "పూర్తయింది",
    cycleProgress: (d, t) => `${d}/${t} సైకిళ్ళు`,

    telemetryTitle: "లైవ్ టెలిమెట్రీ ఫీడ్",
    colTimestamp: "సమయం", colEngineHrs: "ఇంజిన్ గంటలు", colFuel: "ఇంధనం (L)",
    colLoadCycles: "లోడ్ సైకిళ్ళు", colIdle: "ఐడిల్ (నిమిషాలు)",
    colSeatbelt: "సీట్‌బెల్ట్", colAlert: "అలర్ట్",
    fastened: "పెట్టుకున్నారు", unfastened: "పెట్టుకోలేదు", yes: "అవును", no: "కాదు",
    kpiEngineHrs: "ఇంజిన్ గంటలు", kpiFuelTotal: "మొత్తం ఇంధనం",
    kpiLoadCycles: "లోడ్ సైకిళ్ళు", kpiAlerts: "భద్రతా హెచ్చరికలు",

    safetyTitle:         "భద్రత & సాన్నిహిత్య రాడార్",
    proximityTitle:      "లైవ్ సాన్నిహిత్య ప్రమాద మానిటర్",
    noHazards:           "చురుకైన సాన్నిహిత్య ప్రమాదాలు ఏవీ కనుగొనబడలేదు.",
    incidentTitle:       "కొత్త సంఘటనను నమోదు చేయండి",
    incidentType:        "సంఘటన రకం",   incidentSeverity: "తీవ్రత",
    incidentLocation:    "స్థానం",        incidentNotes:    "గమనికలు / వివరణ",
    incidentSubmit:      "సంఘటన నివేదిక సమర్పించండి",
    incidentSubmitting:  "సమర్పిస్తోంది…",
    incidentSuccess:     "✅ సంఘటన విజయవంతంగా నమోదైంది.",
    incidentHistoryTitle:"సంఘటన చరిత్ర",
    incidentTypes:       ["దగ్గర తప్పినది","పరికర వైఫల్యం","భద్రతా ఉల్లంఘన","పర్యావరణ","గాయం","ఆస్తి నష్టం"],
    severities:          ["తక్కువ","మధ్యస్థ","అధిక","క్రిటికల్"],
    zone: "జోన్", hazardType: "ప్రమాదం", severity: "తీవ్రత",
    distance: "దూరం", bearing: "దిశ", operator: "ఆపరేటర్",

    envTitle:      "పర్యావరణ ప్రభావం & ML యాక్షన్ సెంటర్",
    envSubtitle:   "ML ఆధారిత ETA, రిస్క్ అసెస్‌మెంట్ మరియు గైడెన్స్ కోసం పరిస్థితులను నమోదు చేయండి.",
    lblLoadCycles: "లోడ్ సైకిళ్ళు",      lblFuel:    "అంచనా ఇంధనం (L)",
    lblWeather:    "వాతావరణ తీవ్రత",     lblGround:  "భూమి స్థిరత్వం",
    lblTemp:       "పరిసర ఉష్ణోగ్రత (°C)",
    weatherOpts:   ["0 — స్పష్టంగా","1 — తేలికపాటి వర్షం","2 — భారీ వర్షం","3 — తుఫాను"],
    groundOpts:    ["0 — దృఢంగా / పొడిగా","1 — మెత్తగా / తడిగా","2 — వదులుగా / బురదగా","3 — అస్థిరంగా / రాతిగా"],
    analyzeBtn:    "పరిస్థితులను విశ్లేషించండి",  analyzing: "విశ్లేషిస్తోంది…",
    resultETA:     "అంచనా టాస్క్ ETA",              resultRisk:    "భద్రతా రిస్క్ స్థాయి",
    resultImpacts: "మెషీన్ పరిమితి ప్రభావం",        resultActions: "సిఫార్సు చేసిన తదుపరి దశలు",
    minutes: "నిమిషాలు",

    trainingTitle:  "ఆపరేటర్ శిక్షణ & సిమ్యులేషన్ హబ్",
    checklistTitle: "ముందు-షిఫ్ట్ భద్రతా చెక్‌లిస్ట్",
    checklistItems: [
      "హైడ్రాలిక్ లైన్లలో లీకులు తనిఖీ చేయండి",
      "బకెట్ దంతాలు & అటాచ్‌మెంట్ ధృవీకరించండి",
      "ఇంజిన్ ఆయిల్ & కూలెంట్ తనిఖీ చేయండి",
      "హార్న్, లైట్లు & రివర్స్ అలారం పరీక్షించండి",
      "ఇంజిన్ ముందు సీట్‌బెల్ట్ పెట్టుకోండి",
      "3 మీ స్వింగ్ రేడియస్ ఖాళీ చేయండి",
      "రేడియో కమ్యూనికేషన్ నిర్ధారించండి",
      "ట్రాక్ టెన్షన్ & అండర్‌కేరేజ్ తనిఖీ చేయండి",
    ],
    checkAll:   "అన్ని తనిఖీలు పూర్తయ్యాయి — ఆపరేట్ చేయడం సురక్షితం! ✅",
    microTitle: "మైక్రో-లెర్నింగ్ కార్డులు",
    cards: [
      { icon:"🔄", title:"సురక్షిత స్వింగ్ జోన్లు",          tag:"భద్రత",    body:"తిప్పే ముందు బ్లైండ్ స్పాట్‌లు తనిఖీ చేయండి. 3 మీ మినహాయింపు జోన్ నిర్వహించండి." },
      { icon:"⛽", title:"ఇంధన-సమర్థ తవ్వకం",               tag:"సామర్థ్యం", body:"బకెట్ పరిమాణాన్ని పదార్థ సాంద్రతకు సరిపోల్చండి. చిన్న సైకిళ్ళు 18% ఇంధనం ఆదా చేస్తాయి." },
      { icon:"🏔️", title:"ప్రతికూల భూభాగ ప్రోటోకాల్",      tag:"భూభాగం",   body:">15° వాలులలో పార్క్ చేసేటప్పుడు బూమ్ తగ్గించండి. బురద ఉపరితలాలలో ట్రావెల్ లాక్ చేయండి." },
      { icon:"🌡️", title:"తీవ్ర ఉష్ణోగ్రత ఆపరేషన్స్",      tag:"వాతావరణం", body:"0°C కింద: 10 నిమిష వార్మ్-అప్. 35°C పైన: ప్రతి 2 గంటలకు కూలెంట్ తనిఖీ చేయండి." },
    ],
    simTitle: "సేఫ్టీ సిమ్యులేటర్ & ఇన్‌స్ట్రక్టర్ బుకింగ్",
    simScenarios: [
      { id:"sim1", icon:"🏔️", title:"స్లోప్ స్టెబిలైజేషన్ సిమ్యులేషన్",  desc:"15°–30° ఎంబాంక్‌మెంట్‌లలో సురక్షిత తవ్వకం సాధన." },
      { id:"sim2", icon:"👷", title:"పాదచారి సాన్నిహిత్య స్పందన",         desc:"3 మీ మరియు 5 మీ జోన్లలో సిబ్బందిని గుర్తించడానికి స్పందన డ్రిల్." },
      { id:"sim3", icon:"⚡", title:"ఓవర్‌హెడ్ కేబుల్ నివారణ",             desc:"లైవ్ కేబుళ్ళ దగ్గర బూమ్ ఎత్తు నిర్వహణ." },
      { id:"sim4", icon:"🌊", title:"వరద & మెత్తని నేల రికవరీ",            desc:"నీరు నిండిన నేలపై మెషీన్ రికవరీ ప్రోటోకాల్." },
    ],
    launchSim: "సిమ్యులేషన్ ప్రారంభించు", bookInstructor: "ఇన్‌స్ట్రక్టర్ బుక్ చేయి",
    simModalTitle: "సిమ్యులేషన్ లాంచ్",
    simModalBody:  (t) => `ప్రారంభిస్తోంది: "${t}"\n\nప్రొడక్షన్‌లో ఇది VR/AR మాడ్యూల్ తెరుస్తుంది.`,
    bookModalTitle:"ఇన్‌స్ట్రక్టర్ బుకింగ్",
    bookName: "మీ పేరు", bookDate: "ఇష్టమైన తేదీ", bookScenario: "దృశ్యం",
    bookSubmit:  "బుకింగ్ నిర్ధారించండి",
    bookSuccess: "✅ బుకింగ్ నిర్ధారించబడింది! ఇన్‌స్ట్రక్టర్ 2 గంటల్లో సంప్రదిస్తారు.",
    closeModal:  "మూసివేయి",
    footerText: "© 2025 Caterpillar Inc. · స్మార్ట్ ఆపరేటర్ అసిస్టెంట్ · హ్యాకథాన్ నమూనా",
  },
};

const API = "http://localhost:5000/api";

// ===========================================================================
// UTILITIES
// ===========================================================================
function speak(text, voiceLang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voiceLang || "en-US";
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}

// ===========================================================================
// PRIMITIVE COMPONENTS
// ===========================================================================
function Panel({ children, className = "" }) {
  return (
    <div className={`bg-[#18181c] border border-slate-700 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <h2 className="flex items-center gap-2 text-[#FFCD11] text-xl font-bold mb-5">
      <span>{icon}</span>{title}
    </h2>
  );
}

function KPICard({ label, value, unit, color }) {
  return (
    <Panel>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-slate-600 text-xs mt-0.5">{unit}</p>
    </Panel>
  );
}

function StatusPill({ status, t }) {
  const map = { "In Progress":"bg-blue-900 text-blue-300", "Pending":"bg-slate-700 text-slate-300", "Completed":"bg-green-900 text-green-300" };
  const label = status === "In Progress" ? t.inProgress : status === "Pending" ? t.pending : t.completed;
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-700 text-slate-300"}`}>{label}</span>;
}

function SeverityPill({ severity }) {
  const map = { LOW:"bg-green-900 text-green-300", MODERATE:"bg-yellow-900 text-yellow-300", HIGH:"bg-orange-900 text-orange-300", CRITICAL:"bg-red-900 text-red-300" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[severity] || "bg-slate-700 text-slate-300"}`}>{severity}</span>;
}

function Badge({ ok, labelOk, labelBad }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ok ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>{ok ? labelOk : labelBad}</span>;
}

function RiskBadge({ level }) {
  const styles = ["bg-green-900 text-green-300 border-green-700","bg-yellow-900 text-yellow-300 border-yellow-700","bg-red-900 text-red-300 border-red-700"];
  const labels = ["LOW — OPTIMAL","MODERATE — CAUTION","CRITICAL — HIGH RISK"];
  const icons  = ["✅","⚠️","🚨"];
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${styles[level]}`}>{icons[level]} {labels[level]}</span>;
}

function LoadingSpinner({ text }) {
  return (
    <div className="py-16 text-center">
      <div className="inline-block w-8 h-8 border-4 border-[#FFCD11] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}

function ErrorBlock({ text }) {
  return <div className="m-4 p-4 bg-red-950 border border-red-700 rounded-xl text-red-300 text-sm">⚠ {text}</div>;
}

function InputRow({ label, children }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min, max, step = 1 }) {
  return (
    <input type="number" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors" />
  );
}

function SelectInput({ value, onChange, options, raw = false }) {
  return (
    <select value={value} onChange={e => onChange(raw ? e.target.value : Number(e.target.value))}
      className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors">
      {options.map((o, i) => <option key={i} value={raw ? o : i}>{o}</option>)}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors resize-none" />
  );
}

function Modal({ open, onClose, title, children }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div ref={ref} className="bg-[#18181c] border border-slate-600 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h3 className="text-[#FFCD11] font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ===========================================================================
// PRE-SHIFT SAFETY GATE (HARD LOCKOUT)
// ===========================================================================
function PreShiftGate({ t, onUnlock }) {
  const [checked, setChecked] = useState(new Array(t.gateChecklistItems.length).fill(false));
  const [unlocking, setUnlocking] = useState(false);

  // Reset if language changes
  useEffect(() => setChecked(new Array(t.gateChecklistItems.length).fill(false)), [t]);

  const toggle = i => setChecked(p => p.map((v, idx) => idx === i ? !v : v));
  const done  = checked.filter(Boolean).length;
  const total = checked.length;
  const allDone = done === total;
  const pct = Math.round((done / total) * 100);

  const handleUnlock = async () => {
    if (!allDone) return;
    setUnlocking(true);
    // POST pre-shift sign-off to /api/incidents
    try {
      await fetch(`${API}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident_type: "Pre-Shift Inspection",
          severity:      "LOW",
          notes:         t.gateLogNote,
          location:      "EXC001 — Cab",
          operator:      "OP1001",
          machineID:     "EXC001",
        }),
      });
    } catch { /* non-blocking — proceed even if backend unreachable */ }
    onUnlock();
  };

  return (
    // Full-screen blocking overlay — z-40 so it sits above everything except modals
    <div className="fixed inset-0 z-40 bg-[#0d0d0f]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#18181c] border-2 border-[#FFCD11] rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="bg-[#FFCD11] rounded-t-2xl px-6 py-5 text-center flex-shrink-0">
          <div className="text-4xl mb-2">🔒</div>
          <h1 className="text-black font-black text-lg sm:text-xl leading-tight tracking-wide">
            {t.gateTitle}
          </h1>
          <p className="text-black/70 text-xs mt-1">{t.gateSubtitle}</p>
        </div>

        {/* Scrollable checklist */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ul className="space-y-3">
            {t.gateChecklistItems.map((item, i) => (
              <li key={i} onClick={() => toggle(i)}
                className="flex items-start gap-3 cursor-pointer group select-none">
                <span className={`mt-0.5 w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                  checked[i]
                    ? "bg-green-500 border-green-500 scale-105"
                    : "border-slate-500 group-hover:border-[#FFCD11]"
                }`}>
                  {checked[i] && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={`text-sm leading-snug transition-colors ${
                  checked[i] ? "line-through text-slate-500" : "text-slate-200 group-hover:text-white"
                }`}>
                  <span className="text-slate-500 font-mono text-xs mr-2">{String(i + 1).padStart(2, "0")}.</span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar — always visible */}
        <div className="px-6 pb-6 pt-3 border-t border-slate-700 flex-shrink-0 space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className={`font-bold ${allDone ? "text-green-400" : "text-[#FFCD11]"}`}>
                {t.gateProgress(done, total)}
              </span>
              <span className="text-slate-500">{pct}%</span>
            </div>
            <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${allDone ? "bg-green-400" : "bg-[#FFCD11]"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Unlock button */}
          <button
            onClick={handleUnlock}
            disabled={!allDone || unlocking}
            className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all ${
              allDone
                ? "bg-[#FFCD11] text-black hover:bg-yellow-300 shadow-lg shadow-yellow-500/20"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            {unlocking ? "⏳ …" : allDone ? `🔓 ${t.gateUnlockBtn}` : `🔒 ${t.gateLockedHint}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// NAVBAR
// ===========================================================================
function NavBar({ t, lang, setLang, tab, setTab, locked }) {
  const tabs = [
    { id:"tasks",     label: t.navTasks },
    { id:"telemetry", label: t.navTelemetry },
    { id:"safety",    label: t.navSafety },
    { id:"env",       label: t.navEnv },
    { id:"training",  label: t.navTraining },
  ];
  return (
    <nav className="bg-[#18181c] border-b border-[#FFCD11]/30 px-4 py-3 sticky top-0 z-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFCD11] rounded-lg flex items-center justify-center font-black text-black text-base select-none shadow-lg">
            CAT
          </div>
          <div>
            <h1 className="text-[#FFCD11] font-bold text-lg leading-tight">{t.appTitle}</h1>
            <p className="text-slate-500 text-xs">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Tabs — blurred and pointer-none when locked */}
        <div className={`flex gap-1 flex-wrap transition-all duration-300 ${locked ? "opacity-30 pointer-events-none blur-sm" : ""}`}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => !locked && setTab(tb.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                tab === tb.id ? "bg-[#FFCD11] text-black" : "text-slate-300 hover:bg-slate-800"
              }`}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Language selector — always accessible */}
        <div className="flex gap-1">
          {Object.keys(DICT).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-colors ${
                lang === l ? "bg-[#FFCD11] text-black" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ===========================================================================
// GLOBAL SAFETY BANNER
// ===========================================================================
function SafetyBanner({ t, anomalies }) {
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(true), [anomalies]);
  if (!anomalies?.length || !open) return null;

  const seatbelt = anomalies.filter(a => a.flags.includes("SEATBELT_UNFASTENED"));
  const idling   = anomalies.filter(a => a.flags.includes("HIGH_IDLING"));
  const alertText = [
    seatbelt.length ? t.seatbeltAlert : "",
    idling.length   ? t.idlingAlert(idling[0].idlingTime) : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="bg-red-950 border-b-2 border-red-500 px-4 py-3 flex flex-wrap items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-red-400 font-bold text-sm tracking-wide">{t.safetyBannerTitle}</p>
        <ul className="mt-1 space-y-0.5">
          {seatbelt.length > 0 && <li className="text-white text-sm">🚨 {t.seatbeltAlert}</li>}
          {idling.map((a, i) => <li key={i} className="text-white text-sm">⏱ {t.idlingAlert(a.idlingTime)}</li>)}
        </ul>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => speak(alertText, t.voiceLang)}
          className="bg-[#FFCD11] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors">
          {t.playAudio}
        </button>
        <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white text-xl leading-none" title={t.dismiss}>✕</button>
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 1 — DAILY TASK DASHBOARD
// ===========================================================================
function TaskView({ t }) {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(r => r.json())
      .then(d => { setTasks(d.data || []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res  = await fetch(`${API}/tasks/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.status === "ok") setTasks(prev => prev.map(tk => tk.id === id ? { ...tk, status } : tk));
    } catch { /* silent */ }
  };

  if (loading) return <LoadingSpinner text={t.loading} />;
  if (error)   return <ErrorBlock text={t.errorLoad} />;

  const total     = tasks.length;
  const completed = tasks.filter(tk => tk.status === "Completed").length;
  const remaining = tasks.filter(tk => tk.status !== "Completed").length;
  const nextHigh  = tasks.find(tk => tk.priority === "High" && tk.status !== "Completed");

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle icon="📋" title={t.taskTitle} />
      <p className="text-slate-400 text-xs mb-5">{t.taskSubtitle}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <KPICard label={t.kpiTotal}        value={total}     unit="tasks"  color="text-[#FFCD11]" />
        <KPICard label={t.kpiCompleted}    value={completed} unit="done"   color="text-green-400" />
        <KPICard label={t.kpiRemaining}    value={remaining} unit="left"   color="text-orange-400" />
        <KPICard label={t.kpiNextPriority} value={nextHigh ? nextHigh.target_completion_time : "—"}
          unit={nextHigh ? nextHigh.title.split("—")[0].trim() : "none"} color="text-red-400" />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map(task => {
          const pct = task.assigned_cycles > 0 ? Math.round((task.completed_cycles / task.assigned_cycles) * 100) : 0;
          return (
            <Panel key={task.id} className={`flex flex-col gap-3 ${task.priority === "High" ? "border-orange-800" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">{task.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">📍 {task.location}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusPill status={task.status} t={t} />
                  <span className={`text-xs font-bold ${task.priority === "High" ? "text-orange-400" : "text-slate-500"}`}>
                    {task.priority === "High" ? `🔥 ${t.high}` : t.normal}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{t.cycleProgress(task.completed_cycles, task.assigned_cycles)}</span>
                  <span>{pct}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-400" : "bg-[#FFCD11]"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>🕐 Target: <span className="text-white font-medium">{task.target_completion_time}</span></span>
                <span className="text-slate-600">#{task.id}</span>
              </div>
              {task.notes && (
                <p className="text-xs text-slate-500 bg-slate-900 rounded-lg px-3 py-2 border border-slate-800">📝 {task.notes}</p>
              )}
              {task.status !== "Completed" ? (
                <div className="flex gap-2 mt-auto pt-1">
                  {task.status === "Pending" && (
                    <button onClick={() => updateStatus(task.id, "In Progress")}
                      className="flex-1 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-semibold py-1.5 rounded-lg transition-colors">
                      {t.markProgress}
                    </button>
                  )}
                  {task.status === "In Progress" && (
                    <button onClick={() => updateStatus(task.id, "Pending")}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold py-1.5 rounded-lg transition-colors">
                      {t.markPending}
                    </button>
                  )}
                  <button onClick={() => updateStatus(task.id, "Completed")}
                    className="flex-1 bg-green-900 hover:bg-green-800 text-green-200 text-xs font-semibold py-1.5 rounded-lg transition-colors">
                    {t.markComplete}
                  </button>
                </div>
              ) : (
                <div className="text-center text-green-400 text-xs font-semibold pt-1">✅ {t.completed}</div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 2 — TELEMETRY & ANOMALY LOG
// ===========================================================================
function TelemetryView({ t, telemetry, loading, error }) {
  if (loading) return <LoadingSpinner text={t.loading} />;
  if (error)   return <ErrorBlock text={t.errorLoad} />;

  const totalFuel   = telemetry.reduce((s, r) => s + r.fuelUsed, 0).toFixed(1);
  const totalCycles = telemetry.reduce((s, r) => s + r.loadCycles, 0);
  const alertCount  = telemetry.filter(r => r.safetyAlert).length;
  const lastHrs     = telemetry[telemetry.length - 1]?.engineHours ?? "—";

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle icon="📊" title={t.telemetryTitle} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <KPICard label={t.kpiEngineHrs}  value={lastHrs}     unit="hrs"    color="text-[#FFCD11]" />
        <KPICard label={t.kpiFuelTotal}  value={totalFuel}   unit="L"      color="text-blue-400"  />
        <KPICard label={t.kpiLoadCycles} value={totalCycles} unit="total"  color="text-green-400" />
        <KPICard label={t.kpiAlerts}     value={alertCount}  unit="events" color="text-red-400"   />
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-[#FFCD11] text-left">
              {[t.colTimestamp,t.colEngineHrs,t.colFuel,t.colLoadCycles,t.colIdle,t.colSeatbelt,t.colAlert].map(h => (
                <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {telemetry.map((row, i) => (
              <tr key={i} className={`border-t border-slate-800 transition-colors ${
                row.safetyAlert ? "bg-red-950/60 hover:bg-red-900/40" : "hover:bg-slate-800/50"
              }`}>
                <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{row.timestamp}</td>
                <td className="px-4 py-3 text-white">{row.engineHours}</td>
                <td className="px-4 py-3 text-white">{row.fuelUsed} L</td>
                <td className="px-4 py-3 text-white">{row.loadCycles}</td>
                <td className={`px-4 py-3 font-medium ${row.idlingTime > 45 ? "text-red-400" : "text-white"}`}>
                  {row.idlingTime}{row.idlingTime > 45 ? " ⚠" : ""}
                </td>
                <td className="px-4 py-3">
                  <Badge ok={row.seatbeltStatus === "Fastened"} labelOk={t.fastened} labelBad={t.unfastened} />
                </td>
                <td className="px-4 py-3">
                  <Badge ok={!row.safetyAlert} labelOk={t.no} labelBad={t.yes} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 3 — SAFETY & PROXIMITY RADAR
// ===========================================================================
function SafetyView({ t, anomalies }) {
  const [proximity, setProximity] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [proxLoad,  setProxLoad]  = useState(true);
  const [incLoad,   setIncLoad]   = useState(true);
  const [form, setForm]           = useState({ incident_type: "", severity: "MODERATE", location: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg,  setSubmitMsg]  = useState("");

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchProximity = useCallback(() => {
    fetch(`${API}/proximity`).then(r => r.json())
      .then(d => { setProximity(d.data || []); setProxLoad(false); })
      .catch(() => setProxLoad(false));
  }, []);

  const fetchIncidents = useCallback(() => {
    fetch(`${API}/incidents`).then(r => r.json())
      .then(d => { setIncidents(d.data || []); setIncLoad(false); })
      .catch(() => setIncLoad(false));
  }, []);

  useEffect(() => { fetchProximity(); fetchIncidents(); }, [fetchProximity, fetchIncidents]);

  const handleSubmit = async () => {
    if (!form.incident_type || !form.location || !form.notes) return;
    setSubmitting(true); setSubmitMsg("");
    try {
      const res  = await fetch(`${API}/incidents`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setSubmitMsg(t.incidentSuccess);
        setForm({ incident_type: "", severity: "MODERATE", location: "", notes: "" });
        fetchIncidents();
      } else {
        setSubmitMsg("❌ " + (data.errors?.join(", ") || t.errorPost));
      }
    } catch { setSubmitMsg("❌ " + t.errorPost); }
    finally  { setSubmitting(false); }
  };

  const sevBorder = { CRITICAL:"border-red-600",   HIGH:"border-orange-600", MODERATE:"border-yellow-600", LOW:"border-green-700" };
  const sevBg     = { CRITICAL:"bg-red-950/50",     HIGH:"bg-orange-950/40", MODERATE:"bg-yellow-950/30",  LOW:"bg-green-950/30"  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <SectionTitle icon="⚠️" title={t.safetyTitle} />

      {/* Inline safety violations */}
      {anomalies?.length > 0 && (
        <Panel className="border-red-700 bg-red-950/40">
          <p className="text-red-400 font-bold text-sm mb-2">{t.safetyBannerTitle}</p>
          <ul className="space-y-1">
            {anomalies.filter(a => a.flags.includes("SEATBELT_UNFASTENED")).length > 0 && (
              <li className="text-white text-sm">🚨 {t.seatbeltAlert}</li>
            )}
            {anomalies.filter(a => a.flags.includes("HIGH_IDLING")).map((a, i) => (
              <li key={i} className="text-white text-sm">⏱ {t.idlingAlert(a.idlingTime)}</li>
            ))}
          </ul>
          <button onClick={() => speak(
            [t.seatbeltAlert, t.idlingAlert(anomalies.find(a => a.flags.includes("HIGH_IDLING"))?.idlingTime || 0)].join(". "),
            t.voiceLang)}
            className="mt-3 bg-[#FFCD11] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors">
            {t.playAudio}
          </button>
        </Panel>
      )}

      {/* Proximity hazards */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#FFCD11]">📡</span>{t.proximityTitle}
          {proximity.filter(p => p.active).length > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {proximity.filter(p => p.active).length} ACTIVE
            </span>
          )}
        </h3>
        {proxLoad ? <LoadingSpinner text={t.loading} /> : (
          proximity.length === 0
            ? <Panel><p className="text-slate-500 text-sm text-center py-4">{t.noHazards}</p></Panel>
            : (
              <div className="grid sm:grid-cols-2 gap-4">
                {proximity.map(h => (
                  <div key={h.id}
                    className={`rounded-xl border-2 p-4 ${sevBorder[h.severity]} ${sevBg[h.severity]} ${!h.active ? "opacity-40" : ""}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-white font-bold text-sm">{h.hazard_type}</p>
                        <p className="text-slate-400 text-xs">{t.zone}: <span className="text-slate-200">{h.zone}</span></p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <SeverityPill severity={h.severity} />
                        {!h.active && <span className="text-xs text-slate-600">Resolved</span>}
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed mb-3">{h.description}</p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>📏 {t.distance}: <span className="text-white font-medium">{h.distance_m} m</span></span>
                      <span>🧭 {t.bearing}: <span className="text-white font-medium">{h.bearing}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
      </div>

      {/* Incident logging form */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#FFCD11]">📝</span>{t.incidentTitle}
        </h3>
        <Panel>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <InputRow label={t.incidentType}>
              <SelectInput value={form.incident_type} onChange={v => setF("incident_type", v)} options={t.incidentTypes} raw />
            </InputRow>
            <InputRow label={t.incidentSeverity}>
              <SelectInput value={form.severity} onChange={v => setF("severity", v)} options={["LOW","MODERATE","HIGH","CRITICAL"]} raw />
            </InputRow>
          </div>
          <div className="mb-4">
            <InputRow label={t.incidentLocation}>
              <input type="text" value={form.location} onChange={e => setF("location", e.target.value)}
                placeholder="e.g. Grid B-4"
                className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors" />
            </InputRow>
          </div>
          <div className="mb-4">
            <InputRow label={t.incidentNotes}>
              <TextArea value={form.notes} onChange={v => setF("notes", v)}
                placeholder="Describe what happened, contributing factors, and immediate actions taken…" rows={4} />
            </InputRow>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSubmit} disabled={submitting || !form.incident_type || !form.location || !form.notes}
              className="bg-[#FFCD11] hover:bg-yellow-300 disabled:opacity-40 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              {submitting ? t.incidentSubmitting : t.incidentSubmit}
            </button>
            {submitMsg && <p className="text-sm text-green-400 font-medium">{submitMsg}</p>}
          </div>
        </Panel>
      </div>

      {/* Incident history */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#FFCD11]">🗂️</span>{t.incidentHistoryTitle}
          <span className="text-xs text-slate-500 font-normal">({incidents.length} records)</span>
        </h3>
        {incLoad ? <LoadingSpinner text={t.loading} /> : (
          <div className="space-y-3">
            {[...incidents].reverse().map((inc, i) => (
              <Panel key={i} className={`border-l-4 ${
                inc.severity === "CRITICAL" ? "border-l-red-500" :
                inc.severity === "HIGH"     ? "border-l-orange-500" :
                inc.severity === "MODERATE" ? "border-l-yellow-500" : "border-l-green-600"
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-white font-semibold text-sm">{inc.incident_type}</span>
                    <span className="text-slate-500 text-xs ml-2">· {inc.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityPill severity={inc.severity} />
                    <span className="text-slate-600 text-xs font-mono">{inc.timestamp}</span>
                  </div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{inc.notes}</p>
                <p className="text-slate-600 text-xs mt-1">{t.operator}: {inc.operator} · {inc.machineID}</p>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 4 — ENVIRONMENTAL ANALYSIS & ML TIME PREDICTOR
// ===========================================================================
function EnvView({ t }) {
  const [form, setForm] = useState({ load_cycles:8, estimated_fuel:5, weather_severity:0, ground_stability:0, ambient_temp:22 });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAnalyze = async () => {
    setLoading(true); setErr(""); setResult(null);
    try {
      const res  = await fetch(`${API}/analyze-environment`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.join(", ") || "Error");
      setResult(data);
    } catch (e) { setErr(t.errorPost + " — " + e.message); }
    finally      { setLoading(false); }
  };

  const etaBarPct = result ? Math.min((result.predicted_eta_minutes / 300) * 100, 100) : 0;

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle icon="🌧️" title={t.envTitle} />
      <p className="text-slate-400 text-sm mb-6">{t.envSubtitle}</p>
      <div className="grid lg:grid-cols-2 gap-6">
        <Panel className="space-y-4">
          <InputRow label={`${t.lblLoadCycles} (1–25)`}>
            <NumInput value={form.load_cycles} onChange={v => set("load_cycles", v)} min={1} max={25} />
          </InputRow>
          <InputRow label={`${t.lblFuel} (0.5–20)`}>
            <NumInput value={form.estimated_fuel} onChange={v => set("estimated_fuel", v)} min={0.5} max={20} step={0.5} />
          </InputRow>
          <InputRow label={t.lblWeather}>
            <SelectInput value={form.weather_severity} onChange={v => set("weather_severity", v)} options={t.weatherOpts} />
          </InputRow>
          <InputRow label={t.lblGround}>
            <SelectInput value={form.ground_stability} onChange={v => set("ground_stability", v)} options={t.groundOpts} />
          </InputRow>
          <InputRow label={`${t.lblTemp} (-20 to 50)`}>
            <NumInput value={form.ambient_temp} onChange={v => set("ambient_temp", v)} min={-20} max={50} />
          </InputRow>
          <button onClick={handleAnalyze} disabled={loading}
            className="w-full bg-[#FFCD11] hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors text-sm">
            {loading ? t.analyzing : t.analyzeBtn}
          </button>
          {err && <p className="text-red-400 text-xs">{err}</p>}
        </Panel>

        <div className="space-y-4">
          {!result && !loading && (
            <Panel className="flex items-center justify-center min-h-[200px]">
              <p className="text-slate-600 text-sm text-center">
                Configure conditions and click<br />
                <span className="text-[#FFCD11] font-semibold">{t.analyzeBtn}</span>
              </p>
            </Panel>
          )}
          {loading && <LoadingSpinner text={t.analyzing} />}
          {result && (
            <>
              <Panel>
                <p className="text-slate-400 text-xs mb-2">{t.resultETA}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black text-[#FFCD11]">{result.predicted_eta_minutes}</span>
                  <span className="text-slate-400 text-sm pb-1">{t.minutes}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-[#FFCD11] h-2 rounded-full transition-all duration-700" style={{ width: `${etaBarPct}%` }} />
                </div>
              </Panel>
              <Panel>
                <p className="text-slate-400 text-xs mb-3">{t.resultRisk}</p>
                <RiskBadge level={result.risk_level} />
                <p className="text-slate-400 text-xs mt-2">{result.risk_description}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    { label:"Low",      val:result.risk_probabilities.LOW,      color:"bg-green-500" },
                    { label:"Moderate", val:result.risk_probabilities.MODERATE, color:"bg-yellow-500" },
                    { label:"Critical", val:result.risk_probabilities.CRITICAL, color:"bg-red-500" },
                  ].map(p => (
                    <div key={p.label}>
                      <div className="bg-slate-700 rounded-full h-1.5 mb-1">
                        <div className={`${p.color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${p.val * 100}%` }} />
                      </div>
                      <span className="text-slate-500">{p.label} {(p.val * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{t.resultImpacts}</p>
                <ul className="space-y-2">
                  {result.machine_impacts.map((imp, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-[#FFCD11] flex-shrink-0">•</span>{imp}
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel className={result.risk_level === 2 ? "border-red-700" : result.risk_level === 1 ? "border-yellow-700" : "border-green-800"}>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{t.resultActions}</p>
                <ul className="space-y-2">
                  {result.recommended_next_actions.map((act, i) => (
                    <li key={i} className={`flex gap-2 text-sm font-medium ${
                      result.risk_level === 2 ? "text-red-300" : result.risk_level === 1 ? "text-yellow-300" : "text-green-300"
                    }`}>
                      <span className="flex-shrink-0">{i + 1}.</span>{act}
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 5 — TRAINING & SIMULATION HUB
// ===========================================================================
function TrainingView({ t }) {
  const [checked, setChecked] = useState(() => new Array(t.checklistItems.length).fill(false));
  useEffect(() => setChecked(new Array(t.checklistItems.length).fill(false)), [t]);

  const toggle = i => setChecked(p => p.map((v, idx) => idx === i ? !v : v));
  const done = checked.filter(Boolean).length;
  const pct  = Math.round((done / checked.length) * 100);

  const [simModal,  setSimModal]  = useState(null);
  const [bookModal, setBookModal] = useState(false);
  const [bookForm,  setBookForm]  = useState({ name:"", date:"", scenario: t.simScenarios[0]?.title || "" });
  const [bookMsg,   setBookMsg]   = useState("");
  const setB = (k, v) => setBookForm(f => ({ ...f, [k]: v }));

  const tagColor = {
    Safety:"bg-red-900 text-red-300",       Efficiency:"bg-blue-900 text-blue-300",
    Terrain:"bg-amber-900 text-amber-300",  Climate:"bg-cyan-900 text-cyan-300",
    // Hindi
    सुरक्षा:"bg-red-900 text-red-300",      दक्षता:"bg-blue-900 text-blue-300",
    भूमि:"bg-amber-900 text-amber-300",     जलवायु:"bg-cyan-900 text-cyan-300",
    // Tamil
    பாதுகாப்பு:"bg-red-900 text-red-300",   திறன்:"bg-blue-900 text-blue-300",
    நிலப்பரப்பு:"bg-amber-900 text-amber-300", காலநிலை:"bg-cyan-900 text-cyan-300",
    // Telugu
    భద్రత:"bg-red-900 text-red-300",        సామర్థ్యం:"bg-blue-900 text-blue-300",
    భూభాగం:"bg-amber-900 text-amber-300",   వాతావరణం:"bg-cyan-900 text-cyan-300",
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <SectionTitle icon="🎓" title={t.trainingTitle} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <Panel>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">{t.checklistTitle}</h3>
            <span className="text-[#FFCD11] text-sm font-bold">{done}/{checked.length}</span>
          </div>
          <div className="bg-slate-700 rounded-full h-2 mb-4">
            <div className={`h-2 rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-400" : "bg-[#FFCD11]"}`}
              style={{ width: `${pct}%` }} />
          </div>
          <ul className="space-y-2.5">
            {t.checklistItems.map((item, i) => (
              <li key={i} onClick={() => toggle(i)} className="flex items-start gap-3 cursor-pointer group select-none">
                <span className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                  checked[i] ? "bg-green-500 border-green-500" : "border-slate-600 group-hover:border-[#FFCD11]"
                }`}>
                  {checked[i] && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={`text-sm transition-colors ${checked[i] ? "line-through text-slate-600" : "text-slate-300 group-hover:text-white"}`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          {pct === 100 && <p className="mt-4 text-center text-green-400 font-semibold text-sm">{t.checkAll}</p>}
        </Panel>

        {/* Micro-learning cards */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">{t.microTitle}</h3>
          {t.cards.map((card, i) => (
            <Panel key={i} className="hover:border-[#FFCD11]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{card.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColor[card.tag] || "bg-slate-700 text-slate-300"}`}>
                      {card.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{card.body}</p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      {/* Safety Simulator */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-[#FFCD11]">🎮</span>{t.simTitle}
          </h3>
          <button onClick={() => { setBookModal(true); setBookMsg(""); }}
            className="bg-slate-700 hover:bg-slate-600 text-[#FFCD11] font-bold text-xs px-4 py-2 rounded-lg border border-[#FFCD11]/40 transition-colors">
            📅 {t.bookInstructor}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {t.simScenarios.map(sc => (
            <Panel key={sc.id} className="flex flex-col gap-3 hover:border-[#FFCD11]/40 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{sc.icon}</span>
                <div>
                  <h4 className="text-white font-semibold text-sm">{sc.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">{sc.desc}</p>
                </div>
              </div>
              <button onClick={() => setSimModal(sc)}
                className="w-full bg-[#FFCD11] hover:bg-yellow-300 text-black font-bold text-xs py-2 rounded-lg transition-colors mt-auto">
                🚀 {t.launchSim}
              </button>
            </Panel>
          ))}
        </div>
      </div>

      {/* Simulation launch modal */}
      <Modal open={!!simModal} onClose={() => setSimModal(null)} title={t.simModalTitle}>
        {simModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-4xl">{simModal.icon}</span>
              <div>
                <p className="text-white font-semibold">{simModal.title}</p>
                <p className="text-slate-400 text-xs mt-1">{simModal.desc}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{t.simModalBody(simModal.title)}</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#FFCD11] hover:bg-yellow-300 text-black font-bold py-2.5 rounded-xl text-sm transition-colors">
                ▶ {t.launchSim}
              </button>
              <button onClick={() => setSimModal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-colors">
                {t.closeModal}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Instructor booking modal */}
      <Modal open={bookModal} onClose={() => setBookModal(false)} title={t.bookModalTitle}>
        <div className="space-y-4">
          <InputRow label={t.bookName}>
            <input type="text" value={bookForm.name} onChange={e => setB("name", e.target.value)}
              className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors" />
          </InputRow>
          <InputRow label={t.bookDate}>
            <input type="date" value={bookForm.date} onChange={e => setB("date", e.target.value)}
              className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors [color-scheme:dark]" />
          </InputRow>
          <InputRow label={t.bookScenario}>
            <SelectInput value={bookForm.scenario} onChange={v => setB("scenario", v)}
              options={t.simScenarios.map(s => s.title)} raw />
          </InputRow>
          {bookMsg
            ? <div className="p-3 bg-green-950 border border-green-700 rounded-xl text-green-300 text-sm text-center">{bookMsg}</div>
            : <button onClick={() => setBookMsg(t.bookSuccess)} disabled={!bookForm.name || !bookForm.date}
                className="w-full bg-[#FFCD11] hover:bg-yellow-300 disabled:opacity-40 text-black font-bold py-2.5 rounded-xl text-sm transition-colors">
                {t.bookSubmit}
              </button>
          }
        </div>
      </Modal>
    </div>
  );
}

// ===========================================================================
// ROOT APP
// ===========================================================================
export default function App() {
  const [lang, setLang]       = useState("en");
  const [tab,  setTab]        = useState("tasks");
  const [unlocked, setUnlocked] = useState(false);   // false = gate showing

  const t = DICT[lang];

  const [telemetry, setTelemetry] = useState([]);
  const [telemLoad, setTelemLoad] = useState(true);
  const [telemErr,  setTelemErr]  = useState(false);
  const [anomalies, setAnomalies] = useState([]);

  const fetchAll = useCallback(async () => {
    setTelemLoad(true); setTelemErr(false);
    try {
      const [tRes, aRes] = await Promise.all([
        fetch(`${API}/telemetry`),
        fetch(`${API}/anomalies`),
      ]);
      const tData = await tRes.json();
      const aData = await aRes.json();
      setTelemetry(tData.data      || []);
      setAnomalies(aData.anomalies || []);
    } catch { setTelemErr(true); }
    finally  { setTelemLoad(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">

      {/* Pre-shift gate — rendered on top; blurs everything behind it */}
      {!unlocked && (
        <PreShiftGate t={t} onUnlock={() => setUnlocked(true)} />
      )}

      {/* Main shell — always rendered but blurred/non-interactive when locked */}
      <div className={`flex flex-col flex-1 transition-all duration-500 ${!unlocked ? "blur-sm pointer-events-none select-none" : ""}`}>
        <NavBar t={t} lang={lang} setLang={setLang} tab={tab} setTab={setTab} locked={!unlocked} />
        <SafetyBanner t={t} anomalies={anomalies} />

        <main className="flex-1">
          {tab === "tasks"     && <TaskView      t={t} />}
          {tab === "telemetry" && <TelemetryView t={t} telemetry={telemetry} loading={telemLoad} error={telemErr} />}
          {tab === "safety"    && <SafetyView    t={t} anomalies={anomalies} />}
          {tab === "env"       && <EnvView       t={t} />}
          {tab === "training"  && <TrainingView  t={t} />}
        </main>

        <footer className="bg-[#18181c] border-t border-slate-800 px-4 py-3 text-center text-slate-600 text-xs">
          {t.footerText}
        </footer>
      </div>
    </div>
  );
}
