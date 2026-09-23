/**
 * CAT Smart Operator Assistant
 * React + Tailwind CSS — Production-ready Hackathon Prototype
 *
 * Features:
 *  - Dark industrial CAT UI (yellow / slate)
 *  - Multilingual switcher (EN / ES / HI) with live UI + voice alerts
 *  - Real-time safety banner with Web Speech API audio
 *  - Telemetry dashboard with live data from Flask
 *  - Interactive ML Task Time Predictor
 *  - Operator Training Hub (pre-shift checklist + micro-learning cards)
 *  - Environmental Impact Widget (wasted fuel + CO2)
 */

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// i18n Dictionary
// ---------------------------------------------------------------------------
const DICT = {
  en: {
    appTitle: "CAT Smart Operator Assistant",
    appSubtitle: "EXC001 · OP1001 · Live Telemetry",
    navTelemetry: "Telemetry",
    navPredictor: "Task Predictor",
    navTraining: "Training Hub",
    navEnvironment: "Eco Impact",
    safetyBannerTitle: "⚠ SAFETY ALERT",
    seatbeltAlert: "Seatbelt UNFASTENED — Fasten immediately!",
    idlingAlert: (mins) => `Excessive idling detected: ${mins} min (limit 45 min)`,
    playAudio: "🔊 Play Audio Alert",
    telemetryTitle: "Live Telemetry Feed",
    timestamp: "Timestamp",
    engineHours: "Engine Hrs",
    fuelUsed: "Fuel (L)",
    loadCycles: "Load Cycles",
    idlingTime: "Idle (min)",
    seatbelt: "Seatbelt",
    alert: "Alert",
    fastened: "Fastened",
    unfastened: "Unfastened",
    yes: "YES",
    no: "NO",
    predictorTitle: "ML Task Time Predictor",
    loadCyclesLabel: "Load Cycles",
    fuelLimitLabel: "Fuel Limit (L)",
    weatherLabel: "Weather / Terrain",
    dry: "Dry",
    rain: "Rain",
    mud: "Mud",
    predictBtn: "Predict Duration",
    predicting: "Predicting…",
    predictResult: (mins) => `Estimated Duration: ${mins} min`,
    trainingTitle: "Operator Training Hub",
    checklistTitle: "Pre-Shift Safety Checklist",
    checklistItems: [
      "Inspect hydraulic lines for leaks",
      "Verify bucket teeth & attachment integrity",
      "Check engine oil & coolant levels",
      "Test horn, lights, and reverse alarm",
      "Fasten seatbelt before engine start",
      "Clear personnel from swing radius",
      "Confirm radio / comms operational",
    ],
    microTitle: "Micro-Learning Cards",
    card1Title: "Safe Swing Zones",
    card1Body: "Always check blind spots before rotating the upper structure. Maintain 3 m exclusion zone.",
    card1Tag: "Safety",
    card2Title: "Fuel-Efficient Digging",
    card2Body: "Match bucket size to material density. Avoid over-swinging — short, deliberate cycles reduce fuel 18%.",
    card2Tag: "Efficiency",
    card3Title: "Adverse Terrain Protocol",
    card3Body: "On slopes >15°, lower the boom fully when parking. Engage travel lock on muddy surfaces.",
    card3Tag: "Terrain",
    envTitle: "Environmental Impact",
    envSubtitle: "Losses from excessive idling sessions",
    wastedFuel: "Wasted Fuel",
    co2Emitted: "CO₂ Emitted",
    anomalyCount: "Anomaly Events",
    litres: "L",
    kg: "kg",
    loading: "Loading…",
    error: "Failed to load data. Ensure backend is running on port 5000.",
    footerText: "© 2025 Caterpillar Inc. · Smart Operator Assistant · Hackathon Prototype",
  },
  es: {
    appTitle: "Asistente Inteligente CAT",
    appSubtitle: "EXC001 · OP1001 · Telemetría en Vivo",
    navTelemetry: "Telemetría",
    navPredictor: "Predictor",
    navTraining: "Capacitación",
    navEnvironment: "Impacto Eco",
    safetyBannerTitle: "⚠ ALERTA DE SEGURIDAD",
    seatbeltAlert: "Cinturón NO abrochado — ¡Abróchelo de inmediato!",
    idlingAlert: (mins) => `Ralentí excesivo detectado: ${mins} min (límite 45 min)`,
    playAudio: "🔊 Reproducir Alerta",
    telemetryTitle: "Telemetría en Vivo",
    timestamp: "Hora",
    engineHours: "Horas Motor",
    fuelUsed: "Combustible (L)",
    loadCycles: "Ciclos de Carga",
    idlingTime: "Ralentí (min)",
    seatbelt: "Cinturón",
    alert: "Alerta",
    fastened: "Abrochado",
    unfastened: "No Abrochado",
    yes: "SÍ",
    no: "NO",
    predictorTitle: "Predictor de Tareas ML",
    loadCyclesLabel: "Ciclos de Carga",
    fuelLimitLabel: "Límite de Combustible (L)",
    weatherLabel: "Clima / Terreno",
    dry: "Seco",
    rain: "Lluvia",
    mud: "Barro",
    predictBtn: "Predecir Duración",
    predicting: "Calculando…",
    predictResult: (mins) => `Duración Estimada: ${mins} min`,
    trainingTitle: "Centro de Capacitación",
    checklistTitle: "Lista de Seguridad Pre-Turno",
    checklistItems: [
      "Inspeccionar líneas hidráulicas",
      "Verificar dientes del cucharón",
      "Revisar aceite de motor y refrigerante",
      "Probar bocina, luces y alarma de retroceso",
      "Abrochar el cinturón antes de arrancar",
      "Despejar personal del radio de giro",
      "Confirmar radio operativa",
    ],
    microTitle: "Tarjetas de Aprendizaje",
    card1Title: "Zonas de Giro Seguras",
    card1Body: "Verifique puntos ciegos antes de rotar. Mantenga zona de exclusión de 3 m.",
    card1Tag: "Seguridad",
    card2Title: "Excavación Eficiente",
    card2Body: "Adapte el tamaño del cucharón a la densidad del material. Los ciclos cortos reducen combustible un 18%.",
    card2Tag: "Eficiencia",
    card3Title: "Protocolo de Terreno",
    card3Body: "En pendientes >15°, baje el boom al estacionar. Active bloqueo de traslado en barro.",
    card3Tag: "Terreno",
    envTitle: "Impacto Ambiental",
    envSubtitle: "Pérdidas por ralentí excesivo",
    wastedFuel: "Combustible Desperdiciado",
    co2Emitted: "CO₂ Emitido",
    anomalyCount: "Eventos de Anomalía",
    litres: "L",
    kg: "kg",
    loading: "Cargando…",
    error: "Error al cargar datos. Asegúrese de que el backend esté en el puerto 5000.",
    footerText: "© 2025 Caterpillar Inc. · Asistente Inteligente · Prototipo",
  },
  hi: {
    appTitle: "CAT स्मार्ट ऑपरेटर सहायक",
    appSubtitle: "EXC001 · OP1001 · लाइव टेलीमेट्री",
    navTelemetry: "टेलीमेट्री",
    navPredictor: "टास्क प्रेडिक्टर",
    navTraining: "प्रशिक्षण",
    navEnvironment: "पर्यावरण",
    safetyBannerTitle: "⚠ सुरक्षा चेतावनी",
    seatbeltAlert: "सीटबेल्ट नहीं लगी — तुरंत लगाएं!",
    idlingAlert: (mins) => `अत्यधिक आइडलिंग: ${mins} मिनट (सीमा 45 मिनट)`,
    playAudio: "🔊 ऑडियो अलर्ट चलाएं",
    telemetryTitle: "लाइव टेलीमेट्री फीड",
    timestamp: "समय",
    engineHours: "इंजन घंटे",
    fuelUsed: "ईंधन (L)",
    loadCycles: "लोड साइकिल",
    idlingTime: "आइडल (मिनट)",
    seatbelt: "सीटबेल्ट",
    alert: "अलर्ट",
    fastened: "लगी है",
    unfastened: "नहीं लगी",
    yes: "हाँ",
    no: "नहीं",
    predictorTitle: "ML टास्क टाइम प्रेडिक्टर",
    loadCyclesLabel: "लोड साइकिल",
    fuelLimitLabel: "ईंधन सीमा (L)",
    weatherLabel: "मौसम / भूमि",
    dry: "सूखा",
    rain: "बारिश",
    mud: "कीचड़",
    predictBtn: "अवधि का अनुमान",
    predicting: "गणना हो रही है…",
    predictResult: (mins) => `अनुमानित अवधि: ${mins} मिनट`,
    trainingTitle: "ऑपरेटर प्रशिक्षण केंद्र",
    checklistTitle: "प्री-शिफ्ट सुरक्षा चेकलिस्ट",
    checklistItems: [
      "हाइड्रोलिक लाइनें जांचें",
      "बकेट टीथ की जांच करें",
      "इंजन ऑयल और कूलेंट जांचें",
      "हॉर्न, लाइट और रिवर्स अलार्म टेस्ट करें",
      "इंजन चालू करने से पहले सीटबेल्ट लगाएं",
      "स्विंग रेडियस से कर्मियों को हटाएं",
      "रेडियो संचार की जांच करें",
    ],
    microTitle: "माइक्रो-लर्निंग कार्ड",
    card1Title: "सुरक्षित स्विंग ज़ोन",
    card1Body: "घुमाने से पहले ब्लाइंड स्पॉट जांचें। 3 मीटर का एक्सक्लूज़न ज़ोन बनाए रखें।",
    card1Tag: "सुरक्षा",
    card2Title: "ईंधन-कुशल खुदाई",
    card2Body: "बकेट साइज़ सामग्री के अनुसार चुनें। छोटे चक्र ईंधन 18% बचाते हैं।",
    card2Tag: "दक्षता",
    card3Title: "प्रतिकूल भूमि प्रोटोकॉल",
    card3Body: "15° से अधिक ढलान पर पार्किंग करते समय बूम नीचे करें। कीचड़ में ट्रैवल लॉक लगाएं।",
    card3Tag: "भूमि",
    envTitle: "पर्यावरणीय प्रभाव",
    envSubtitle: "अत्यधिक आइडलिंग से हानि",
    wastedFuel: "बर्बाद ईंधन",
    co2Emitted: "CO₂ उत्सर्जन",
    anomalyCount: "विसंगति घटनाएं",
    litres: "L",
    kg: "kg",
    loading: "लोड हो रहा है…",
    error: "डेटा लोड नहीं हुआ। पोर्ट 5000 पर बैकएंड चला रहे हैं?",
    footerText: "© 2025 Caterpillar Inc. · स्मार्ट ऑपरेटर सहायक · हैकाथॉन प्रोटोटाइप",
  },
};

