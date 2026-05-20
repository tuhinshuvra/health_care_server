import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { fileUploader } from '../../helper/fileUploader';
import { UserValidation } from './user.validation';
import { UserRole } from '../../generated/prisma'
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    UserController.getAllUsers
)

router.post(
    "/create-patient",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    },
)
// router.get("/:id", UserController.getUserById)
// router.patch("/:id", UserController.updateUserById)
// router.delete("/:id", Use rController.deleteUserById)

export const userRoutes = router;