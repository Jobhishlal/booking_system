import { Prisma, Course } from "@prisma/client";
import prisma from "../config/prisma";

export class CourseRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx || prisma;
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<Course | null> {
    return this.getClient(tx).course.findUnique({
      where: { id },
    });
  }

  async create(
    data: Prisma.CourseCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Course> {
    return this.getClient(tx).course.create({
      data,
    });
  }
}
