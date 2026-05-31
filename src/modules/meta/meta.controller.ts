import { Request, Response } from "express";
import { MetaService } from "./meta.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IJWTPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Metadata fetched successfully',
        data: result
    });
});

export const MetaController = {
    fetchDashboardMetaData
}