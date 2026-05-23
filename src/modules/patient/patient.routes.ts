import express from 'express';
import { PatientController } from './patient.controller';

const router = express.Router();

router.get("/", PatientController.getAllPatients)
router.patch("/:id", PatientController.updatePatient)
router.get("/:id", PatientController.getUniquePatient)
router.delete("/:id", PatientController.deleteUniquePatient)

export const patientRoutes = router;