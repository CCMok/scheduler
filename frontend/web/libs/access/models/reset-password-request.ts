import { z } from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
})

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>