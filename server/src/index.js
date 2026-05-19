const express = require("express");
const cors = require("cors");
const path = require("path"); // 👑 Path module zaroori hai
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// 👑 UPDATE 1: Absolute path se .env load kiya taaki REDIS_URL mil sake aur 127.0.0.1 ka loop band ho!
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Routes aur DB Imports
const aiRoutes = require("./routes/aiRoutes"); // 👑 AI route wapas joda
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Database Configuration
connectDB();

// 👑 UPDATE 2: Background queues/workers ko initialize kiya (Redis ab khush rahega)
require("./workers/postWorker");

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

global.io = io;

app.use(cors());
app.use(express.json());

// Routes Setup
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes); // 👑 AI route connect kiya

app.get("/", (req, res) => {
  res.send("SocialSync AI Server Running");
});

// Socket Connections
io.on("connection", (socket) => {
  console.log("User Connected 🔌:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected ❌");
  });
});

const PORT = process.env.PORT || 5000;

// 👑 Hamesha dhyan rakhna, jab socket.io use karte hain toh server.listen() chalate hain, app.listen() nahi!
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});