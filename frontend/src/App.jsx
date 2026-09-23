/**
 * CAT Smart Operator Assistant — React Frontend v2
 * Upgraded UI + Dual-Output ML Environmental Action Center
 */

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// i18n Dictionary
// ---------------------------------------------------------------------------
const DICT = {
  en: {
    appTitle: "CAT Smart Operator Assistant",
    appSubtitle: "EXC001 · OP1001 · Live Operations",
    navTelemetry: "Telemetry",
    navEnvironment: "Env. Analysis",
    navTraining: "Training Hub",
    // Safety banner
    safetyBannerTitle: "⚠ ACTIVE SAFETY ALERT",
    seatbeltAlert: "Seatbelt UNFASTENED — Fasten immediately before operating.",
    idlingAlert: (m) => `Excessive idling: ${m} min detected (threshold: 45 min).`,
    playAudio: "🔊 Play Voice Alert",
    dismiss: "Dismiss",
    // Telemetry
    telemetryTitle: "Live Telemetry Feed",
    colTimestamp: "Timestamp",
    colEngineHrs: "Engine Hrs",
    colFuel: "Fuel (L)",
    colCycles: "Load Cycles",
    colIdle: "Idle (min)",
    colSeatbelt: "Seatbelt",
    colAlert: "Alert",
    fastened: "Fastened",
    unfastened: "Unfastened",
    yes: "YES",
    no: "NO",
    kpiEngineHrs: "Engine Hours",
    kpiFuelTotal: "Total Fuel",
    kpiCycles: "Load Cycles",
    kpiAlerts: "Safety Alerts",
    // Environment analysis
    envTitle: "Environmental Impact & Action Center",
    envSubtitle: "Enter operating conditions to get ML-powered ETA, risk assessment, and operator guidance.",
    lblLoadCycles: "Load Cycles",
    lblFuel: "Estimated Fuel (L)",
    lblWeather: "Weather Severity",
    lblGround: "Ground Stability",
    lblTemp: "Ambient Temp (°C)",
    weatherOpts: ["0 — Clear", "1 — Light Rain", "2 — Heavy Rain", "3 — Storm"],
    groundOpts: ["0 — Firm / Dry", "1 — Soft / Wet", "2 — Loose / Muddy", "3 — Unstable / Rocky"],
    analyzeBtn: "Analyze Conditions",
    analyzing: "Analyzing…",
    resultETA: "Predicted Task ETA",
    resultRisk: "Safety Risk Level",
    resultImpacts: "Machine Limits Impact",
    resultActions: "Recommended Next Steps",
    minutes: "min",
    // Training
    trainingTitle: "Operator Training Hub",
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
    microTitle: "Micro-Learning Cards",
    cards: [
      { icon: "🔄", title: "Safe Swing Zones", tag: "Safety", body: "Always check blind spots before rotating the upper structure. Maintain a 3 m exclusion zone around the machine at all times." },
      { icon: "⛽", title: "Fuel-Efficient Digging", tag: "Efficiency", body: "Match bucket size to material density. Short, deliberate cycles reduce fuel consumption by up to 18%." },
      { icon: "🏔️", title: "Adverse Terrain Protocol", tag: "Terrain", body: "On slopes >15°, lower the boom fully when parking. Engage Travel Lock on muddy or wet surfaces." },
      { icon: "🌡️", title: "Extreme Temperature Ops", tag: "Climate", body: "Below 0°C: run 10-min warm-up idle. Above 35°C: check coolant every 2 hours and reduce continuous duty cycle." },
    ],
    checkAll: "All checks complete — Safe to operate! ✅",
    // General
    loading: "Loading data…",
    errorLoad: "Failed to load. Check the backend is running on port 5000.",
    errorAnalyze: "Analysis failed. Check backend connection.",
    footerText: "© 2025 Caterpillar Inc. · Smart Operator Assistant · Hackathon Prototype",
  },

  es: {
    appTitle: "Asistente Inteligente CAT",
    appSubtitle: "EXC001 · OP1001 · Operaciones en Vivo",
    navTelemetry: "Telemetría",
    navEnvironment: "Análisis Amb.",
    navTraining: "Capacitación",
    safetyBannerTitle: "⚠ ALERTA DE SEGURIDAD ACTIVA",
    seatbeltAlert: "Cinturón NO abrochado — ¡Abróchelo antes de operar!",
    idlingAlert: (m) => `Ralentí excesivo: ${m} min detectados (umbral: 45 min).`,
    playAudio: "🔊 Reproducir Alerta",
    dismiss: "Cerrar",
    telemetryTitle: "Telemetría en Vivo",
    colTimestamp: "Hora",
    colEngineHrs: "Horas Motor",
    colFuel: "Combustible (L)",
    colCycles: "Ciclos",
    colIdle: "Ralentí (min)",
    colSeatbelt: "Cinturón",
    colAlert: "Alerta",
    fastened: "Abrochado",
    unfastened: "No Abrochado",
    yes: "SÍ",
    no: "NO",
    kpiEngineHrs: "Horas Motor",
    kpiFuelTotal: "Combustible Total",
    kpiCycles: "Ciclos de Carga",
    kpiAlerts: "Alertas de Seguridad",
    envTitle: "Centro de Impacto Ambiental",
    envSubtitle: "Ingrese las condiciones para obtener ETA, riesgo y orientación del operador.",
    lblLoadCycles: "Ciclos de Carga",
    lblFuel: "Combustible Estimado (L)",
    lblWeather: "Severidad del Clima",
    lblGround: "Estabilidad del Suelo",
    lblTemp: "Temperatura Ambiente (°C)",
    weatherOpts: ["0 — Despejado", "1 — Lluvia Ligera", "2 — Lluvia Fuerte", "3 — Tormenta"],
    groundOpts: ["0 — Firme / Seco", "1 — Blando / Mojado", "2 — Suelto / Lodoso", "3 — Inestable / Rocoso"],
    analyzeBtn: "Analizar Condiciones",
    analyzing: "Analizando…",
    resultETA: "ETA de Tarea Predicha",
    resultRisk: "Nivel de Riesgo",
    resultImpacts: "Impacto en la Máquina",
    resultActions: "Próximos Pasos Recomendados",
    minutes: "min",
    trainingTitle: "Centro de Capacitación",
    checklistTitle: "Lista Pre-Turno",
    checklistItems: [
      "Inspeccionar líneas hidráulicas",
      "Verificar dientes del cucharón",
      "Revisar aceite de motor y refrigerante",
      "Probar bocina, luces y alarma de retroceso",
      "Abrochar cinturón antes de arrancar",
      "Despejar radio de giro de 3 m",
      "Confirmar radio y comunicaciones",
      "Revisar tensión de orugas",
    ],
    microTitle: "Tarjetas de Aprendizaje",
    cards: [
      { icon: "🔄", title: "Zonas de Giro Seguras", tag: "Seguridad", body: "Verifique puntos ciegos antes de rotar. Mantenga zona de exclusión de 3 m alrededor de la máquina." },
      { icon: "⛽", title: "Excavación Eficiente", tag: "Eficiencia", body: "Adapte el cucharón a la densidad del material. Los ciclos cortos reducen combustible un 18%." },
      { icon: "🏔️", title: "Terreno Adverso", tag: "Terreno", body: "En pendientes >15°, baje el boom al estacionar. Active bloqueo de traslado en superficies mojadas." },
      { icon: "🌡️", title: "Operación en Temperaturas Extremas", tag: "Clima", body: "Bajo 0°C: 10 min de ralentí. Sobre 35°C: revisar refrigerante cada 2 horas." },
    ],
    checkAll: "¡Todas las verificaciones completas — Seguro para operar! ✅",
    loading: "Cargando datos…",
    errorLoad: "Error al cargar. Verifique el backend en el puerto 5000.",
    errorAnalyze: "Análisis fallido. Verifique la conexión al backend.",
    footerText: "© 2025 Caterpillar Inc. · Asistente Inteligente · Prototipo",
  },

  hi: {
    appTitle: "CAT स्मार्ट ऑपरेटर सहायक",
    appSubtitle: "EXC001 · OP1001 · लाइव ऑपरेशन",
    navTelemetry: "टेलीमेट्री",
    navEnvironment: "पर्यावरण विश्लेषण",
    navTraining: "प्रशिक्षण",
    safetyBannerTitle: "⚠ सक्रिय सुरक्षा चेतावनी",
    seatbeltAlert: "सीटबेल्ट नहीं लगी — ऑपरेट करने से पहले तुरंत लगाएं!",
    idlingAlert: (m) => `अत्यधिक आइडलिंग: ${m} मिनट (सीमा: 45 मिनट)।`,
    playAudio: "🔊 वॉयस अलर्ट चलाएं",
    dismiss: "बंद करें",
    telemetryTitle: "लाइव टेलीमेट्री फीड",
    colTimestamp: "समय",
    colEngineHrs: "इंजन घंटे",
    colFuel: "ईंधन (L)",
    colCycles: "लोड साइकिल",
    colIdle: "आइडल (मिनट)",
    colSeatbelt: "सीटबेल्ट",
    colAlert: "अलर्ट",
    fastened: "लगी है",
    unfastened: "नहीं लगी",
    yes: "हाँ",
    no: "नहीं",
    kpiEngineHrs: "इंजन घंटे",
    kpiFuelTotal: "कुल ईंधन",
    kpiCycles: "लोड साइकिल",
    kpiAlerts: "सुरक्षा अलर्ट",
    envTitle: "पर्यावरण प्रभाव और एक्शन सेंटर",
    envSubtitle: "ऑपरेटिंग कंडीशन दर्ज करें — ML आधारित ETA, जोखिम और मार्गदर्शन पाएं।",
    lblLoadCycles: "लोड साइकिल",
    lblFuel: "अनुमानित ईंधन (L)",
    lblWeather: "मौसम गंभीरता",
    lblGround: "भूमि स्थिरता",
    lblTemp: "परिवेश तापमान (°C)",
    weatherOpts: ["0 — साफ", "1 — हल्की बारिश", "2 — भारी बारिश", "3 — तूफान"],
    groundOpts: ["0 — ठोस / सूखा", "1 — मुलायम / गीला", "2 — ढीला / कीचड़", "3 — अस्थिर / चट्टानी"],
    analyzeBtn: "स्थिति का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है…",
    resultETA: "अनुमानित टास्क ETA",
    resultRisk: "सुरक्षा जोखिम स्तर",
    resultImpacts: "मशीन सीमा प्रभाव",
    resultActions: "अनुशंसित अगले कदम",
    minutes: "मिनट",
    trainingTitle: "ऑपरेटर प्रशिक्षण केंद्र",
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
    microTitle: "माइक्रो-लर्निंग कार्ड",
    cards: [
      { icon: "🔄", title: "सुरक्षित स्विंग ज़ोन", tag: "सुरक्षा", body: "घुमाने से पहले ब्लाइंड स्पॉट जांचें। मशीन के चारों ओर 3 मीटर का एक्सक्लूज़न ज़ोन बनाए रखें।" },
      { icon: "⛽", title: "ईंधन-कुशल खुदाई", tag: "दक्षता", body: "बकेट साइज़ सामग्री के अनुसार चुनें। छोटे चक्र ईंधन 18% बचाते हैं।" },
      { icon: "🏔️", title: "प्रतिकूल भूमि प्रोटोकॉल", tag: "भूमि", body: "15° से अधिक ढलान पर पार्किंग करते समय बूम नीचे करें। गीली सतह पर ट्रैवल लॉक लगाएं।" },
      { icon: "🌡️", title: "अत्यधिक तापमान ऑपरेशन", tag: "जलवायु", body: "0°C से नीचे: 10 मिनट वार्म-अप आइडल। 35°C से ऊपर: हर 2 घंटे कूलेंट जांचें।" },
    ],
    checkAll: "सभी जांच पूरी — ऑपरेट करना सुरक्षित है! ✅",
    loading: "डेटा लोड हो रहा है…",
    errorLoad: "लोड नहीं हुआ। पोर्ट 5000 पर बैकएंड चला रहे हैं?",
    errorAnalyze: "विश्लेषण विफल। बैकएंड कनेक्शन जांचें।",
    footerText: "© 2025 Caterpillar Inc. · स्मार्ट ऑपरेटर सहायक · हैकाथॉन प्रोटोटाइप",
  },
};

