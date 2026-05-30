import { Prisma, Session } from "@prisma/client";
import prisma from "../config/prisma";

export class SessionRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx || prisma;
  }

  async createMany(
    sessions: Array<{ offeringId: string; startTime: Date; endTime: Date }>,
    tx?: Prisma.TransactionClient
  ): Promise<Prisma.BatchPayload> {
    return this.getClient(tx).session.createMany({
      data: sessions,
    });
  }

  async findByOfferingId(
    offeringId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Session[]> {
    return this.getClient(tx).session.findMany({
      where: { offeringId },
      orderBy: { startTime: "asc" },
    });
  }

  async findSessionsByParentId(
    parentId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Array<{ startTime: Date; endTime: Date }>> {
    return this.getClient(tx).session.findMany({
      where: {
        offering: {
          bookings: {
            some: {
              parentId,
              status: "CONFIRMED",
            },
          },
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });
  }
}
