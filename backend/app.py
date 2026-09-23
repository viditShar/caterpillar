"""
CAT Smart Operator Assistant - Flask Backend
Production-ready prototype for hackathon demonstration.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)
CORS(app)  # Allow all origins for hackathon / dev purposes

# ---------------------------------------------------------------------------
# Dataset (embedded – mirrors the spec exactly)
# ---------------------------------------------------------------------------
TELEMETRY_DATA = [
    {
        "timestamp": "2025-05-01 08:00:00",
        "machineID": "EXC001",
        "operatorID": "OP1001",
        "engineHours": 1523.5,
        "fuelUsed": 5.2,
        "loadCycles": 12,
        "idlingTime": 30,          # minutes
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
# ML Model – trained once at startup
# Feature vector: [loadCycles, fuelUsed, weatherCode]
# weatherCode: Dry=0, Rain=1, Mud=2
# Target: estimated task duration in minutes (synthetic but realistic formula)
# ---------------------------------------------------------------------------
WEATHER_MAP = {"Dry": 0, "Rain": 1, "Mud": 2}

def _build_training_data():
    """
    Synthetic training set derived from domain knowledge:
    - More load cycles → longer task
    - More fuel → harder work → longer task
    - Wet/muddy terrain adds significant time
    """
    rng = np.random.default_rng(42)
    X, y = [], []
    for _ in range(500):
        lc = rng.integers(1, 20)
        fuel = rng.uniform(1.0, 8.0)
        weather = rng.integers(0, 3)
        # Base formula + noise
        duration = (lc * 6.5) + (fuel * 4.2) + (weather * 18) + rng.normal(0, 5)
        duration = max(10.0, duration)
        X.append([lc, fuel, weather])
        y.append(duration)
    return np.array(X), np.array(y)


_X_train, _y_train = _build_training_data()
_model = RandomForestRegressor(n_estimators=100, random_state=42)
_model.fit(_X_train, _y_train)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
IDLE_FUEL_RATE_L_PER_MIN = 0.06   # litres per minute while idling
CO2_PER_LITRE_KG = 2.68           # kg CO2 per litre of diesel
IDLING_THRESHOLD_MIN = 45         # minutes – anomaly trigger


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/api/telemetry", methods=["GET"])
def get_telemetry():
    """Return the full telemetry dataset."""
    return jsonify({"status": "ok", "data": TELEMETRY_DATA})


@app.route("/api/anomalies", methods=["GET"])
def get_anomalies():
    """
    Scan the dataset for:
      - IdlingTime > 45 min  →  high-idle anomaly
      - SeatbeltStatus == Unfastened  →  safety anomaly
    Also calculates wasted fuel and CO2 for each anomalous record.
    """
    anomalies = []
    total_wasted_fuel = 0.0
    total_co2 = 0.0

    for row in TELEMETRY_DATA:
        flags = []
        wasted_fuel = 0.0
        co2 = 0.0

        if row["idlingTime"] > IDLING_THRESHOLD_MIN:
            excess_idle = row["idlingTime"] - IDLING_THRESHOLD_MIN
            wasted_fuel = round(excess_idle * IDLE_FUEL_RATE_L_PER_MIN, 3)
            co2 = round(wasted_fuel * CO2_PER_LITRE_KG, 3)
            flags.append("HIGH_IDLING")

        if row["seatbeltStatus"] == "Unfastened":
            flags.append("SEATBELT_UNFASTENED")

        if flags:
            anomalies.append({
                "timestamp": row["timestamp"],
                "machineID": row["machineID"],
                "operatorID": row["operatorID"],
                "flags": flags,
                "idlingTime": row["idlingTime"],
                "seatbeltStatus": row["seatbeltStatus"],
                "wastedFuelL": wasted_fuel,
                "co2WastedKg": co2,
            })
            total_wasted_fuel += wasted_fuel
            total_co2 += co2

    return jsonify({
        "status": "ok",
        "anomalyCount": len(anomalies),
        "totalWastedFuelL": round(total_wasted_fuel, 3),
        "totalCO2WastedKg": round(total_co2, 3),
        "anomalies": anomalies,
    })


@app.route("/api/predict-time", methods=["POST"])
def predict_time():
    """
    Predict task duration given:
      Body (JSON): { "loadCycles": int, "fuelLimit": float, "weather": "Dry"|"Rain"|"Mud" }
    Returns predicted duration in minutes.
    """
    body = request.get_json(force=True, silent=True) or {}

    load_cycles = body.get("loadCycles")
    fuel_limit = body.get("fuelLimit")
    weather = body.get("weather", "Dry")

    # --- Validate inputs ---
    errors = []
    if load_cycles is None or not isinstance(load_cycles, (int, float)) or load_cycles < 1:
        errors.append("loadCycles must be a positive number.")
    if fuel_limit is None or not isinstance(fuel_limit, (int, float)) or fuel_limit <= 0:
        errors.append("fuelLimit must be a positive number.")
    if weather not in WEATHER_MAP:
        errors.append(f"weather must be one of: {list(WEATHER_MAP.keys())}.")

    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    weather_code = WEATHER_MAP[weather]
    features = np.array([[float(load_cycles), float(fuel_limit), float(weather_code)]])
    prediction = _model.predict(features)[0]

    return jsonify({
        "status": "ok",
        "predictedDurationMin": round(float(prediction), 1),
        "inputs": {
            "loadCycles": load_cycles,
            "fuelLimit": fuel_limit,
            "weather": weather,
        },
    })


# ---------------------------------------------------------------------------
# Health-check
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "CAT Smart Operator Assistant API"})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
