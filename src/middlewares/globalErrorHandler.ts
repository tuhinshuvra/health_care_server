import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../generated/prisma/client";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);

    let statusCode: number =
        err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

    let success = false;
    let message = err.message || "Something went wrong!";
    let error: any = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        // Duplicate field
        if (err.code === "P2002") {
            statusCode = httpStatus.CONFLICT;
            message = "Duplicate key error";
            error = err.meta;
        }

        // Database authentication failed
        else if (err.code === "P1000") {
            statusCode = httpStatus.BAD_GATEWAY;
            message = "Authentication failed against database server";
            error = err.meta;
        }

        // Foreign key constraint
        else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Foreign key constraint failed";
            error = err.meta;
        }

        // Record not found
        else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            message = "Doctor Schedule for this time is not available!";
            error = err.meta;
        }
    }

    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";
        error = err.message;
    }

    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Unknown Prisma error occurred!";
        error = err.message;
    }

    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Prisma client failed to initialize!";
        error = err.message;
    }

    res.status(statusCode).json({
        success,
        message,
        error,
    });
};

export default globalErrorHandler;