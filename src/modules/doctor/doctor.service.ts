import { prisma } from "../../config/db";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";

const createDoctor = async (req: Request) => {

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    }

    const result = await prisma.$transaction(async (tnx) => {
        const doctorData = await tnx.doctor.create({
            data: req.body.doctor
        });
        return doctorData
    })
    return result
}


export const DoctorService = {
    createDoctor,
}