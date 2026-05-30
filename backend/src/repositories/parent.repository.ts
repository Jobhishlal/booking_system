import { Prisma, Parent } from "@prisma/client";
import prisma from "../config/prisma";

export class ParentRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx || prisma;
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<Parent | null> {
    return this.getClient(tx).parent.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<Parent | null> {
    return this.getClient(tx).parent.findUnique({
      where: { email },
    });
  }

  async create(
    data: Prisma.ParentCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Parent> {
    return this.getClient(tx).parent.create({
      data,
    });
  }
}
