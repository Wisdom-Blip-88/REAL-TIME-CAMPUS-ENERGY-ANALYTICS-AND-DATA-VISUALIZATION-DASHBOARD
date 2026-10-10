import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, Activity, ShieldAlert, Cpu, Radio, Sparkles } from "lucide-react";

const socket = io("http://localhost:5000");

export default function App() {
  const [telemetry, setTelemetry] = useState([]);
  const [currentReadings, setCurrentReadings] = useState({
    buildingName: "Bingham Main Library",
    power: 0,
    voltage: 0,
    current: 0
  });

  useEffect(() => {
    socket.on("energyData", (data) => {
      setCurrentReadings(data);
      setTelemetry((prev) => [
        ...prev.slice(-19),
        { time: new Date().toLocaleTimeString(), power: data.power, voltage: data.voltage }
      ]);
    });

    return () => socket.off("energyData");
  }, []);

  const isHighPower = currentReadings.power > 100;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION WITH GRADIENT BADGES */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.badgeGroup}>
            <span style={styles.liveBadge}>
              <Radio size={14} color="#00ff88" style={{ marginRight: 6 }} /> LIVE TELEMETRY
            </span>
            <span style={styles.universityBadge}>
              <Sparkles size={14} color="#ffd700" style={{ marginRight: 6 }} /> BINGHAM UNIVERSITY, KARU
            </span>
          </div>
          <p style={styles.timeStamp}>System Status: <strong style={{ color: "#00ff88" }}>Optimal</strong></p>
        </div>
        <h1 style={styles.title}>Smart Campus Energy Analytics</h1>
        <p style={styles.subtitle}>Real-time IoT Power Grid Monitoring & Peak Load Management</p>
      </header>

      {/* ALERT BANNER FOR HIGH POWER USAGE */}
      {isHighPower && (
        <div style={styles.alertBanner}>
          <ShieldAlert color="#ff0055" size={24} />
          <span style={styles.alertText}>
            <strong>HIGH POWER ALERT:</strong> Peak consumption load detected at {currentReadings.buildingName} ({currentReadings.power} kW).
          </span>
        </div>
      )}

      {/* COLORFUL GLOWING METRIC CARDS */}
      <div style={styles.grid}>
        {/* ACTIVE POWER CARD */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)", borderColor: "#818cf8" }}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconBox, backgroundColor: "rgba(129, 140, 248, 0.2)" }}>
              <Zap color="#fbbf24" size={28} />
            </div>
            <span style={{ ...styles.tag, color: "#fbbf24", borderColor: "#fbbf24" }}>POWER</span>
          </div>
          <span style={styles.cardLabel}>Active Grid Usage</span>
          <h2 style={{ ...styles.cardValue, color: "#fbbf24" }}>{currentReadings.power} <span style={styles.unit}>kW</span></h2>
        </div>

        {/* LINE VOLTAGE CARD */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)", borderColor: "#34d399" }}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconBox, backgroundColor: "rgba(52, 211, 153, 0.2)" }}>
              <Activity color="#34d399" size={28} />
            </div>
            <span style={{ ...styles.tag, color: "#34d399", borderColor: "#34d399" }}>VOLTAGE</span>
          </div>
          <span style={styles.cardLabel}>Main Line Supply</span>
          <h2 style={{ ...styles.cardValue, color: "#34d399" }}>{currentReadings.voltage} <span style={styles.unit}>V</span></h2>
        </div>

        {/* CURRENT LOAD CARD */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)", borderColor: "#38bdf8" }}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconBox, backgroundColor: "rgba(56, 189, 248, 0.2)" }}>
              <Cpu color="#38bdf8" size={28} />
            </div>
            <span style={{ ...styles.tag, color: "#38bdf8", borderColor: "#38bdf8" }}>LOAD</span>
          </div>
          <span style={styles.cardLabel}>{currentReadings.buildingName}</span>
          <h2 style={{ ...styles.cardValue, color: "#38bdf8" }}>{currentReadings.current} <span style={styles.unit}>A</span></h2>
        </div>
      </div>

      {/* GRADIENT CHART CARD */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div>
            <h3 style={styles.chartTitle}>Live Energy Consumption Trend</h3>
            <p style={styles.chartSubtitle}>Dynamic telemetry readings updated every 3 seconds</p>
          </div>
          <span style={styles.buildingBadge}>{currentReadings.buildingName}</span>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={telemetry}>
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1b4b",
                borderColor: "#818cf8",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                color: "#fff"
              }}
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke="#a855f7"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#powerGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#090d16",
    color: "#f8fafc",
    minHeight: "100vh",
    padding: "36px 48px",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
  },
  header: { marginBottom: "28px" },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  badgeGroup: { display: "flex", gap: "12px", alignItems: "center" },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 136, 0.12)",
    color: "#00ff88",
    border: "1px solid rgba(0, 255, 136, 0.3)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },
  universityBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.12)",
    color: "#ffd700",
    border: "1px solid rgba(255, 215, 0, 0.3)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },
  timeStamp: { fontSize: "14px", color: "#94a3b8" },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
    background: "linear-gradient(90deg, #60a5fa, #c084fc, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: { color: "#94a3b8", marginTop: "6px", fontSize: "16px" },
  alertBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "rgba(255, 0, 85, 0.15)",
    border: "1px solid #ff0055",
    borderRadius: "12px",
    padding: "14px 20px",
    marginBottom: "28px"
  },
  alertText: { color: "#ff80a0", fontSize: "15px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "36px"
  },
  card: {
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  iconBox: { padding: "12px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  tag: { fontSize: "11px", fontWeight: "800", padding: "4px 8px", borderRadius: "6px", border: "1px solid" },
  cardLabel: { color: "#cbd5e1", fontSize: "14px", fontWeight: "500", display: "block" },
  cardValue: { fontSize: "38px", fontWeight: "800", margin: "8px 0 0" },
  unit: { fontSize: "20px", fontWeight: "500", opacity: 0.8 },
  chartCard: {
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    padding: "28px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)"
  },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  chartTitle: { fontSize: "20px", fontWeight: "700", margin: 0, color: "#f3f4f6" },
  chartSubtitle: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
  buildingBadge: {
    backgroundColor: "#1e1b4b",
    color: "#a855f7",
    border: "1px solid #a855f7",
    padding: "6px 16px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700"
  }
};