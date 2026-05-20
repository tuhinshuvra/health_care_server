import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { Prisma, User } from "../../generated/prisma";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { email } from "zod";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        // console.log({ uploadResult });
        req.body.patient.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                contactNumber: req.body.patient.contactNumber,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: req.body.patient
        })
    })
    return result
}

const getAllUsers = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}



// const getUserById = async (id: number) => {
//     const result = await prisma.user.findUnique({
//         where: {
//             id
//         },
//         select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             picture: true,
//             role: true,
//             status: true,
//             posts: true,
//             createdAt: true,
//             updatedAt: true,
//         },
//     })
//     return result;
// }

// const updateUser = async (id: number, payload: Partial<User>) => {
//     const result = await prisma.user.update({
//         where: { id },
//         data: payload
//     })
//     return result;
// }


export const UserService = {
    createPatient,
    getAllUsers,
}