// Language → BCP-47 voice code mapping for Web Speech API
const VOICE_LANG = { en: "en-US", es: "es-ES", hi: "hi-IN" };

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------
function speak(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = VOICE_LANG[lang] || "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

const API = "http://localhost:5000/api";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Top navigation bar */
function NavBar({ t, lang, setLang, activeTab, setActiveTab }) {
  const tabs = [
    { id: "telemetry", label: t.navTelemetry },
    { id: "predictor", label: t.navPredictor },
    { id: "training", label: t.navTraining },
    { id: "environment", label: t.navEnvironment },
  ];

  return (
    <nav className="bg-slate-900 border-b border-yellow-500 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-yellow-400 rounded flex items-center justify-center font-black text-black text-lg select-none">
          CAT
        </div>
        <div>
          <h1 className="text-yellow-400 font-bold text-lg leading-tight">{t.appTitle}</h1>
          <p className="text-slate-400 text-xs">{t.appSubtitle}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-yellow-400 text-black"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Language switcher */}
      <div className="flex gap-1">
        {["en", "es", "hi"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-colors ${
              lang === l
                ? "bg-yellow-400 text-black"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </nav>
  );
}

/** Safety banner – only shown when anomalies exist */
function SafetyBanner({ t, lang, anomalies }) {
  const [dismissed, setDismissed] = useState(false);

  // Reset dismiss when anomalies change
  useEffect(() => setDismissed(false), [anomalies]);

  if (!anomalies || anomalies.length === 0 || dismissed) return null;

  const seatbeltViolations = anomalies.filter((a) =>
    a.flags.includes("SEATBELT_UNFASTENED")
  );
  const idlingViolations = anomalies.filter((a) =>
    a.flags.includes("HIGH_IDLING")
  );

  const buildAlertText = () => {
    const parts = [];
    if (seatbeltViolations.length) parts.push(t.seatbeltAlert);
    if (idlingViolations.length)
      parts.push(t.idlingAlert(idlingViolations[0].idlingTime));
    return parts.join(". ");
  };

  const handlePlayAudio = () => speak(buildAlertText(), lang);

  return (
    <div className="bg-red-900 border-l-4 border-red-400 px-4 py-3 flex flex-wrap items-start gap-3 animate-pulse-slow">
      <div className="flex-1 min-w-0">
        <p className="text-red-300 font-bold text-sm">{t.safetyBannerTitle}</p>
        <ul className="mt-1 space-y-0.5">
          {seatbeltViolations.length > 0 && (
            <li className="text-white text-sm">🚨 {t.seatbeltAlert}</li>
          )}
          {idlingViolations.map((a, i) => (
            <li key={i} className="text-white text-sm">
              ⏱ {t.idlingAlert(a.idlingTime)}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handlePlayAudio}
          className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-yellow-300 transition-colors"
        >
          {t.playAudio}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white text-lg leading-none"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/** Status badge for seatbelt / alert columns */
function Badge({ ok, labelTrue, labelFalse }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        ok ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
      }`}
    >
      {ok ? labelTrue : labelFalse}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

/** View 1 – Telemetry table */
function TelemetryView({ t, telemetry, loading, error }) {
  if (loading) return <LoadingCard text={t.loading} />;
  if (error) return <ErrorCard text={t.error} />;

  return (
    <Section title={t.telemetryTitle} icon="📡">
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-yellow-400 text-left">
              {[
                t.timestamp,
                t.engineHours,
                t.fuelUsed,
                t.loadCycles,
                t.idlingTime,
                t.seatbelt,
                t.alert,
              ].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {telemetry.map((row, i) => (
              <tr
                key={i}
                className={`border-t border-slate-700 transition-colors ${
                  row.safetyAlert
                    ? "bg-red-950 hover:bg-red-900"
                    : "hover:bg-slate-800"
                }`}
              >
                <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap font-mono text-xs">
                  {row.timestamp}
                </td>
                <td className="px-4 py-2.5 text-white">{row.engineHours}</td>
                <td className="px-4 py-2.5 text-white">{row.fuelUsed} L</td>
                <td className="px-4 py-2.5 text-white">{row.loadCycles}</td>
                <td
                  className={`px-4 py-2.5 font-medium ${
                    row.idlingTime > 45 ? "text-red-400" : "text-white"
                  }`}
                >
                  {row.idlingTime}
                  {row.idlingTime > 45 && " ⚠"}
                </td>
                <td className="px-4 py-2.5">
                  <Badge
                    ok={row.seatbeltStatus === "Fastened"}
                    labelTrue={t.fastened}
                    labelFalse={t.unfastened}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <Badge
                    ok={!row.safetyAlert}
                    labelTrue={t.no}
                    labelFalse={t.yes}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          {
            label: t.engineHours,
            value: telemetry[telemetry.length - 1]?.engineHours,
            unit: "hrs",
            color: "text-yellow-400",
          },
          {
            label: t.fuelUsed,
            value: telemetry.reduce((s, r) => s + r.fuelUsed, 0).toFixed(1),
            unit: "L total",
            color: "text-blue-400",
          },
          {
            label: t.loadCycles,
            value: telemetry.reduce((s, r) => s + r.loadCycles, 0),
            unit: "total",
            color: "text-green-400",
          },
          {
            label: t.alert,
            value: telemetry.filter((r) => r.safetyAlert).length,
            unit: "events",
            color: "text-red-400",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-slate-400 text-xs">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-slate-500 text-xs">{kpi.unit}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** View 2 – ML Task Predictor */
function PredictorView({ t }) {
  const [loadCycles, setLoadCycles] = useState(8);
  const [fuelLimit, setFuelLimit] = useState(5);
  const [weather, setWeather] = useState("Dry");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      const res = await fetch(`${API}/predict-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loadCycles, fuelLimit, weather }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.join(", ") || "Unknown error");
      setResult(data.predictedDurationMin);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const weatherOptions = [
    { value: "Dry", label: t.dry },
    { value: "Rain", label: t.rain },
    { value: "Mud", label: t.mud },
  ];

  return (
    <Section title={t.predictorTitle} icon="🤖">
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5">
          <InputField
            label={t.loadCyclesLabel}
            type="number"
            min={1}
            max={30}
            value={loadCycles}
            onChange={(v) => setLoadCycles(Number(v))}
          />
          <InputField
            label={t.fuelLimitLabel}
            type="number"
            min={0.5}
            max={20}
            step={0.5}
            value={fuelLimit}
            onChange={(v) => setFuelLimit(Number(v))}
          />
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              {t.weatherLabel}
            </label>
            <div className="flex gap-2">
              {weatherOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setWeather(opt.value)}
                  className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
                    weather === opt.value
                      ? "bg-yellow-400 text-black"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? t.predicting : t.predictBtn}
          </button>
        </div>

        {/* Result panel */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center w-full">
            {result !== null ? (
              <>
                <div className="text-6xl font-black text-yellow-400 mb-1">
                  {result}
                </div>
                <div className="text-slate-400 text-sm">minutes</div>
                <div className="mt-4 text-slate-300 text-sm font-medium">
                  {t.predictResult(result)}
                </div>
                {/* Simple visual bar */}
                <div className="mt-4 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((result / 300) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : err ? (
              <p className="text-red-400 text-sm">{err}</p>
            ) : (
              <p className="text-slate-500 text-sm">
                Configure inputs and click predict
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terrain impact legend */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-400">
        {[
          { icon: "☀️", label: t.dry, note: "Baseline" },
          { icon: "🌧️", label: t.rain, note: "+~18 min" },
          { icon: "🟫", label: t.mud, note: "+~36 min" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-medium text-slate-300">{item.label}</div>
            <div>{item.note}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** View 3 – Operator Training Hub */
function TrainingView({ t }) {
  const [checked, setChecked] = useState(
    () => new Array(t.checklistItems.length).fill(false)
  );

  // Re-initialise checklist when language changes (item count stays same)
  useEffect(() => {
    setChecked(new Array(t.checklistItems.length).fill(false));
  }, [t]);

  const toggle = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const completedCount = checked.filter(Boolean).length;
  const progress = Math.round((completedCount / checked.length) * 100);

  const tagColors = {
    Safety: "bg-red-900 text-red-300",
    Efficiency: "bg-blue-900 text-blue-300",
    Terrain: "bg-amber-900 text-amber-300",
    Seguridad: "bg-red-900 text-red-300",
    Eficiencia: "bg-blue-900 text-blue-300",
    Terreno: "bg-amber-900 text-amber-300",
    सुरक्षा: "bg-red-900 text-red-300",
    दक्षता: "bg-blue-900 text-blue-300",
    भूमि: "bg-amber-900 text-amber-300",
  };

  const microCards = [
    { title: t.card1Title, body: t.card1Body, tag: t.card1Tag, icon: "🔄" },
    { title: t.card2Title, body: t.card2Body, tag: t.card2Tag, icon: "⛽" },
    { title: t.card3Title, body: t.card3Body, tag: t.card3Tag, icon: "🏔️" },
  ];

  return (
    <Section title={t.trainingTitle} icon="🎓">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pre-shift checklist */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">{t.checklistTitle}</h3>
            <span className="text-yellow-400 text-sm font-bold">
              {completedCount}/{checked.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="bg-slate-700 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                progress === 100 ? "bg-green-400" : "bg-yellow-400"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="space-y-2">
            {t.checklistItems.map((item, i) => (
              <li
                key={i}
                onClick={() => toggle(i)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <span
                  className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                    checked[i]
                      ? "bg-green-500 border-green-500"
                      : "border-slate-500 group-hover:border-yellow-400"
                  }`}
                >
                  {checked[i] && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    checked[i] ? "line-through text-slate-500" : "text-slate-300 group-hover:text-white"
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          {progress === 100 && (
            <div className="mt-4 text-center text-green-400 font-semibold text-sm">
              ✅ All checks complete — Safe to operate!
            </div>
          )}
        </div>

        {/* Micro-learning cards */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">{t.microTitle}</h3>
          {microCards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-yellow-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{card.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tagColors[card.tag] || "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {card.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{card.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** View 4 – Environmental Impact Widget */
function EnvironmentView({ t, anomalyData, loading, error }) {
  if (loading) return <LoadingCard text={t.loading} />;
  if (error) return <ErrorCard text={t.error} />;

  const { totalWastedFuelL = 0, totalCO2WastedKg = 0, anomalyCount = 0, anomalies = [] } =
    anomalyData || {};

  // Equivalent metaphors for engagement
  const treeDays = ((totalCO2WastedKg / 21.77) * 365).toFixed(1); // avg tree absorbs 21.77 kg CO2/yr

  return (
    <Section title={t.envTitle} icon="🌱">
      <p className="text-slate-400 text-sm mb-5">{t.envSubtitle}</p>

      {/* Big 3 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard
          icon="⛽"
          value={totalWastedFuelL.toFixed(2)}
          unit={t.litres}
          label={t.wastedFuel}
          color="text-orange-400"
          border="border-orange-800"
        />
        <KPICard
          icon="💨"
          value={totalCO2WastedKg.toFixed(2)}
          unit={t.kg}
          label={t.co2Emitted}
          color="text-red-400"
          border="border-red-800"
        />
        <KPICard
          icon="⚠️"
          value={anomalyCount}
          unit="events"
          label={t.anomalyCount}
          color="text-yellow-400"
          border="border-yellow-800"
        />
      </div>

      {/* Equivalency card */}
      <div className="bg-slate-800 border border-green-900 rounded-xl p-4 mb-6 flex items-center gap-4">
        <span className="text-4xl">🌳</span>
        <div>
          <p className="text-white font-semibold text-sm">CO₂ Equivalency</p>
          <p className="text-slate-400 text-xs mt-1">
            The wasted CO₂ would take a mature tree{" "}
            <span className="text-green-400 font-bold">{treeDays} days</span> to
            absorb.
          </p>
        </div>
      </div>

      {/* Per-anomaly breakdown */}
      {anomalies.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-yellow-400 text-left">
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 font-semibold">Idle (min)</th>
                <th className="px-4 py-3 font-semibold">Wasted (L)</th>
                <th className="px-4 py-3 font-semibold">CO₂ (kg)</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((a, i) => (
                <tr key={i} className="border-t border-slate-700 hover:bg-slate-700">
                  <td className="px-4 py-2.5 text-slate-300 font-mono text-xs whitespace-nowrap">
                    {a.timestamp}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {a.flags.map((f) => (
                        <span
                          key={f}
                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            f === "SEATBELT_UNFASTENED"
                              ? "bg-red-900 text-red-300"
                              : "bg-orange-900 text-orange-300"
                          }`}
                        >
                          {f.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-orange-300">{a.idlingTime}</td>
                  <td className="px-4 py-2.5 text-orange-400">{a.wastedFuelL.toFixed(3)}</td>
                  <td className="px-4 py-2.5 text-red-400">{a.co2WastedKg.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Reusable primitive components
// ---------------------------------------------------------------------------

function Section({ title, icon, children }) {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-yellow-400 text-xl font-bold mb-5 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function KPICard({ icon, value, unit, label, color, border }) {
  return (
    <div className={`bg-slate-800 rounded-xl border ${border} p-5 text-center`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
      <div className="text-slate-400 text-xs mt-0.5">{unit}</div>
      <div className="text-slate-300 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

function InputField({ label, ...inputProps }) {
  const { onChange, ...rest } = inputProps;
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-2">{label}</label>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
      />
    </div>
  );
}

function LoadingCard({ text }) {
  return (
    <div className="p-12 text-center">
      <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-400">{text}</p>
    </div>
  );
}

function ErrorCard({ text }) {
  return (
    <div className="p-8 m-4 bg-red-950 border border-red-700 rounded-xl text-red-300 text-sm">
      ⚠ {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("telemetry");

  const [telemetry, setTelemetry] = useState([]);
  const [telemetryLoading, setTelemetryLoading] = useState(true);
  const [telemetryError, setTelemetryError] = useState(false);

  const [anomalyData, setAnomalyData] = useState(null);
  const [anomalyLoading, setAnomalyLoading] = useState(true);
  const [anomalyError, setAnomalyError] = useState(false);

  const t = DICT[lang];

  const fetchTelemetry = useCallback(async () => {
    setTelemetryLoading(true);
    setTelemetryError(false);
    try {
      const res = await fetch(`${API}/telemetry`);
      const data = await res.json();
      setTelemetry(data.data || []);
    } catch {
      setTelemetryError(true);
    } finally {
      setTelemetryLoading(false);
    }
  }, []);

  const fetchAnomalies = useCallback(async () => {
    setAnomalyLoading(true);
    setAnomalyError(false);
    try {
      const res = await fetch(`${API}/anomalies`);
      const data = await res.json();
      setAnomalyData(data);
    } catch {
      setAnomalyError(true);
    } finally {
      setAnomalyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    fetchAnomalies();
  }, [fetchTelemetry, fetchAnomalies]);

  // Active anomalies for banner
  const activeAnomalies = anomalyData?.anomalies || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <NavBar
        t={t}
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <SafetyBanner t={t} lang={lang} anomalies={activeAnomalies} />

      <main className="flex-1">
        {activeTab === "telemetry" && (
          <TelemetryView
            t={t}
            telemetry={telemetry}
            loading={telemetryLoading}
            error={telemetryError}
          />
        )}
        {activeTab === "predictor" && <PredictorView t={t} />}
        {activeTab === "training" && <TrainingView t={t} />}
        {activeTab === "environment" && (
          <EnvironmentView
            t={t}
            anomalyData={anomalyData}
            loading={anomalyLoading}
            error={anomalyError}
          />
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-3 text-center text-slate-500 text-xs">
        {t.footerText}
      </footer>
    </div>
  );
}
