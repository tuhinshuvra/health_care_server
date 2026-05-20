import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post("/login", AuthController.login)
// router.get("/", UserController.getAllUser)
// router.get("/:id", UserController.getUserById)
// router.patch("/:id", UserController.updateUserById)
// router.delete("/:id", UserController.deleteUserById)

export const authRoutes = router;