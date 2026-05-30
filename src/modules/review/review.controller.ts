import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.createReview(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review Created Successfully',
        data: result,
    });
});

export const ReviewController = {
    createReview
}