import { Prisma } from "@/external/prisma-generated";
import { z } from "zod";

export const createGetRequestWhere = <T extends z.ZodTypeAny>(where: T) =>
  z.object({
    where: where?.optional(),
  });

export const createGetRequestRelate = <T extends z.ZodTypeAny>(relate: T) =>
  z.object({
    relate: relate?.optional(),
  });

export const createGetRequestOrderBy = <
  TObjectSchema extends z.ZodTypeAny,
  TFieldSchema extends z.ZodTypeAny,
>(
  object: TObjectSchema,
  field: TFieldSchema,
) =>
  z.object({
    orderBy: z.object({
      object,
      field,
      direction: z.nativeEnum(Prisma.SortOrder),
    }).array().optional(),
  });