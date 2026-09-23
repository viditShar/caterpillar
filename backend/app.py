"""
CAT Smart Operator Assistant — Flask Backend v2
Dual-Output ML Engine + Environmental Analysis
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Embedded Dataset
# ---------------------------------------------------------------------------
TELEMETRY_DATA = [
    {
        "timestamp": "2025-05-01 08:00:00",
        "machineID": "EXC001",
        "operatorID": "OP1001",
        "engineHours": 1523.5,
        "fuelUsed": 5.2,
        "loadCycles": 12,
        "idlingTime": 30,
        "seatbeltStatus": "Fastened",
        "safetyAlert": False,
    },
    {
        "timestamp": "2025-05-01 10:00:00",
        "machineID": "EXC001",
        "operatorID": "OP1001",
        "engineHours": 1524.8,
        "fuelUsed": 3.8,
        "loadCycles": 2,
        "idlingTime": 55,
        "seatbeltStatus": "Unfastened",
        "safetyAlert": True,
    },
    {
        "timestamp": "2025-05-01 14:00:00",
        "machineID": "EXC001",
        "operatorID": "OP1001",
        "engineHours": 1526.5,
        "fuelUsed": 6.1,
        "loadCycles": 10,
        "idlingTime": 15,
        "seatbeltStatus": "Fastened",
        "safetyAlert": False,
    },
    {
        "timestamp": "2025-05-02 09:00:00",
        "machineID": "EXC001",
        "operatorID": "OP1001",
        "engineHours": 1530.2,
        "fuelUsed": 2.0,
        "loadCycles": 1,
        "idlingTime": 60,
        "seatbeltStatus": "Unfastened",
        "safetyAlert": True,
    },
]

# ---------------------------------------------------------------------------
# Constants — anomaly thresholds & environmental calculations
# ---------------------------------------------------------------------------
IDLE_FUEL_RATE      = 0.06    # L/min while idling
CO2_PER_LITRE       = 2.68    # kg CO2 per litre diesel
IDLING_THRESHOLD    = 45      # minutes

# ---------------------------------------------------------------------------
# ML Training Data Generator
# Features: [loadCycles, estimatedFuel, weatherSeverity, groundStability, ambientTemp]
#
# weatherSeverity : 0=Clear, 1=Overcast/Light Rain, 2=Heavy Rain, 3=Storm/Blizzard
# groundStability : 0=Firm/Dry, 1=Soft/Wet, 2=Loose/Muddy, 3=Unstable/Rocky
# ambientTemp     : degrees Celsius (-20 to 50)
# ---------------------------------------------------------------------------
def _generate_training_data(n=1000, seed=42):
    rng = np.random.default_rng(seed)

    lc   = rng.integers(1, 25, n).astype(float)
    fuel = rng.uniform(1.0, 10.0, n)
    ws   = rng.integers(0, 4, n).astype(float)   # weatherSeverity
    gs   = rng.integers(0, 4, n).astype(float)   # groundStability
    temp = rng.uniform(-15.0, 48.0, n)

    # --- ETA regression target (minutes) ---
    # Base: cycles × time-per-cycle + fuel proxy
    # Penalties: bad weather, soft ground, extreme temps
    temp_penalty = np.where(temp < 0, (-temp) * 0.4,
                   np.where(temp > 35, (temp - 35) * 0.3, 0.0))
    eta = (
        lc   * 7.2
        + fuel * 3.8
        + ws   * 22.0
        + gs   * 18.5
        + temp_penalty
        + rng.normal(0, 4, n)
    )
    eta = np.clip(eta, 8.0, None)

    # --- Risk classification target ---
    # Risk score (continuous) → bucketed into 0/1/2
    risk_score = (
        ws * 2.5
        + gs * 2.0
        + np.where(temp < -5, 2.0, np.where(temp > 38, 1.5, 0.0))
        + lc * 0.15
        + rng.normal(0, 0.5, n)
    )
    risk_class = np.where(risk_score < 3.0, 0,
                 np.where(risk_score < 6.5, 1, 2)).astype(int)

    X = np.column_stack([lc, fuel, ws, gs, temp])
    return X, eta, risk_class


_X, _eta_y, _risk_y = _generate_training_data()

# Model 1 — ETA regressor
_eta_model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1)
_eta_model.fit(_X, _eta_y)

# Model 2 — Risk classifier
_risk_model = RandomForestClassifier(n_estimators=150, random_state=42, n_jobs=-1)
_risk_model.fit(_X, _risk_y)

RISK_LABELS = {0: "LOW", 1: "MODERATE", 2: "CRITICAL"}
RISK_DESC   = {
    0: "OPTIMAL — Operating conditions are within safe parameters.",
    1: "CAUTION — Elevated environmental stress detected. Monitor closely.",
    2: "HIGH RISK — Dangerous conditions. Immediate corrective action required.",
}

# ---------------------------------------------------------------------------
# Dynamic impact / action generator
# ---------------------------------------------------------------------------
def _build_machine_impacts(ws, gs, temp, lc):
    impacts = []

    if gs >= 1:
        reductions = {1: 15, 2: 35, 3: 55}
        impacts.append(f"Traction reduced by {reductions[gs]}% due to ground instability.")
    if gs >= 2:
        impacts.append("Elevated hydraulic pressure from unstable footing.")
    if gs == 3:
        impacts.append("Risk of undercarriage damage on rocky/unstable surface.")

    if ws >= 1:
        impacts.append("Reduced visibility — camera and sensor feeds may be degraded.")
    if ws >= 2:
        impacts.append("Boom swing stability impaired by crosswind / heavy rain.")
    if ws == 3:
        impacts.append("CRITICAL: Storm-level weather — structural stress on upper structure.")

    if temp < 0:
        impacts.append(f"Cold temperature ({temp:.0f}°C): hydraulic fluid viscosity increased, warm-up required.")
    elif temp > 35:
        impacts.append(f"High ambient temp ({temp:.0f}°C): engine cooling load elevated, monitor coolant temp.")
    if temp < -10:
        impacts.append("Extreme cold: risk of fuel gelling and seal brittleness.")

    if lc > 15:
        impacts.append("High cycle count: accelerated wear on bucket pins and boom cylinders.")

    if not impacts:
        impacts.append("No significant machine impact detected under current conditions.")

    return impacts


def _build_recommended_actions(ws, gs, temp, risk_level):
    actions = []

    if gs >= 1:
        actions.append("Reduce boom swing speed by 15% to compensate for ground flex.")
    if gs >= 2:
        actions.append("Engage Heavy Track Lock mode before each dig cycle.")
    if gs == 3:
        actions.append("Relocate machine to stable ground before resuming full operations.")

    if ws >= 2:
        actions.append("Limit upper-structure rotation to 90° arcs until conditions improve.")
    if ws == 3:
        actions.append("STOP OPERATIONS — Park machine on firm ground and lower boom fully.")

    if temp < 0:
        actions.append("Run low-idle warm-up cycle for 10 minutes before full load operations.")
    if temp < -10:
        actions.append("Use engine block heater; check hydraulic oil level before start.")
    if temp > 35:
        actions.append("Schedule coolant level check every 2 hours; reduce continuous duty cycle.")

    if risk_level == 1:
        actions.append("Notify site supervisor of elevated environmental risk. Log conditions.")
    if risk_level == 2:
        actions.append("IMMEDIATE: Alert site safety officer. Suspend non-essential operations.")

    if not actions:
        actions.append("Maintain standard operating procedure. Conditions are nominal.")

    return actions


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "CAT Smart Operator Assistant API v2"})


@app.route("/api/telemetry", methods=["GET"])
def get_telemetry():
    return jsonify({"status": "ok", "data": TELEMETRY_DATA})


@app.route("/api/anomalies", methods=["GET"])
def get_anomalies():
    anomalies = []
    total_wasted_fuel = 0.0
    total_co2 = 0.0

    for row in TELEMETRY_DATA:
        flags = []
        wasted_fuel = 0.0
        co2 = 0.0

        if row["idlingTime"] > IDLING_THRESHOLD:
            excess = row["idlingTime"] - IDLING_THRESHOLD
            wasted_fuel = round(excess * IDLE_FUEL_RATE, 3)
            co2 = round(wasted_fuel * CO2_PER_LITRE, 3)
            flags.append("HIGH_IDLING")

        if row["seatbeltStatus"] == "Unfastened":
            flags.append("SEATBELT_UNFASTENED")

        if flags:
            anomalies.append({
                "timestamp":      row["timestamp"],
                "machineID":      row["machineID"],
                "operatorID":     row["operatorID"],
                "flags":          flags,
                "idlingTime":     row["idlingTime"],
                "seatbeltStatus": row["seatbeltStatus"],
                "wastedFuelL":    wasted_fuel,
                "co2WastedKg":    co2,
            })
            total_wasted_fuel += wasted_fuel
            total_co2 += co2

    return jsonify({
        "status":            "ok",
        "anomalyCount":      len(anomalies),
        "totalWastedFuelL":  round(total_wasted_fuel, 3),
        "totalCO2WastedKg":  round(total_co2, 3),
        "anomalies":         anomalies,
    })


@app.route("/api/analyze-environment", methods=["POST"])
def analyze_environment():
    """
    Dual-output ML endpoint.

    Request JSON:
    {
        "load_cycles":       int   (1–30),
        "estimated_fuel":    float (L),
        "weather_severity":  int   (0–3),
        "ground_stability":  int   (0–3),
        "ambient_temp":      float (°C)
    }
    """
    body = request.get_json(force=True, silent=True) or {}

    # --- Input extraction & validation ---
    errors = []

    def _get(key, cast, lo, hi, label):
        val = body.get(key)
        if val is None:
            errors.append(f"'{key}' is required.")
            return None
        try:
            val = cast(val)
        except (TypeError, ValueError):
            errors.append(f"'{key}' must be a {cast.__name__}.")
            return None
        if not (lo <= val <= hi):
            errors.append(f"'{key}' must be between {lo} and {hi} (got {val}).")
            return None
        return val

    lc   = _get("load_cycles",      int,   1,    30,   "Load Cycles")
    fuel = _get("estimated_fuel",   float, 0.5,  20.0, "Estimated Fuel")
    ws   = _get("weather_severity", int,   0,    3,    "Weather Severity")
    gs   = _get("ground_stability", int,   0,    3,    "Ground Stability")
    temp = _get("ambient_temp",     float, -20.0, 50.0, "Ambient Temp")

    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    features = np.array([[lc, fuel, ws, gs, temp]])

    # --- Predictions ---
    eta_minutes  = round(float(_eta_model.predict(features)[0]), 1)
    risk_level   = int(_risk_model.predict(features)[0])
    risk_proba   = _risk_model.predict_proba(features)[0].tolist()
    risk_proba   = [round(p, 3) for p in risk_proba]

    return jsonify({
        "status": "ok",
        "predicted_eta_minutes": eta_minutes,
        "risk_level":            risk_level,
        "risk_label":            RISK_LABELS[risk_level],
        "risk_description":      RISK_DESC[risk_level],
        "risk_probabilities":    {
            "LOW":      risk_proba[0],
            "MODERATE": risk_proba[1],
            "CRITICAL": risk_proba[2],
        },
        "machine_impacts":           _build_machine_impacts(ws, gs, temp, lc),
        "recommended_next_actions":  _build_recommended_actions(ws, gs, temp, risk_level),
        "inputs": {
            "load_cycles":      lc,
            "estimated_fuel":   fuel,
            "weather_severity": ws,
            "ground_stability": gs,
            "ambient_temp":     temp,
        },
    })


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
