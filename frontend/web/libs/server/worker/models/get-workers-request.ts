import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { PrismaSortDirection } from "@/libs/client/_general/enums/prisma-sort-direction";

export const getWorkersRequestSchema = z.object({
  departmentId: idSchema,
  orderBy: z.nativeEnum(PrismaSortDirection).optional(),
});

export type GetWorkersRequest = z.infer<typeof getWorkersRequestSchema>;