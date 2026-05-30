import { prisma } from "../../config/db";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { patientSearchableFields } from "./patient.constants";
import { Prisma } from "../../generated/prisma";
import { IJWTPayload } from "../../types/common";

const getAllPatients = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, specialties, ...filterData } = params;

    const andConditions: Prisma.PatientWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))
        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.PatientWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.patient.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result,
    }
}

const getUniquePatient = async (id: string) => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: { id }
    });

    return result;
}

const updatePatientData = async (user: IJWTPayload, payload: any) => {
    const { medicalReport, patientHealthData, ...patientData } = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false
        }
    })

    return await prisma.$transaction(async (tnx) => {
        await tnx.patient.update({
            where: {
                id: patientInfo.id
            },
            data: patientData
        })

        if (patientHealthData) {
            await tnx.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id,
                },
                update: patientHealthData,
                create: {
                    ...patientHealthData,
                    patientId: patientInfo.id
                }
            })
        }

        if (medicalReport) {
            await tnx.medicalReport.create({
                data: {
                    ...medicalReport,
                    patientId: patientInfo.id
                }
            })
        }

        const result = tnx.patient.findUnique({
            where: {
                id: patientInfo.id
            },
            include: {
                patientHealthData: true,
                medicalReports: true
            }
        })
        return result
    })
}

const deleteUniquePatient = async (id: string) => {
    try {
        const result = await prisma.patient.delete({
            where: { id }
        });
        return result;

    } catch (error: any) {
        if (error.code === "P2025") {
            throw new Error("Patient not found");
        }
        throw error;
    }
}

export const PatientService = {
    getAllPatients,
    updatePatientData,
    getUniquePatient,
    deleteUniquePatient
}