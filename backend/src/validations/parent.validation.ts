import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";

export function validateBookOffering(req: Request, res: Response, next: NextFunction) {
  const { offeringId } = req.body;

  if (!offeringId || typeof offeringId !== "string" || offeringId.trim() === "") {
    return next(new BadRequestError("offeringId is required and must be a non-empty string"));
  }

  next();
}