const VOICE_LANG = { en: "en-US", es: "es-ES", hi: "hi-IN" };
const API = "http://localhost:5000/api";

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
function speak(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[lang] || "en-US";
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}

// ---------------------------------------------------------------------------
// Primitive components
// ---------------------------------------------------------------------------
function Badge({ ok, labelOk, labelBad }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
      ok ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
    }`}>
      {ok ? labelOk : labelBad}
    </span>
  );
}

function RiskBadge({ level }) {
  const styles = [
    "bg-green-900 text-green-300 border-green-700",
    "bg-yellow-900 text-yellow-300 border-yellow-700",
    "bg-red-900 text-red-300 border-red-700",
  ];
  const labels = ["LOW — OPTIMAL", "MODERATE — CAUTION", "CRITICAL — HIGH RISK"];
  const icons  = ["✅", "⚠️", "🚨"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${styles[level]}`}>
      {icons[level]} {labels[level]}
    </span>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <h2 className="flex items-center gap-2 text-[#FFCD11] text-xl font-bold mb-5">
      <span>{icon}</span>{title}
    </h2>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div className={`bg-[#18181c] border border-slate-700 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
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
    <input
      type="number" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors"
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value} onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-[#0d0d0f] border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFCD11] transition-colors"
    >
      {options.map((o, i) => <option key={i} value={i}>{o}</option>)}
    </select>
  );
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
  return (
    <div className="m-4 p-4 bg-red-950 border border-red-700 rounded-xl text-red-300 text-sm">⚠ {text}</div>
  );
}

// ---------------------------------------------------------------------------
// NavBar
// ---------------------------------------------------------------------------
function NavBar({ t, lang, setLang, tab, setTab }) {
  const tabs = [
    { id: "telemetry",   label: t.navTelemetry },
    { id: "environment", label: t.navEnvironment },
    { id: "training",    label: t.navTraining },
  ];
  return (
    <nav className="bg-[#18181c] border-b border-[#FFCD11]/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFCD11] rounded-lg flex items-center justify-center font-black text-black text-base select-none shadow-lg">
          CAT
        </div>
        <div>
          <h1 className="text-[#FFCD11] font-bold text-lg leading-tight">{t.appTitle}</h1>
          <p className="text-slate-500 text-xs">{t.appSubtitle}</p>
        </div>
      </div>
      <div className="flex gap-1 flex-wrap">
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === tb.id ? "bg-[#FFCD11] text-black" : "text-slate-300 hover:bg-slate-800"
            }`}>
            {tb.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {["en", "es", "hi"].map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-colors ${
              lang === l ? "bg-[#FFCD11] text-black" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}>
            {l}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Safety Banner
// ---------------------------------------------------------------------------
function SafetyBanner({ t, lang, anomalies }) {
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
        <button onClick={() => speak(alertText, lang)}
          className="bg-[#FFCD11] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors">
          {t.playAudio}
        </button>
        <button onClick={() => setOpen(false)}
          className="text-slate-500 hover:text-white text-xl leading-none transition-colors" title={t.dismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View 1 — Telemetry
// ---------------------------------------------------------------------------
function TelemetryView({ t, telemetry, loading, error }) {
  if (loading) return <LoadingSpinner text={t.loading} />;
  if (error)   return <ErrorBlock text={t.errorLoad} />;

  const totalFuel   = telemetry.reduce((s, r) => s + r.fuelUsed, 0).toFixed(1);
  const totalCycles = telemetry.reduce((s, r) => s + r.loadCycles, 0);
  const alertCount  = telemetry.filter(r => r.safetyAlert).length;
  const lastHrs     = telemetry[telemetry.length - 1]?.engineHours ?? "—";

  const kpis = [
    { label: t.kpiEngineHrs, value: lastHrs,      unit: "hrs",   color: "text-[#FFCD11]" },
    { label: t.kpiFuelTotal, value: totalFuel,    unit: "L",     color: "text-blue-400"  },
    { label: t.kpiCycles,    value: totalCycles,  unit: "total", color: "text-green-400" },
    { label: t.kpiAlerts,    value: alertCount,   unit: "events",color: "text-red-400"   },
  ];

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle icon="📡" title={t.telemetryTitle} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {kpis.map(k => (
          <Panel key={k.label}>
            <p className="text-slate-500 text-xs mb-1">{k.label}</p>
            <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-slate-600 text-xs mt-0.5">{k.unit}</p>
          </Panel>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-[#FFCD11] text-left">
              {[t.colTimestamp, t.colEngineHrs, t.colFuel, t.colCycles, t.colIdle, t.colSeatbelt, t.colAlert].map(h => (
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

// ---------------------------------------------------------------------------
// View 2 — Environmental Impact & Action Center
// ---------------------------------------------------------------------------
function EnvironmentView({ t }) {
  const [form, setForm] = useState({
    load_cycles: 8, estimated_fuel: 5, weather_severity: 0, ground_stability: 0, ambient_temp: 22,
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAnalyze = async () => {
    setLoading(true); setErr(""); setResult(null);
    try {
      const res  = await fetch(`${API}/analyze-environment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.join(", ") || "Error");
      setResult(data);
    } catch (e) {
      setErr(t.errorAnalyze + " — " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const etaBarPct = result ? Math.min((result.predicted_eta_minutes / 300) * 100, 100) : 0;

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle icon="🌍" title={t.envTitle} />
      <p className="text-slate-400 text-sm mb-6">{t.envSubtitle}</p>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ── Input form ── */}
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
            className="w-full bg-[#FFCD11] hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors text-sm mt-2">
            {loading ? t.analyzing : t.analyzeBtn}
          </button>
          {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
        </Panel>

        {/* ── Results ── */}
        <div className="space-y-4">
          {!result && !loading && (
            <Panel className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-slate-600 text-sm text-center">
                Configure conditions on the left and click<br />
                <span className="text-[#FFCD11] font-semibold">{t.analyzeBtn}</span>
              </p>
            </Panel>
          )}
          {loading && <LoadingSpinner text={t.analyzing} />}

          {result && (
            <>
              {/* ETA card */}
              <Panel>
                <p className="text-slate-400 text-xs mb-2">{t.resultETA}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black text-[#FFCD11]">{result.predicted_eta_minutes}</span>
                  <span className="text-slate-400 text-sm pb-1">{t.minutes}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-[#FFCD11] h-2 rounded-full transition-all duration-700"
                    style={{ width: `${etaBarPct}%` }} />
                </div>
              </Panel>

              {/* Risk badge card */}
              <Panel>
                <p className="text-slate-400 text-xs mb-3">{t.resultRisk}</p>
                <RiskBadge level={result.risk_level} />
                <p className="text-slate-400 text-xs mt-2">{result.risk_description}</p>
                {/* Probability mini-bar */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    { label: "Low",      val: result.risk_probabilities.LOW,      color: "bg-green-500" },
                    { label: "Moderate", val: result.risk_probabilities.MODERATE, color: "bg-yellow-500" },
                    { label: "Critical", val: result.risk_probabilities.CRITICAL, color: "bg-red-500" },
                  ].map(p => (
                    <div key={p.label}>
                      <div className="bg-slate-700 rounded-full h-1.5 mb-1">
                        <div className={`${p.color} h-1.5 rounded-full transition-all duration-700`}
                          style={{ width: `${p.val * 100}%` }} />
                      </div>
                      <span className="text-slate-500">{p.label} {(p.val * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Machine impacts */}
              <Panel>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  {t.resultImpacts}
                </p>
                <ul className="space-y-2">
                  {result.machine_impacts.map((imp, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-[#FFCD11] flex-shrink-0 mt-0.5">•</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </Panel>

              {/* Recommended actions */}
              <Panel className={result.risk_level === 2 ? "border-red-700" : result.risk_level === 1 ? "border-yellow-700" : "border-green-800"}>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  {t.resultActions}
                </p>
                <ul className="space-y-2">
                  {result.recommended_next_actions.map((act, i) => (
                    <li key={i} className={`flex gap-2 text-sm font-medium ${
                      result.risk_level === 2 ? "text-red-300" : result.risk_level === 1 ? "text-yellow-300" : "text-green-300"
                    }`}>
                      <span className="flex-shrink-0 mt-0.5">{i + 1}.</span>
                      {act}
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

// ---------------------------------------------------------------------------
// View 3 — Training Hub
// ---------------------------------------------------------------------------
function TrainingView({ t }) {
  const [checked, setChecked] = useState(() => new Array(t.checklistItems.length).fill(false));
  useEffect(() => setChecked(new Array(t.checklistItems.length).fill(false)), [t]);

  const toggle = i => setChecked(p => p.map((v, idx) => idx === i ? !v : v));
  const done   = checked.filter(Boolean).length;
  const pct    = Math.round((done / checked.length) * 100);

  const tagColor = {
    Safety: "bg-red-900 text-red-300", Efficiency: "bg-blue-900 text-blue-300",
    Terrain: "bg-amber-900 text-amber-300", Climate: "bg-cyan-900 text-cyan-300",
    Seguridad: "bg-red-900 text-red-300", Eficiencia: "bg-blue-900 text-blue-300",
    Terreno: "bg-amber-900 text-amber-300", Clima: "bg-cyan-900 text-cyan-300",
    सुरक्षा: "bg-red-900 text-red-300", दक्षता: "bg-blue-900 text-blue-300",
    भूमि: "bg-amber-900 text-amber-300", जलवायु: "bg-cyan-900 text-cyan-300",
  };

  return (
    <div className="p-4 sm:p-6">
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
              <li key={i} onClick={() => toggle(i)}
                className="flex items-start gap-3 cursor-pointer group select-none">
                <span className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                  checked[i] ? "bg-green-500 border-green-500" : "border-slate-600 group-hover:border-[#FFCD11]"
                }`}>
                  {checked[i] && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={`text-sm transition-colors ${
                  checked[i] ? "line-through text-slate-600" : "text-slate-300 group-hover:text-white"
                }`}>{item}</span>
              </li>
            ))}
          </ul>
          {pct === 100 && (
            <p className="mt-4 text-center text-green-400 font-semibold text-sm">{t.checkAll}</p>
          )}
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  const [lang, setLang] = useState("en");
  const [tab,  setTab]  = useState("telemetry");
  const t = DICT[lang];

  const [telemetry,  setTelemetry]  = useState([]);
  const [telemLoad,  setTelemLoad]  = useState(true);
  const [telemErr,   setTelemErr]   = useState(false);

  const [anomalies,  setAnomalies]  = useState([]);

  const fetchAll = useCallback(async () => {
    setTelemLoad(true); setTelemErr(false);
    try {
      const [tRes, aRes] = await Promise.all([
        fetch(`${API}/telemetry`),
        fetch(`${API}/anomalies`),
      ]);
      const tData = await tRes.json();
      const aData = await aRes.json();
      setTelemetry(tData.data  || []);
      setAnomalies(aData.anomalies || []);
    } catch {
      setTelemErr(true);
    } finally {
      setTelemLoad(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      <NavBar t={t} lang={lang} setLang={setLang} tab={tab} setTab={setTab} />
      <SafetyBanner t={t} lang={lang} anomalies={anomalies} />

      <main className="flex-1">
        {tab === "telemetry"   && <TelemetryView   t={t} telemetry={telemetry} loading={telemLoad} error={telemErr} />}
        {tab === "environment" && <EnvironmentView t={t} />}
        {tab === "training"    && <TrainingView    t={t} />}
      </main>

      <footer className="bg-[#18181c] border-t border-slate-800 px-4 py-3 text-center text-slate-600 text-xs">
        {t.footerText}
      </footer>
    </div>
  );
}
