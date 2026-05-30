import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";

export function validateCreateOffering(req: Request, res: Response, next: NextFunction) {
  const { courseId, title, price } = req.body;

  if (!courseId || typeof courseId !== "string" || courseId.trim() === "") {
    return next(new BadRequestError("courseId is required and must be a non-empty string"));
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    return next(new BadRequestError("title is required and must be a non-empty string"));
  }

  if (price === undefined || (typeof price !== "number" && typeof price !== "string") || isNaN(Number(price))) {
    return next(new BadRequestError("price is required and must be a valid number"));
  }

  if (Number(price) < 0) {
    return next(new BadRequestError("price must be a non-negative number"));
  }

  next();
}

export function validateAddSessions(req: Request, res: Response, next: NextFunction) {
  const { sessions } = req.body;

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return next(new BadRequestError("sessions is required and must be a non-empty array"));
  }

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    if (!session || typeof session !== "object") {
      return next(new BadRequestError(`session at index ${i} must be an object`));
    }
    const { startTime, endTime } = session;
    if (!startTime || typeof startTime !== "string" || startTime.trim() === "") {
      return next(new BadRequestError(`startTime is required for session at index ${i}`));
    }
    if (!endTime || typeof endTime !== "string" || endTime.trim() === "") {
      return next(new BadRequestError(`endTime is required for session at index ${i}`));
    }
  }

  next();
}
