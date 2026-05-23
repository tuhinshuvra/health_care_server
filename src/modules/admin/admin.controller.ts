import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { paginationHelperFields } from "../user/user.constant";
import pick from "../../helper/pick";
import { adminFilterableFields } from "./admin.constants";

const getAllAdmins = async (req: Request, res: Response) => {

    try {
        const options = pick(req.query, paginationHelperFields)
        const filters = pick(req.query, adminFilterableFields)

        const result = await AdminService.getAllAdmins(filters, options);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Admins Retrieved Successfully!",
            meta: result.meta,
            data: result.data,
        })
    } catch (error) {
        console.log(error);
    }
}

const getUniqueAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.getUniqueAdmin(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin retrieved successfully!",
        data: result
    })
})

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateAdmin(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin updated successfully!",
        data: result
    })
})

const deleteUniqueAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deleteUniqueAdmin(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin deleted successfully!",
        data: result
    })
})

export const AdminController = {
    getAllAdmins,
    updateAdmin,
    getUniqueAdmin,
    deleteUniqueAdmin
}