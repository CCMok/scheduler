import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { Prisma } from "@/external/prisma-generated";

export const getWorkersRequestSchema = z.object({
  departmentId: idSchema,
  orderBy: z.nativeEnum(Prisma.SortOrder).optional(),
});

export type GetWorkersRequest = z.infer<typeof getWorkersRequestSchema>;