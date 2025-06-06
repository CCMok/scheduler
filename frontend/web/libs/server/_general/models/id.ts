import { z } from "zod";

export const idSchema = z.number().int().min(0);

export type Id = z.infer<typeof idSchema>;