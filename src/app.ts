import compression from "compression";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { doctorRoutes } from "./modules/doctor/doctor.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { scheduleRoutes } from "./modules/schedule/schedule.route";
import { doctorScheduleRoutes } from "./modules/doctorSchedule/doctorSchedule.route";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/doctor", doctorRoutes)
app.use("/api/v1/schedule", scheduleRoutes)
app.use("/api/v1/doctor-schedule", doctorScheduleRoutes)

// Default route for testing
app.get("/", (_req, res) => {
  res.send("Welcome Prisma API is Running!");
});


// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
