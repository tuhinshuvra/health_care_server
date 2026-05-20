import z from "zod";

const createAdminValidationSchema = z.object({
    admin: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
    })

});

export const AdminValidation = {
    createAdminValidationSchema
}