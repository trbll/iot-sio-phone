const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
// Socket.IO must be attached to the same HTTP server Express uses.
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Render and other hosts can use this endpoint to verify the process is healthy.
app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

// Serve everything in /public as static files.
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Controller clients emit IMU rotation updates here.
  socket.on("imu:update", (payload) => {
    if (!isValidRotation(payload)) {
      return;
    }

    // Relay to everyone else (typically viewer clients), not back to sender.
    socket.broadcast.emit("imu:update", payload);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function isValidRotation(payload) {
  // Basic runtime guard so malformed data is dropped early.
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
