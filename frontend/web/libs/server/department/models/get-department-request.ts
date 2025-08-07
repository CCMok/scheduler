import { Department } from "@/external/prisma-generated";
import { z } from "zod";

export const departmentOrderByFieldSchema = z.enum([
  'id',
  'name',
  'organizationId',
] as const satisfies (keyof Department)[])