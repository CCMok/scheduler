import { z } from "zod";

export const idSchema = z.number().int().min(0);

export type Id = z.infer<typeof idSchema>;

export const coerceIdSchema = z.coerce.number().int().min(0);

export type CoerceId = z.infer<typeof coerceIdSchema>;