const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const EnergyLog = require("./models/EnergyLog");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/campus_energy")
  .then(() => console.log("MongoDB Database Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// REST Route for Historical Analytics
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await EnergyLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Unable to retrieve energy logs." });
  }
});

// Socket.io Real-Time Pipeline
io.on("connection", (socket) => {
  console.log(`[Socket Connected] Client ID: ${socket.id}`);

  socket.on("newTelemetry", async (data) => {
    try {
      // 1. Save reading into MongoDB
      const log = new EnergyLog({
        buildingName: data.buildingName,
        powerUsageKw: data.power,
        voltage: data.voltage,
        currentAmp: data.current
      });
      await log.save();

      // 2. Broadcast telemetry to open React clients
      io.emit("energyData", data);
    } catch (err) {
      console.error("Telemetry Processing Error:", err);
    }
  });

  socket.on("disconnect", () => console.log(`[Socket Disconnected] Client ID: ${socket.id}`));
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));