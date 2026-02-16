const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("imu:update", (payload) => {
    if (!isValidRotation(payload)) {
      return;
    }

    socket.broadcast.emit("imu:update", payload);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

function isValidRotation(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const { x, y, z } = payload;
  return (
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    Number.isFinite(z)
  );
}
