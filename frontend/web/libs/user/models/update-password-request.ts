import { z } from "zod";

export const updatePasswordRequestSchema = z.object({
  password: z.string().min(1),
  token: z.string().optional(),
})

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;