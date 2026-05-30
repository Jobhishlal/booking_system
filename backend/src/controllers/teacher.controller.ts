import { Request, Response, NextFunction } from "express";
import { TeacherService } from "../services/teacher.service";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { SUCCESS_MESSAGES } from "../constants/messages";
import { ApiResponse } from "../types";

export class TeacherController {
  constructor(private teacherService = new TeacherService()) {}

  createOffering = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.params.teacherId as string;
      const { courseId, title, price } = req.body;
      
      const offering = await this.teacherService.createOffering(
        teacherId,
        courseId,
        title,
        Number(price)
      );

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.OFFERING_CREATED,
        data: offering,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  addSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.params.teacherId as string;
      const offeringId = req.params.offeringId as string;
      const { sessions } = req.body;

      const createdSessions = await this.teacherService.addSessionsToOffering(
        teacherId,
        offeringId,
        sessions
      );

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.SESSIONS_ADDED,
        data: createdSessions,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getOfferings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.params.teacherId as string;

      const offerings = await this.teacherService.getTeacherOfferings(teacherId);

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.TEACHER_OFFERINGS_FETCHED,
        data: offerings,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
