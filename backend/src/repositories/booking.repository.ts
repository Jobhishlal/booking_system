import { Prisma, Booking } from "@prisma/client";
import prisma from "../config/prisma";

export class BookingRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx || prisma;
  }

  async create(
    data: Prisma.BookingUncheckedCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Booking> {
    return this.getClient(tx).booking.create({
      data,
    });
  }

  async findByParentId(
    parentId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Array<Booking & { offering: any }>> {
    return this.getClient(tx).booking.findMany({
      where: { parentId },
      include: {
        offering: {
          include: {
            course: true,
            teacher: true,
            sessions: {
              orderBy: {
                startTime: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as any;
  }

  async exists(
    parentId: string,
    offeringId: string,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    const booking = await this.getClient(tx).booking.findUnique({
      where: {
        parentId_offeringId: {
          parentId,
          offeringId,
        },
      },
    });
    return booking !== null;
  }
}
