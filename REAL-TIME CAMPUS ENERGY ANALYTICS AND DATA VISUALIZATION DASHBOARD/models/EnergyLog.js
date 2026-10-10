const mongoose = require("mongoose");

const EnergyLogSchema = new mongoose.Schema({
  buildingName: { type: String, required: true },
  powerUsageKw: { type: Number, required: true },
  voltage: { type: Number, required: true },
  currentAmp: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EnergyLog", EnergyLogSchema);