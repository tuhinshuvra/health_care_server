import { UserRole } from "../generated/prisma";

export type IJWTPayload = {
    email: string;
    role: UserRole;
}