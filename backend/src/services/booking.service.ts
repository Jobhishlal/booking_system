import prisma from "../config/prisma";
import { ParentRepository } from "../repositories/parent.repository";
import { OfferingRepository } from "../repositories/offering.repository";
import { SessionRepository } from "../repositories/session.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { NotFoundError, BadRequestError, ConflictError } from "../utils/errors";
import { findSessionConflict } from "../utils/conflict";
import { toLocalString } from "../utils/timezone";
import { ERROR_MESSAGES } from "../constants/messages";

export class BookingService {
  constructor(
    private parentRepo = new ParentRepository(),
    private offeringRepo = new OfferingRepository(),
    private sessionRepo = new SessionRepository(),
    private bookingRepo = new BookingRepository()
  ) {}

  async bookOffering(parentId: string, offeringId: string) {
  
    return prisma.$transaction(async (tx) => {
     
      const parents: any[] = await tx.$queryRaw`
        SELECT id, timezone FROM parents WHERE id = ${parentId} FOR UPDATE
      `;
      const parent = parents[0];
      if (!parent) {
        throw new NotFoundError(ERROR_MESSAGES.PARENT_NOT_FOUND);
      }

      const offering = await this.offeringRepo.findById(offeringId, tx);
      if (!offering) {
        throw new NotFoundError(ERROR_MESSAGES.OFFERING_NOT_FOUND);
      }

      if (offering.status !== "AVAILABLE") {
        throw new BadRequestError(ERROR_MESSAGES.OFFERING_NOT_AVAILABLE);
      }

      // 3. Prevent duplicate bookings of the same offer


      const alreadyBooked = await this.bookingRepo.exists(parentId, offeringId, tx);
      if (alreadyBooked) {
        throw new BadRequestError("You have already booked this offering");
      }

      // 4. Fetch the target offering's sessions
      const newSessions = offering.sessions;
      if (newSessions.length === 0) {
        throw new BadRequestError("This offering does not have any scheduled sessions");
      }

      // 5. Fetch all sessions already booked by this parent
      const existingSessions = await this.sessionRepo.findSessionsByParentId(parentId, tx);

      // 6. Check for conflicts / overlaps
      const conflict = findSessionConflict(newSessions, existingSessions);
      if (conflict) {
        const localNewStart = toLocalString(conflict.newSession.startTime, parent.timezone);
        const localNewEnd = toLocalString(conflict.newSession.endTime, parent.timezone);
        const localExistStart = toLocalString(conflict.existingSession.startTime, parent.timezone);
        const localExistEnd = toLocalString(conflict.existingSession.endTime, parent.timezone);

        throw new ConflictError(
          `${ERROR_MESSAGES.SESSION_OVERLAP_CONFLICT}. ` +
          `Session from new offering (${localNewStart} to ${localNewEnd}) overlaps with an already booked session (${localExistStart} to ${localExistEnd}).`
        );
      }

      
      const booking = await this.bookingRepo.create(
        {
          parentId,
          offeringId,
        },
        tx
      );

      return {
        id: booking.id,
        parentId: booking.parentId,
        offeringId: booking.offeringId,
        bookingTime: booking.bookingTime,
        status: booking.status,
        createdAt: booking.createdAt,
      };
    });
  }
}
