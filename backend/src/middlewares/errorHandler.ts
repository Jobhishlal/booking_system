import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { HTTP_STATUS, HttpStatusCode } from "../constants/httpStatusCodes";
import { ERROR_MESSAGES } from "../constants/messages";
import { ApiErrorResponse } from "../types";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  
  if (err instanceof AppError) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: err.message,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  if (err.code && typeof err.code === "string" && err.code.startsWith("P")) {
    let statusCode: HttpStatusCode = HTTP_STATUS.BAD_REQUEST;
    let message = err.message || "Database operation failed";

    if (err.code === "P2002") {
      statusCode = HTTP_STATUS.CONFLICT;
      message = "A record with this unique attribute already exists";
    } else if (err.code === "P2025") {
      statusCode = HTTP_STATUS.NOT_FOUND;
      message = "The requested database record was not found";
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      message,
    };
    res.status(statusCode).json(errorResponse);
    return;
  }

  // Catch-all for unexpected server failures
  console.error("Unhandled Error Details:", err);
  const errorResponse: ApiErrorResponse = {
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  };
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
}
