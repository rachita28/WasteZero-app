import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./src/api/modules/user/user.routes.js";
import opportunityRoutes from "./src/api/modules/opportunity/opportunity.routes.js";
import dashboardRoutes from "./src/api/modules/dashboard/dashboard.routes.js";
import adminPanelRoutes from "./src/api/modules/adminpanel/adminpanel.routes.js";
import messageRoutes from "./src/api/modules/messages/message.routes.js";
import pickupRoutes from "./src/api/modules/pickup/pickup.routes.js";

// Middleware
import errorHandler from "./src/api/middleware/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// -------------------- MIDDLEWARES --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sabhi origins allow karne ke liye (Deployment testing ke liye best hai)
app.use(cors()); 

app.use(morgan("dev"));

// -------------------- ROOT + HEALTH --------------------
app.get("/", (req, res) => {
  res.send("🚀 WasteZero Backend is running successfully");
});

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// -------------------- ROUTES (v1) --------------------
// Note: Agar authRoutes ke andar /login aur /register hai, 
// toh final URL: https://wastezero-app-1.onrender.com/api/v1/login hoga.
app.use("/api/v1", authRoutes);
app.use("/api/v1/opportunities", opportunityRoutes);
app.use("/api/v1/pickup", pickupRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminPanelRoutes);

// -------------------- ERROR HANDLER --------------------
app.use(errorHandler);

// -------------------- SOCKET.IO --------------------
export const io = new Server(server, {
  cors: {
    origin: "*", // Sabhi frontend links allow karega
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// -------------------- DATABASE & SERVER START --------------------
const PORT = process.env.PORT || 10000;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("❌ DB_URI is missing in Environment Variables!");
  process.exit(1);
}

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1); 
  });
