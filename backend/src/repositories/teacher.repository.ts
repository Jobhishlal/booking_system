import { Prisma, Teacher } from "@prisma/client";
import prisma from "../config/prisma";

export class TeacherRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx || prisma;
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<Teacher | null> {
    return this.getClient(tx).teacher.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<Teacher | null> {
    return this.getClient(tx).teacher.findUnique({
      where: { email },
    });
  }

  async create(
    data: Prisma.TeacherCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Teacher> {
    return this.getClient(tx).teacher.create({
      data,
    });
  }
}
