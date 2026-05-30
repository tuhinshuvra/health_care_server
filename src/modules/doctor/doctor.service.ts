import { prisma } from "../../config/db";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import { Prisma } from "../../generated/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import httpStatus from 'http-status';
import ApiError from "../../errors/ApiError";
import { openai } from "../../helper/open_router";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMessage";
import { includes } from "zod";
import { specialtiesRoutes } from "../specialties/specialties.routes";

const getAllDoctors = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, specialties, ...filterData } = params;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
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

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            },
            reviews: {
                select: {
                    rating: true,
                    comment: true
                }
            },
        }
    });

    const total = await prisma.doctor.count({
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

const getAISuggestions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Symptoms is required!");
    }

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });

    console.log("Doctors data loading .....\n");

    const prompt = `
        You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
        Each doctor has specialties and years of experience.
        Only suggest doctors who are relevant to the given symptoms.

        Symptoms: ${payload.symptoms}

        Here is the doctor list (in JSON): ${JSON.stringify(doctors, null, 2)}

        Return your response in JSON format with full individual doctor data.`;

    console.log("Analyzing ......\n");

    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    // console.log(completion.choices[0].message);
    const result = await extractJsonFromMessage(completion.choices[0].message)
    return result;
}

const getUniqueDoctor = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                }
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            reviews: true
        }
    });

    return result;
}

const updateDoctor = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    })

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

        return updatedData;
    })
}

const deleteUniqueDoctor = async (id: string) => {
    try {
        const result = await prisma.doctor.delete({
            where: { id }
        });
        return result;

    } catch (error: any) {
        if (error.code === "P2025") {
            throw new Error("Doctor not found");
        }
        throw error;
    }
}

export const DoctorService = {
    getAllDoctors,
    getAISuggestions,
    getUniqueDoctor,
    updateDoctor,
    deleteUniqueDoctor
}