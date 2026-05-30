import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { ERROR_MESSAGES } from "../constants/messages";
import { ApiErrorResponse } from "../types";

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const errorResponse: ApiErrorResponse = {
    success: false,
    message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
  };
  res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse);
}
