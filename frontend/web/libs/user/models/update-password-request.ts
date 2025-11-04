import { z } from "zod";

export const updatePasswordRequestSchema = z.object({
  password: z.string().min(1),
})

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;