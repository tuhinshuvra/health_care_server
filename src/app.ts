import compression from "compression";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { doctorRoutes } from "./modules/doctor/doctor.routes";
import { patientRoutes } from "./modules/patient/patient.routes";
import { scheduleRoutes } from "./modules/schedule/schedule.route";
import { doctorScheduleRoutes } from "./modules/doctorSchedule/doctorSchedule.route";
import { specialtiesRoutes } from "./modules/specialties/specialties.routes";
import { appointmentRoutes } from "./modules/appointment/appointment.routes";
import { PaymentController } from "./modules/payment/payment.controller";
import { prescriptionRoutes } from "./modules/prescription/prescription.routes";
import { reviewRoutes } from "./modules/review/review.route";

const app = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
)

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (_req, res) => {
  res.send("Thanks God Health-Care-Server is Running!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/doctor-schedule", doctorScheduleRoutes);
app.use("/api/v1/specialties", specialtiesRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/prescription", prescriptionRoutes);
app.use("/api/v1/review", reviewRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;