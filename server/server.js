import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
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
app.use(cors());
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, try again later" },
});
app.use("/api/", limiter);

// -------------------- ROOT + HEALTH (VERY IMPORTANT) --------------------
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// -------------------- ROUTES --------------------
app.use("/api/v1", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/v1/pickup", pickupRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminPanelRoutes);

// -------------------- ERROR HANDLER --------------------
app.use(errorHandler);

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// -------------------- SOCKET.IO --------------------
export const io = new Server(server, {
  cors: {
    origin: "https://waste-zero-app.vercel.app", // your frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
