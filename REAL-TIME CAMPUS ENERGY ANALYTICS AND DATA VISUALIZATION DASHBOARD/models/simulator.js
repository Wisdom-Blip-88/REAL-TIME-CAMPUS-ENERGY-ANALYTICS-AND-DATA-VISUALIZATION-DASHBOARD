const io = require("socket.io-client");
const socket = io("http://localhost:5000");

console.log("IoT Telemetry Simulator Active (Transmitting payload every 3s)...");

const BUILDINGS = ["Faculty of Science", "Central Library", "Senate Building", "Hostel Block C"];

setInterval(() => {
  const building = BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)];
  const payload = {
    buildingName: building,
    power: parseFloat((Math.random() * (120 - 45) + 45).toFixed(2)),
    voltage: parseFloat((Math.random() * (240 - 215) + 215).toFixed(1)),
    current: parseFloat((Math.random() * (300 - 150) + 150).toFixed(1))
  };

  socket.emit("newTelemetry", payload);
  console.log("Transmitted payload:", payload);
}, 3000);