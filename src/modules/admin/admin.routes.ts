import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get("/", AdminController.getAllAdmins)
router.patch("/:id", AdminController.updateAdmin)
router.get("/:id", AdminController.getUniqueAdmin)
router.delete("/:id", AdminController.deleteUniqueAdmin)

export const adminRoutes = router;