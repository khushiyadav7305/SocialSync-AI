const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// 1. Load env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 2. Routes & DB Modules
const aiRoutes = require("./routes/aiRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// 3. DB connect & Workers
connectDB();
require("./workers/postWorker");

// 4. Express aur Server initialize
const app = express();
const server = http.createServer(app);

// 5. Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

global.io = io;

// 6. Middlewares
app.use(cors());
app.use(express.json());

// 7. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);

// ================================
// 🚀 FRONTEND SERVE ADD (FIXED PATH)
// ================================
// Hum 'src' ke andar hain, toh do baar '../' karke root folder ke 'client/out' mein jayenge
app.use(express.static(path.join(__dirname, "../../client/out")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/out/index.html"));
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