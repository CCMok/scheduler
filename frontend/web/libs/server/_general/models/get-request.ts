import { Prisma } from "@/external/prisma-generated";
import { z } from "zod";

export const createGetRequestWhere = <T extends z.ZodTypeAny>(where: T) =>
  z.object({
    where: where?.optional(),
    take: z.number().optional(),
  });

export const createGetRequestRelate = <T extends z.ZodTypeAny>(relate: T) =>
  z.object({
    relate: relate?.array().optional(),
  });

export const createGetRequestOrderBy = <
  TObjectSchema extends z.ZodTypeAny,
  TFieldSchema extends z.ZodTypeAny,
>(
  level: TObjectSchema,
  field: TFieldSchema,
) =>
  z.object({
    level,
    field,
    direction: z.nativeEnum(Prisma.SortOrder).optional(),
  })

export const createGetRequestOrderByArray = <T extends z.ZodTypeAny>(
  orderBy: T,
) =>
  z.object({
    orderBys: orderBy.array().optional(),
  });