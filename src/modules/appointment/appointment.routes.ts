import express from 'express';
import { AppointmentController } from './appointment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../generated/prisma';

const router = express.Router();

router.get(
    "/my-appointments",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment)

router.get(
    "/all_appointments",
    auth(UserRole.ADMIN),
    AppointmentController.getAllAppointment)

router.post(
    "/",
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment)

router.patch(
    "/status/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.updateAppointmentStatus
)

export const appointmentRoutes = router;