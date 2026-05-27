import z from "zod";

const createDoctorValidationSchema = z.object({
    doctor: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        registrationNumber: z.string().nonempty("Registration no is required"),
        qualification: z.string().optional(),
        currentWorkingPlace: z.string().optional()
    })

});

export const DoctorValidation = {
    createDoctorValidationSchema
}