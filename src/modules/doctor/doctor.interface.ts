import { GENDER } from "../../generated/prisma";

export type IDoctorUpdateInput = {
    email: string;
    contactNumber: string;
    gender: GENDER;
    appointmentFee: number;
    name: string;
    address: string;
    registrationNumber: string;
    experience: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string;
        isDeleted?: boolean;
    }[]
}