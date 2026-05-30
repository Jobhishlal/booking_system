import { Request, Response, NextFunction } from "express";
import { ParentService } from "../services/parent.service";
import { BookingService } from "../services/booking.service";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { SUCCESS_MESSAGES } from "../constants/messages";
import { ApiResponse } from "../types";

export class ParentController {
  constructor(
    private parentService = new ParentService(),
    private bookingService = new BookingService()
  ) {}

  getAvailableOfferings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.params.parentId as string;

      const offerings = await this.parentService.getAvailableOfferings(parentId);

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.AVAILABLE_OFFERINGS_FETCHED,
        data: offerings,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  bookOffering = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.params.parentId as string;
      const offeringId = req.body.offeringId as string;

      const booking = await this.bookingService.bookOffering(parentId, offeringId);

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.BOOKING_SUCCESSFUL,
        data: booking,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.params.parentId as string;

      const bookings = await this.parentService.getBookings(parentId);

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED,
        data: bookings,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
