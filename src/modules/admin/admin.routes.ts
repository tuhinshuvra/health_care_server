import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import { fileUploader } from '../../helper/fileUploader';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.post(
    "/create-admin",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = AdminValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return AdminController.createAdmin(req, res, next)
    },
)
// router.get("/", UserController.getAllUser)
// router.get("/:id", UserController.getUserById)
// router.patch("/:id", UserController.updateUserById)
// router.delete("/:id", UserController.deleteUserById)

export const adminRoutes = router;