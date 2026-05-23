import { prisma } from "../../config/db";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorFilterableFields } from "./doctor.constants";
import { Prisma } from "../../generated/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllDoctors = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        OR: doctorFilterableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: "insensitive"

            }
        }))
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))
        andConditions.push(...filterConditions)
    }
}

const updateDoctor = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialtiesId: specialty.specialtyId
                    }
                })
            }

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialtiesId: specialty.specialtyId
                    }
                })
            }
        }

        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialties: true
                    }
                }
            }
        })

        return updatedData
    })
}

export const DoctorService = {
    getAllDoctors,
    updateDoctor,
}