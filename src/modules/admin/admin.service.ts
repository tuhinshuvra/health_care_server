import { prisma } from "../../config/db";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";

const createAdmin = async (req: Request) => {

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.admin.profilePhoto = uploadResult?.secure_url
    }

    const result = await prisma.$transaction(async (tnx) => {
        const adminData = await tnx.admin.create({
            data: req.body.admin
        });
        return adminData
    })
    return result
}


export const AdminService = {
    createAdmin,
}