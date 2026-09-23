"""
CAT Smart Operator Assistant — Flask Backend v3
Full REST API: Tasks · Proximity · Incidents · Telemetry · Anomalies · ML Environment Analysis
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ===========================================================================
# STATIC DATASETS
# ===========================================================================

# ---------------------------------------------------------------------------
# Telemetry
# ---------------------------------------------------------------------------
TELEMETRY_DATA = [
    {"timestamp": "2025-05-01 08:00:00", "machineID": "EXC001", "operatorID": "OP1001",
     "engineHours": 1523.5, "fuelUsed": 5.2,  "loadCycles": 12, "idlingTime": 30,
     "seatbeltStatus": "Fastened",   "safetyAlert": False},
    {"timestamp": "2025-05-01 10:00:00", "machineID": "EXC001", "operatorID": "OP1001",
     "engineHours": 1524.8, "fuelUsed": 3.8,  "loadCycles": 2,  "idlingTime": 55,
     "seatbeltStatus": "Unfastened", "safetyAlert": True},
    {"timestamp": "2025-05-01 14:00:00", "machineID": "EXC001", "operatorID": "OP1001",
     "engineHours": 1526.5, "fuelUsed": 6.1,  "loadCycles": 10, "idlingTime": 15,
     "seatbeltStatus": "Fastened",   "safetyAlert": False},
    {"timestamp": "2025-05-02 09:00:00", "machineID": "EXC001", "operatorID": "OP1001",
     "engineHours": 1530.2, "fuelUsed": 2.0,  "loadCycles": 1,  "idlingTime": 60,
     "seatbeltStatus": "Unfastened", "safetyAlert": True},
]

# ---------------------------------------------------------------------------
# Daily Tasks
# ---------------------------------------------------------------------------
TASKS = [
    {
        "id": "T001",
        "title": "Foundation Dig — Zone B",
        "location": "Grid B-4, NW Corner",
        "assigned_cycles": 18,
        "completed_cycles": 12,
        "target_completion_time": "11:30",
        "status": "In Progress",
        "priority": "High",
        "notes": "Avoid utility corridor marked with yellow stakes.",
    },
    {
        "id": "T002",
        "title": "Haul Road Grading — Sector 3",
        "location": "Access Road, km 1.2–1.8",
        "assigned_cycles": 10,
        "completed_cycles": 0,
        "target_completion_time": "13:00",
        "status": "Pending",
        "priority": "Normal",
        "notes": "Grade to 2% cross-fall for drainage.",
    },
    {
        "id": "T003",
        "title": "Topsoil Strip — Pad Alpha",
        "location": "Pad Alpha, South Face",
        "assigned_cycles": 25,
        "completed_cycles": 25,
        "target_completion_time": "09:00",
        "status": "Completed",
        "priority": "Normal",
        "notes": "Stockpile topsoil at designated area north of pad.",
    },
    {
        "id": "T004",
        "title": "Trench Excavation — Utility Corridor",
        "location": "Corridor C, Station 4+200",
        "assigned_cycles": 14,
        "completed_cycles": 0,
        "target_completion_time": "15:45",
        "status": "Pending",
        "priority": "High",
        "notes": "CAT utilities scan required before dig commences.",
    },
    {
        "id": "T005",
        "title": "Slope Stabilisation — Embankment 7",
        "location": "East Embankment, Ch. 7+500",
        "assigned_cycles": 8,
        "completed_cycles": 3,
        "target_completion_time": "16:30",
        "status": "In Progress",
        "priority": "High",
        "notes": "Monitor slope inclinometer readings every 30 min.",
    },
]

# ---------------------------------------------------------------------------
# Proximity Hazards
# ---------------------------------------------------------------------------
PROXIMITY_DATA = [
    {
        "id": "PH001",
        "zone": "3m Rear",
        "hazard_type": "Personnel Detected",
        "severity": "CRITICAL",
        "distance_m": 2.1,
        "bearing": "180°",
        "description": "Worker on foot detected directly behind machine. STOP reverse movement immediately.",
        "active": True,
    },
    {
        "id": "PH002",
        "zone": "5m Swing Radius",
        "hazard_type": "Personnel Detected",
        "severity": "HIGH",
        "distance_m": 4.3,
        "bearing": "045°",
        "description": "Personnel within swing exclusion zone — NE quadrant.",
        "active": True,
    },
    {
        "id": "PH003",
        "zone": "Overhead",
        "hazard_type": "Utility Line",
        "severity": "CRITICAL",
        "distance_m": 3.8,
        "bearing": "Overhead",
        "description": "High-voltage overhead cable at 3.8 m clearance. Boom height limit: 3.0 m.",
        "active": True,
    },
    {
        "id": "PH004",
        "zone": "10m Forward",
        "hazard_type": "Slope Edge",
        "severity": "HIGH",
        "distance_m": 9.2,
        "bearing": "000°",
        "description": "Embankment slope edge detected ahead. Do not advance beyond 8 m forward.",
        "active": False,
    },
]

# ---------------------------------------------------------------------------
# Incident Log (mutable — POST appends here)
# ---------------------------------------------------------------------------
INCIDENTS = [
    {
        "id": "INC001",
        "timestamp": "2025-05-01 08:45:00",
        "operator": "OP1001",
        "machineID": "EXC001",
        "incident_type": "Near Miss",
        "severity": "HIGH",
        "notes": "Pedestrian entered swing radius without spotter notification. Halted operation. Reported to site supervisor.",
        "location": "Grid B-4",
    },
    {
        "id": "INC002",
        "timestamp": "2025-05-01 11:20:00",
        "operator": "OP1001",
        "machineID": "EXC001",
        "incident_type": "Equipment Fault",
        "severity": "MODERATE",
        "notes": "Left track tension warning light activated. Reduced speed operation until maintenance inspection at 13:00.",
        "location": "Access Road km 1.4",
    },
    {
        "id": "INC003",
        "timestamp": "2025-05-02 09:35:00",
        "operator": "OP1001",
        "machineID": "EXC001",
        "incident_type": "Safety Violation",
        "severity": "CRITICAL",
        "notes": "Operator seatbelt found unfastened during routine check. Immediate corrective action taken. Operator reminded of site policy.",
        "location": "Pad Alpha",
    },
]

# ===========================================================================
# ML ENGINE (unchanged from v2)
# ===========================================================================
IDLE_FUEL_RATE   = 0.06
CO2_PER_LITRE    = 2.68
IDLING_THRESHOLD = 45


def _generate_training_data(n=1000, seed=42):
    rng  = np.random.default_rng(seed)
    lc   = rng.integers(1, 25, n).astype(float)
    fuel = rng.uniform(1.0, 10.0, n)
    ws   = rng.integers(0, 4, n).astype(float)
    gs   = rng.integers(0, 4, n).astype(float)
    temp = rng.uniform(-15.0, 48.0, n)

    temp_penalty = np.where(temp < 0, (-temp) * 0.4,
                   np.where(temp > 35, (temp - 35) * 0.3, 0.0))
    eta = (lc * 7.2 + fuel * 3.8 + ws * 22.0 + gs * 18.5
           + temp_penalty + rng.normal(0, 4, n))
    eta = np.clip(eta, 8.0, None)

    risk_score = (ws * 2.5 + gs * 2.0
                  + np.where(temp < -5, 2.0, np.where(temp > 38, 1.5, 0.0))
                  + lc * 0.15 + rng.normal(0, 0.5, n))
    risk_class = np.where(risk_score < 3.0, 0,
                 np.where(risk_score < 6.5, 1, 2)).astype(int)

    return np.column_stack([lc, fuel, ws, gs, temp]), eta, risk_class


_X, _eta_y, _risk_y = _generate_training_data()
_eta_model  = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1)
_risk_model = RandomForestClassifier(n_estimators=150, random_state=42, n_jobs=-1)
_eta_model.fit(_X, _eta_y)
_risk_model.fit(_X, _risk_y)

RISK_LABELS = {0: "LOW", 1: "MODERATE", 2: "CRITICAL"}
RISK_DESC   = {
    0: "OPTIMAL — Operating conditions are within safe parameters.",
    1: "CAUTION — Elevated environmental stress detected. Monitor closely.",
    2: "HIGH RISK — Dangerous conditions. Immediate corrective action required.",
}


def _build_machine_impacts(ws, gs, temp, lc):
    out = []
    if gs >= 1:
        out.append(f"Traction reduced by {[15,35,55][gs-1]}% due to ground instability.")
    if gs >= 2:
        out.append("Elevated hydraulic pressure from unstable footing.")
    if gs == 3:
        out.append("Risk of undercarriage damage on rocky/unstable surface.")
    if ws >= 1:
        out.append("Reduced visibility — camera and sensor feeds may be degraded.")
    if ws >= 2:
        out.append("Boom swing stability impaired by crosswind / heavy rain.")
    if ws == 3:
        out.append("CRITICAL: Storm-level weather — structural stress on upper structure.")
    if temp < 0:
        out.append(f"Cold ({temp:.0f}°C): hydraulic fluid viscosity increased, warm-up required.")
    elif temp > 35:
        out.append(f"High temp ({temp:.0f}°C): engine cooling load elevated, monitor coolant.")
    if temp < -10:
        out.append("Extreme cold: risk of fuel gelling and seal brittleness.")
    if lc > 15:
        out.append("High cycle count: accelerated wear on bucket pins and boom cylinders.")
    return out or ["No significant machine impact under current conditions."]


def _build_recommended_actions(ws, gs, temp, risk_level):
    out = []
    if gs >= 1:
        out.append("Reduce boom swing speed by 15% to compensate for ground flex.")
    if gs >= 2:
        out.append("Engage Heavy Track Lock mode before each dig cycle.")
    if gs == 3:
        out.append("Relocate machine to stable ground before resuming full operations.")
    if ws >= 2:
        out.append("Limit upper-structure rotation to 90° arcs until conditions improve.")
    if ws == 3:
        out.append("STOP OPERATIONS — Park on firm ground and lower boom fully.")
    if temp < 0:
        out.append("Run low-idle warm-up for 10 minutes before full load operations.")
    if temp < -10:
        out.append("Use engine block heater; check hydraulic oil level before start.")
    if temp > 35:
        out.append("Schedule coolant check every 2 hours; reduce continuous duty cycle.")
    if risk_level == 1:
        out.append("Notify site supervisor of elevated environmental risk. Log conditions.")
    if risk_level == 2:
        out.append("IMMEDIATE: Alert site safety officer. Suspend non-essential operations.")
    return out or ["Maintain standard operating procedure. Conditions are nominal."]


# ===========================================================================
# ROUTES
# ===========================================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "CAT Smart Operator Assistant API v3"})


# ── Telemetry ───────────────────────────────────────────────────────────────

@app.route("/api/telemetry", methods=["GET"])
def get_telemetry():
    return jsonify({"status": "ok", "data": TELEMETRY_DATA})


@app.route("/api/anomalies", methods=["GET"])
def get_anomalies():
    anomalies, total_fuel, total_co2 = [], 0.0, 0.0
    for row in TELEMETRY_DATA:
        flags, wasted, co2 = [], 0.0, 0.0
        if row["idlingTime"] > IDLING_THRESHOLD:
            excess  = row["idlingTime"] - IDLING_THRESHOLD
            wasted  = round(excess * IDLE_FUEL_RATE, 3)
            co2     = round(wasted * CO2_PER_LITRE, 3)
            flags.append("HIGH_IDLING")
        if row["seatbeltStatus"] == "Unfastened":
            flags.append("SEATBELT_UNFASTENED")
        if flags:
            anomalies.append({
                "timestamp": row["timestamp"], "machineID": row["machineID"],
                "operatorID": row["operatorID"], "flags": flags,
                "idlingTime": row["idlingTime"], "seatbeltStatus": row["seatbeltStatus"],
                "wastedFuelL": wasted, "co2WastedKg": co2,
            })
            total_fuel += wasted; total_co2 += co2
    return jsonify({
        "status": "ok", "anomalyCount": len(anomalies),
        "totalWastedFuelL": round(total_fuel, 3),
        "totalCO2WastedKg": round(total_co2, 3),
        "anomalies": anomalies,
    })


# ── Daily Tasks ─────────────────────────────────────────────────────────────

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify({"status": "ok", "date": "2025-05-02", "data": TASKS})


@app.route("/api/tasks/<task_id>/status", methods=["PATCH"])
def update_task_status(task_id):
    """PATCH body: { "status": "In Progress" | "Pending" | "Completed" }"""
    body   = request.get_json(force=True, silent=True) or {}
    status = body.get("status")
    valid  = {"In Progress", "Pending", "Completed"}
    if status not in valid:
        return jsonify({"status": "error", "message": f"status must be one of {list(valid)}"}), 400
    for task in TASKS:
        if task["id"] == task_id:
            task["status"] = status
            return jsonify({"status": "ok", "task": task})
    return jsonify({"status": "error", "message": "Task not found"}), 404


# ── Proximity Hazards ───────────────────────────────────────────────────────

@app.route("/api/proximity", methods=["GET"])
def get_proximity():
    active_only = request.args.get("active", "false").lower() == "true"
    data = [p for p in PROXIMITY_DATA if p["active"]] if active_only else PROXIMITY_DATA
    critical = sum(1 for p in data if p["severity"] == "CRITICAL" and p["active"])
    return jsonify({
        "status": "ok",
        "machineID": "EXC001",
        "critical_count": critical,
        "data": data,
    })


# ── Incidents ───────────────────────────────────────────────────────────────

@app.route("/api/incidents", methods=["GET", "POST"])
def incidents():
    if request.method == "GET":
        return jsonify({"status": "ok", "count": len(INCIDENTS), "data": INCIDENTS})

    # POST — log a new incident
    body = request.get_json(force=True, silent=True) or {}
    errors = []
    required = ["incident_type", "severity", "notes", "location"]
    for field in required:
        if not body.get(field):
            errors.append(f"'{field}' is required.")
    valid_severities = {"LOW", "MODERATE", "HIGH", "CRITICAL"}
    if body.get("severity") and body["severity"] not in valid_severities:
        errors.append(f"severity must be one of {list(valid_severities)}.")
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    new_incident = {
        "id":            f"INC{len(INCIDENTS) + 1:03d}",
        "timestamp":     datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "operator":      body.get("operator", "OP1001"),
        "machineID":     body.get("machineID", "EXC001"),
        "incident_type": body["incident_type"],
        "severity":      body["severity"],
        "notes":         body["notes"],
        "location":      body["location"],
    }
    INCIDENTS.append(new_incident)
    return jsonify({"status": "ok", "message": "Incident logged.", "incident": new_incident}), 201


# ── ML Environment Analysis ──────────────────────────────────────────────────

@app.route("/api/analyze-environment", methods=["POST"])
def analyze_environment():
    body   = request.get_json(force=True, silent=True) or {}
    errors = []

    def _get(key, cast, lo, hi):
        val = body.get(key)
        if val is None:
            errors.append(f"'{key}' is required.")
            return None
        try:
            val = cast(val)
        except (TypeError, ValueError):
            errors.append(f"'{key}' must be a number.")
            return None
        if not (lo <= val <= hi):
            errors.append(f"'{key}' must be {lo}–{hi} (got {val}).")
            return None
        return val

    lc   = _get("load_cycles",      int,   1,     30)
    fuel = _get("estimated_fuel",   float, 0.5,   20.0)
    ws   = _get("weather_severity", int,   0,     3)
    gs   = _get("ground_stability", int,   0,     3)
    temp = _get("ambient_temp",     float, -20.0, 50.0)

    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    features    = np.array([[lc, fuel, ws, gs, temp]])
    eta         = round(float(_eta_model.predict(features)[0]), 1)
    risk_level  = int(_risk_model.predict(features)[0])
    risk_proba  = [round(p, 3) for p in _risk_model.predict_proba(features)[0].tolist()]

    return jsonify({
        "status":                  "ok",
        "predicted_eta_minutes":   eta,
        "risk_level":              risk_level,
        "risk_label":              RISK_LABELS[risk_level],
        "risk_description":        RISK_DESC[risk_level],
        "risk_probabilities":      {"LOW": risk_proba[0], "MODERATE": risk_proba[1], "CRITICAL": risk_proba[2]},
        "machine_impacts":         _build_machine_impacts(ws, gs, temp, lc),
        "recommended_next_actions": _build_recommended_actions(ws, gs, temp, risk_level),
        "inputs": {"load_cycles": lc, "estimated_fuel": fuel,
                   "weather_severity": ws, "ground_stability": gs, "ambient_temp": temp},
    })


# ===========================================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
