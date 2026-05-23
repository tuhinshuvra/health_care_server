import { NextFunction, Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { paginationHelperFields } from "../user/user.constant";
import pick from "../../helper/pick";
import { doctorFilterableFields } from "./doctor.constants";

const getAllDoctors = async (req: Request, res: Response) => {

    try {
        const options = pick(req.query, paginationHelperFields)
        const filters = pick(req.query, doctorFilterableFields)

        const result = await DoctorService.getAllDoctors(filters, options);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Doctors Retrieved Successfully!",
            data: result,
        })
    } catch (error) {
        console.log(error);
    }
}

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.updateDoctor(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
})




export const DoctorController = {
    getAllDoctors,
    updateDoctor
}