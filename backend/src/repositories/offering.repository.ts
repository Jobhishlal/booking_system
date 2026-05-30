import { Prisma, Offering } from "@prisma/client";
import prisma from "../config/prisma";

export class OfferingRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx || prisma;
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<(Offering & { course: any; sessions: any[] }) | null> {
    return this.getClient(tx).offering.findUnique({
      where: { id },
      include: {
        course: true,
        sessions: {
          orderBy: {
            startTime: "asc",
          },
        },
      },
    }) as any;
  }

  async create(
    data: Prisma.OfferingUncheckedCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Offering> {
    return this.getClient(tx).offering.create({
      data,
    });
  }

  async findByTeacherId(
    teacherId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Array<Offering & { course: any; sessions: any[] }>> {
    return this.getClient(tx).offering.findMany({
      where: { teacherId },
      include: {
        course: true,
        sessions: {
          orderBy: {
            startTime: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as any;
  }

  async findAvailable(
    tx?: Prisma.TransactionClient
  ): Promise<Array<Offering & { course: any; sessions: any[]; teacher: any }>> {
    return this.getClient(tx).offering.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        course: true,
        teacher: true,
        sessions: {
          orderBy: {
            startTime: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as any;
  }
}
