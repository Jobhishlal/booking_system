import { ParentRepository } from "../repositories/parent.repository";
import { OfferingRepository } from "../repositories/offering.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { NotFoundError } from "../utils/errors";
import { toLocalString } from "../utils/timezone";
import { ERROR_MESSAGES } from "../constants/messages";

export class ParentService {
  constructor(
    private parentRepo = new ParentRepository(),
    private offeringRepo = new OfferingRepository(),
    private bookingRepo = new BookingRepository()
  ) {}

  async getAvailableOfferings(parentId: string) {
    const parent = await this.parentRepo.findById(parentId);
    if (!parent) {
      throw new NotFoundError(ERROR_MESSAGES.PARENT_NOT_FOUND);
    }

    const offerings = await this.offeringRepo.findAvailable();

    return offerings.map((offering) => ({
      id: offering.id,
      title: offering.title,
      price: offering.price,
      status: offering.status,
      course: offering.course,
      teacher: {
        id: offering.teacher.id,
        name: offering.teacher.name,
        email: offering.teacher.email,
      },
      createdAt: offering.createdAt,
      sessions: offering.sessions.map((session: any) => ({
        id: session.id,
        startTimeUTC: session.startTime,
        endTimeUTC: session.endTime,
        startTimeLocal: toLocalString(session.startTime, parent.timezone),
        endTimeLocal: toLocalString(session.endTime, parent.timezone),
      })),
    }));
  }

  async getBookings(parentId: string) {
    const parent = await this.parentRepo.findById(parentId);
    if (!parent) {
      throw new NotFoundError(ERROR_MESSAGES.PARENT_NOT_FOUND);
    }

    const bookings = await this.bookingRepo.findByParentId(parentId);

    return bookings.map((booking) => ({
      id: booking.id,
      bookingTime: booking.bookingTime,
      status: booking.status,
      createdAt: booking.createdAt,
      offering: {
        id: booking.offering.id,
        title: booking.offering.title,
        price: booking.offering.price,
        status: booking.offering.status,
        course: booking.offering.course,
        teacher: {
          id: booking.offering.teacher.id,
          name: booking.offering.teacher.name,
          email: booking.offering.teacher.email,
        },
        sessions: booking.offering.sessions.map((session: any) => ({
          id: session.id,
          startTimeUTC: session.startTime,
          endTimeUTC: session.endTime,
          startTimeLocal: toLocalString(session.startTime, parent.timezone),
          endTimeLocal: toLocalString(session.endTime, parent.timezone),
        })),
      },
    }));
  }
}
