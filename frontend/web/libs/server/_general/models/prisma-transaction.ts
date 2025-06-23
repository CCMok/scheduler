import { Prisma, PrismaClient } from "@/external/prisma-generated";
import { DefaultArgs } from "@/external/prisma-generated/runtime/library";

export type Transaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
