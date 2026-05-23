import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { paginationHelperFields, userFilterableFields } from "./user.constant";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req)

    // console.log("createPatient : ", req.body);
    // console.log("createPatient result : ", result);
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
        message: "Doctor Created successfuly!",
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



export const UserController = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    // getUserById,
    // updateUserById,
    // deleteUserById
}