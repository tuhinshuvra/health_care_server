import { Prisma } from "../generated/prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log(err);

    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error: any = err;

    /**   * Prisma Known Request Errors   */
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            // Unique constraint failed
            case "P2002":
                statusCode = httpStatus.CONFLICT;
                message = `Duplicate key error`;
                error = err.meta;
                break;

            // Foreign key constraint failed
            case "P2003":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Foreign key constraint failed";
                error = err.meta;
                break;

            // Record not found
            case "P2025":
                statusCode = httpStatus.NOT_FOUND;
                message = "Record not found";
                error = err.meta;
                break;

            // Missing required value
            case "P2012":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Missing required value";
                error = err.meta;
                break;

            // Relation violation
            case "P2014":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Invalid relation detected";
                error = err.meta;
                break;

            // Invalid ID
            case "P2023":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Invalid ID or malformed value";
                error = err.meta;
                break;

            // Query parameter missing
            case "P1012":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Missing required query parameter";
                error = err.meta;
                break;

            // DB Authentication Failed
            case "P1000":
                statusCode = httpStatus.BAD_GATEWAY;
                message = "Database authentication failed";
                error = err.meta;
                break;

            // Cannot reach DB
            case "P1001":
                statusCode = httpStatus.SERVICE_UNAVAILABLE;
                message = "Cannot reach database server";
                error = err.meta;
                break;

            // DB timeout
            case "P1002":
                statusCode = httpStatus.REQUEST_TIMEOUT;
                message = "Database timeout";
                error = err.meta;
                break;

            // DB does not exist
            case "P1003":
                statusCode = httpStatus.NOT_FOUND;
                message = "Database does not exist";
                error = err.meta;
                break;

            // Table does not exist
            case "P2021":
                statusCode = httpStatus.NOT_FOUND;
                message = "Table does not exist";
                error = err.meta;
                break;

            // Column does not exist
            case "P2022":
                statusCode = httpStatus.NOT_FOUND;
                message = "Column does not exist";
                error = err.meta;
                break;

            default:
                statusCode = httpStatus.BAD_REQUEST;
                message = err.message;
                error = err.meta;
        }
    }

    /**  * Prisma Validation Error     */
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Prisma validation error";
        error = err.message;
    }

    /**  * Prisma Unknown Error     */
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Unknown Prisma error occurred";
        error = err.message;
    }

    /**  * Prisma Initialization Error  */
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.SERVICE_UNAVAILABLE;
        message = "Prisma client failed to initialize";
        error = err.message;
    }

    /**     * Prisma Rust Panic Error     */
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Prisma engine crashed";
        error = err.message;
    }

    /**     * Generic JS Error     */
    else if (err instanceof Error) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = err.message;
        error = err.stack;
    }

    res.status(statusCode).json({
        success,
        message,
        error,
        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};

export default globalErrorHandler;