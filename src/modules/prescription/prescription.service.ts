import { prisma } from "../../config/db";
import ApiError from "../../errors/ApiError";
import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "../../generated/prisma";
import { paginationHelper } from "../../helper/paginationHelper";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IJWTPayload } from "../../types/common";
import httpStatus from "http-status";

const patientPrescription = async (user: IAuthUser, options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user?.email
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user?.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const createPrescription = async (user: IJWTPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (user.role === UserRole.DOCTOR) {
        console.log("User Email: ", user.email);
        console.log("appointmentData.doctor.email: ", appointmentData.doctor.email);
        if (!(user.email === appointmentData.doctor.email))
            throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment")
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || new Date()
        },
        include: {
            patient: true
        }
    });

    return result;
}

export const PrescriptionService = {
    createPrescription,
    patientPrescription
}