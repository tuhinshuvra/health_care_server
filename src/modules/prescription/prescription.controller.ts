import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";
import pick from "../../helper/pick";
import { paginationHelperFields } from "../user/user.constant";

const patientPrescription = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, paginationHelperFields)
    const result = await PrescriptionService.patientPrescription(user as IJWTPayload, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

const createPrescription = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescription(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Prescription Created Successfully!",
        data: result
    })
})


export const PrescriptionController = {
    createPrescription,
    patientPrescription
}