import express from 'express';
import { PatientController } from './patient.controller';
import { UserRole } from '../../generated/prisma';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN),
    PatientController.getAllPatients)

router.get(
    "/:id",
    auth(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN),
    PatientController.getUniquePatient
)

router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    PatientController.deleteUniquePatient
)

router.patch(
    "/",
    auth(UserRole.PATIENT, UserRole.ADMIN),
    PatientController.updatePatientData
)

export const patientRoutes = router;