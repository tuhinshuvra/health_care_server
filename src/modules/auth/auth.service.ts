import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { UserStatus } from "../../generated/prisma";
import { jwtHelper } from "../../helper/jwtHelper";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status"

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect")
    }

    const accessToken = jwtHelper.generateToken({ email: user.email, role: user.role }, "abcd", "1h");
    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role }, "abcd", "90d");

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}


export const AuthService = {
    login,
}