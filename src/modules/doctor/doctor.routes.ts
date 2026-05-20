import express, { NextFunction, Request, Response } from 'express';
import { DoctorController } from './doctor.controller';
import { fileUploader } from '../../helper/fileUploader';
import { DoctorValidation } from './doctor.validation';

const router = express.Router();

router.post(
    "/create-doctor",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = DoctorValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        return DoctorController.createDoctor(req, res, next)
    },
)
// router.get("/", UserController.getAllUser)
// router.get("/:id", UserController.getUserById)
// router.patch("/:id", UserController.updateUserById)
// router.delete("/:id", UserController.deleteUserById)

export const doctorRoutes = router;