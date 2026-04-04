import z from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.email(),
})

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>