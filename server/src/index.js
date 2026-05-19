const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);
app.use(express.static(path.join(__dirname, "../client/out")));

// Load env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Routes & DB
const aiRoutes = require("./routes/aiRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// DB connect
connectDB();

// Workers
require("./workers/postWorker");

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // 👈 production safe (localhost hata diya)
    methods: ["GET", "POST"],
  },
});

global.io = io;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);

// ================================
// 🚀 FRONTEND SERVE ADD (NEW PART)
// ================================
app.use(express.static(path.join(__dirname, "../client/out")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/out/index.html"));
});

// Home route
app.get("/", (req, res) => {
  res.send("SocialSync AI Server Running");
});

// Socket events
io.on("connection", (socket) => {
  console.log("User Connected 🔌:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected ❌");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});