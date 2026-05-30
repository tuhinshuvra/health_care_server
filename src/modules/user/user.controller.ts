import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { paginationHelperFields, userFilterableFields } from "./user.constant";
import { IJWTPayload } from "../../types/common";
import httpStatus from "http-status";

const getMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const result = await UserService.getMyProfile(user as IJWTPayload)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Profile Fetched Successfully!",
        data: result
    })
})

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient Created Successfully!",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created Successfully!",
        data: result
    })
});

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, userFilterableFields)
        const options = pick(req.query, paginationHelperFields)

        const result = await UserService.getAllUsers(filters, options);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Users Retrieved Successfully!",
            meta: result.meta,
            data: result.data,
        })
    } catch (error) {
        console.log(error);
    }
}

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserService.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});

export const UserController = {
    getMyProfile,
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    changeProfileStatus
}