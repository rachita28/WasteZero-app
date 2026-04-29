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

// Strict CORS for security
app.use(cors({
  origin: "https://waste-zero-app.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, try again later" },
});
app.use("/api/", limiter);

// -------------------- ROOT + HEALTH --------------------
app.get("/", (req, res) => {
  res.send("🚀 WasteZero Backend is running successfully");
});

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// -------------------- ROUTES (Standardized to v1) --------------------
app.use("/api/v1", authRoutes);
app.use("/api/v1/opportunities", opportunityRoutes); // Standardized
app.use("/api/v1/pickup", pickupRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminPanelRoutes);

// -------------------- ERROR HANDLER --------------------
app.use(errorHandler);

// -------------------- SOCKET.IO --------------------
export const io = new Server(server, {
  cors: {
    origin: "https://waste-zero-app.vercel.app",
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
const PORT = process.env.PORT || 10000; // Defaulting to Render's preferred port

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    // Start listening only after DB is successful
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1); 
  });
