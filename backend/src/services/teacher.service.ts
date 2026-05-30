import { TeacherRepository } from "../repositories/teacher.repository";
import { OfferingRepository } from "../repositories/offering.repository";
import { SessionRepository } from "../repositories/session.repository";
import { CourseRepository } from "../repositories/course.repository";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { toUTC, toLocalString } from "../utils/timezone";
import { ERROR_MESSAGES } from "../constants/messages";

export class TeacherService {
  constructor(
    private teacherRepo = new TeacherRepository(),
    private offeringRepo = new OfferingRepository(),
    private sessionRepo = new SessionRepository(),
    private courseRepo = new CourseRepository()
  ) {}

  async createOffering(
    teacherId: string,
    courseId: string,
    title: string,
    price: number
  ) {
    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError(ERROR_MESSAGES.TEACHER_NOT_FOUND);
    }

    const course = await this.courseRepo.findById(courseId);
    if (!course) {
      throw new NotFoundError(ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    if (price < 0) {
      throw new BadRequestError("Price cannot be negative");
    }

    const offering = await this.offeringRepo.create({
      teacherId,
      courseId,
      title,
      price,
    });

    return offering;
  }

  async addSessionsToOffering(
    teacherId: string,
    offeringId: string,
    sessionsInput: Array<{ startTime: string; endTime: string }>
  ) {
    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError(ERROR_MESSAGES.TEACHER_NOT_FOUND);
    }

    const offering = await this.offeringRepo.findById(offeringId);
    if (!offering) {
      throw new NotFoundError(ERROR_MESSAGES.OFFERING_NOT_FOUND);
    }

    if (offering.teacherId !== teacherId) {
      throw new BadRequestError("Offering does not belong to this teacher");
    }

    if (!sessionsInput || sessionsInput.length === 0) {
      throw new BadRequestError("At least one session must be provided");
    }

    // Convert sessions start and end times to UTC based on the teacher's timezone
    const sessionsData = sessionsInput.map((session) => {
      const utcStart = toUTC(session.startTime, teacher.timezone);
      const utcEnd = toUTC(session.endTime, teacher.timezone);

      if (utcStart >= utcEnd) {
        throw new BadRequestError(
          `Session start time (${session.startTime}) must be before end time (${session.endTime})`
        );
      }

      return {
        offeringId,
        startTime: utcStart,
        endTime: utcEnd,
      };
    });

    await this.sessionRepo.createMany(sessionsData);

    // Retrieve sessions and map them back to local times for the teacher
    const updatedSessions = await this.sessionRepo.findByOfferingId(offeringId);
    return updatedSessions.map((session) => ({
      id: session.id,
      offeringId: session.offeringId,
      startTimeUTC: session.startTime,
      endTimeUTC: session.endTime,
      startTimeLocal: toLocalString(session.startTime, teacher.timezone),
      endTimeLocal: toLocalString(session.endTime, teacher.timezone),
    }));
  }

  async getTeacherOfferings(teacherId: string) {
    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError(ERROR_MESSAGES.TEACHER_NOT_FOUND);
    }

    const offerings = await this.offeringRepo.findByTeacherId(teacherId);

    // Map each offering's sessions to teacher's local timezone
    return offerings.map((offering) => ({
      id: offering.id,
      title: offering.title,
      price: offering.price,
      status: offering.status,
      course: offering.course,
      createdAt: offering.createdAt,
      sessions: offering.sessions.map((session) => ({
        id: session.id,
        startTimeUTC: session.startTime,
        endTimeUTC: session.endTime,
        startTimeLocal: toLocalString(session.startTime, teacher.timezone),
        endTimeLocal: toLocalString(session.endTime, teacher.timezone),
      })),
    }));
  }
}
