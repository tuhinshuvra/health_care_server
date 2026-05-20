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

// const getUserById = async (req: Request, res: Response) => {
//     try {
//         const result = await UserService.getUserById(Number(req.params.id))
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(501).send(error);
//     }
// }

// const updateUserById = async (req: Request, res: Response) => {
//     try {
//         const result = await UserService.updateUser(Number(req.params.id), req.body)
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(501).send(error);
//     }
// }

// const deleteUserById = async (req: Request, res: Response) => {
//     try {
//         const result = await UserService.deleteUser(Number(req.params.id))
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(501).send(error);
//     }
// }

export const UserController = {
    createPatient,
    getAllUsers,
    // getUserById,
    // updateUserById,
    // deleteUserById
}