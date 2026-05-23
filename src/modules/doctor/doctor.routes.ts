import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.get("/", DoctorController.getAllDoctors)
router.patch("/:id", DoctorController.updateDoctor)
// router.patch("/:id", UserController.updateUserById)
// router.delete("/:id", UserController.deleteUserById)

export const doctorRoutes = router;