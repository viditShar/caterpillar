# CAT Smart Operator Assistant 🚜

> **Hackathon Prototype** — In-cab HMI and telemetry analytics for heavy equipment (Caterpillar EXC001 Excavator)

---

## Project Structure

```
Caterpillar/
├── backend/
│   ├── app.py              ← Flask API (telemetry, anomalies, ML predictor)
│   └── requirements.txt    ← Python dependencies
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        └── App.jsx         ← Full React UI
```

---

## Features

| Module | Description |
|---|---|
| **Live Telemetry Dashboard** | Displays all 4 dataset rows with KPI strip (engine hours, total fuel, load cycles, safety alerts) |
| **Real-Time Safety Banner** | Auto-triggers on seatbelt violations and idling > 45 min — dismissible with one click |
| **🔊 Audio Alerts** | Web Speech API voices the alert in the currently selected language |
| **Multilingual Switcher** | Full UI + voice alerts in **English**, **Spanish**, **Hindi** |
| **ML Task Time Predictor** | RandomForestRegressor predicts task duration from Load Cycles + Fuel + Weather/Terrain |
| **Operator Training Hub** | Interactive pre-shift checklist with progress bar + 3 micro-learning cards |
| **Environmental Impact Widget** | Calculates wasted fuel (L) and CO₂ emissions (kg) from excessive idling, with tree-equivalency metaphor |

---

## Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm 9+**

---

### 1 — Backend (Flask)

```powershell
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies (pinned versions)
pip install -r requirements.txt

# Start the Flask dev server on port 5000
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
```

**Available endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/telemetry` | Returns full telemetry dataset |
| GET | `/api/anomalies` | Anomaly detection + wasted fuel/CO₂ calc |
| POST | `/api/predict-time` | ML task duration prediction |

**`/api/predict-time` request body:**
```json
{
  "loadCycles": 8,
  "fuelLimit": 5.0,
  "weather": "Dry"
}
```
`weather` accepts: `"Dry"`, `"Rain"`, `"Mud"`

---

### 2 — Frontend (React + Vite)

Open a **second terminal**:

```powershell
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

Then open **http://localhost:5173** in your browser.

> The Vite dev server automatically proxies `/api/*` requests to `http://localhost:5000`, so no manual CORS configuration is needed in development.

---

### 3 — Production Build

```powershell
cd frontend
npm run build      # outputs to frontend/dist/
npm run preview    # serves the built output locally
```

---

## API Quick Test (PowerShell)

```powershell
# Health check
Invoke-RestMethod http://localhost:5000/api/health

# Telemetry
Invoke-RestMethod http://localhost:5000/api/telemetry

# Anomalies
Invoke-RestMethod http://localhost:5000/api/anomalies

# ML Prediction
$body = '{"loadCycles": 10, "fuelLimit": 6.0, "weather": "Mud"}'
Invoke-RestMethod -Uri http://localhost:5000/api/predict-time `
  -Method POST -ContentType "application/json" -Body $body
```

---

## Technology Stack

**Backend**
- [Flask 3.0](https://flask.palletsprojects.com/) — lightweight Python web framework
- [Flask-CORS](https://flask-cors.readthedocs.io/) — cross-origin resource sharing
- [scikit-learn](https://scikit-learn.org/) — `RandomForestRegressor` for task prediction
- [NumPy](https://numpy.org/) — numerical computing

**Frontend**
- [React 18](https://react.dev/) — component-based UI
- [Vite 5](https://vitejs.dev/) — fast dev server and bundler
- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first styling
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — native browser TTS for audio alerts (no external service needed)

---

## Dataset Reference

**Machine:** `EXC001` | **Operator:** `OP1001`

| Timestamp | Engine Hrs | Fuel (L) | Load Cycles | Idle (min) | Seatbelt | Alert |
|---|---|---|---|---|---|---|
| 2025-05-01 08:00 | 1523.5 | 5.2 | 12 | 30 | Fastened | No |
| 2025-05-01 10:00 | 1524.8 | 3.8 | 2 | 55 ⚠ | **Unfastened** ⚠ | **Yes** |
| 2025-05-01 14:00 | 1526.5 | 6.1 | 10 | 15 | Fastened | No |
| 2025-05-02 09:00 | 1530.2 | 2.0 | 1 | 60 ⚠ | **Unfastened** ⚠ | **Yes** |

**Anomaly thresholds:**
- Idling > **45 min** → HIGH_IDLING flag, wasted fuel = `(idleMin - 45) × 0.06 L/min`
- CO₂ = `wastedFuel × 2.68 kg/L`

---

## ML Model Details

The `RandomForestRegressor` is trained at Flask startup on **500 synthetic samples** generated from this domain formula:

```
duration (min) = (loadCycles × 6.5) + (fuelUsed × 4.2) + (weatherCode × 18) + noise
```

| Weather | Code | Added Duration |
|---|---|---|
| Dry | 0 | +0 min |
| Rain | 1 | +~18 min |
| Mud | 2 | +~36 min |

The model achieves realistic predictions without requiring an external dataset, making it fully self-contained for hackathon demos.

---

## Browser Compatibility

The Web Speech API (`speechSynthesis`) is supported in:
- ✅ Chrome / Edge (full support, best voice quality)
- ✅ Safari 14.1+
- ⚠ Firefox (basic support — some voices may be limited)

---

## License

Prototype built for hackathon demonstration purposes.
© 2025 Caterpillar Inc. concept — not an official Caterpillar product.
