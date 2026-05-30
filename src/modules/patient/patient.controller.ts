import { Request, Response } from "express";
import { PatientService } from "./patient.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { paginationHelperFields } from "../user/user.constant";
import { patientFilterableFields } from "./patient.constants";
import pick from "../../helper/pick";
import { IJWTPayload } from "../../types/common";
import httpStatus from "http-status";

const getAllPatients = async (req: Request, res: Response) => {

    try {
        const options = pick(req.query, paginationHelperFields)
        const filters = pick(req.query, patientFilterableFields)

        const result = await PatientService.getAllPatients(filters, options);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Patients Retrieved Successfully!",
            meta: result.meta,
            data: result.data,
        })
    } catch (error) {
        console.log(error);
    }
}

const getUniquePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.getUniquePatient(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Patient retrieved successfully!",
        data: result
    })
})

const updatePatientData = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await PatientService.updatePatientData(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data updated successfully!",
        data: result
    })
})

const deleteUniquePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.deleteUniquePatient(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Patient deleted successfully!",
        data: result
    })
})

export const PatientController = {
    getAllPatients,
    updatePatientData,
    getUniquePatient,
    deleteUniquePatient
}