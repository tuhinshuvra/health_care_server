import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { paginationHelperFields } from "../user/user.constant";

const createAppointment = async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment Created Successfully!",
        data: result
    })
}

const getMyAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, paginationHelperFields);
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = await AppointmentService.getMyAppointment(user as IJWTPayload, filters, options);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment Retrieved Successfully!",
        data: result
    })
})

const getAllAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, paginationHelperFields);
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = await AppointmentService.getAllAppointment(user as IJWTPayload, filters, options);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "All Appointments Retrieved Successfully!",
        data: result
    })
})

const updateAppointmentStatus = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    // const options = pick(req.query, paginationHelperFields);
    // const filters = pick(req.query, ["status", "paymentStatus"]);
    const result = await AppointmentService.updateAppointmentStatus(id as string, status, user as IJWTPayload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment Updated Successfully!",
        data: result
    })
})

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllAppointment,
    updateAppointmentStatus
}