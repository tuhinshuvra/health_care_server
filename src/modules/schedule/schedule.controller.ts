import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../helper/pick";
import { paginationHelperFields } from "../user/user.constant";
import { IJWTPayload } from "../../types/common";

const schedulesForDoctor = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const options = pick(req.query, paginationHelperFields);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user;

    const result = await ScheduleService.schedulesForDoctor(user as IJWTPayload, filters, options);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule fetched successfully!",
        data: result.data,
        meta: result.meta
    })
})

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
})


const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const deletedId = req.params.id as string;
    const result = await ScheduleService.deleteSchedule(deletedId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    })
})

export const ScheduleController = {
    insertIntoDB,
    schedulesForDoctor,
    deleteSchedule
}