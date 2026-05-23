import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.get("/", DoctorController.getAllDoctors)
router.patch("/:id", DoctorController.updateDoctor)
router.get("/:id", DoctorController.getUniqueDoctor)
router.delete("/:id", DoctorController.deleteUniqueDoctor)

export const doctorRoutes = router;