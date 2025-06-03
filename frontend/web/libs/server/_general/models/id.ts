import { z } from "zod";

export const idSchema = z.number().int().positive();

export type Id = z.infer<typeof idSchema>;