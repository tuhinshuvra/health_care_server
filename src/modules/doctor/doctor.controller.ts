import { NextFunction, Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.createDoctor(req)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created Successfully!",
        data: result
    })
})


export const DoctorController = {
    createDoctor,
}