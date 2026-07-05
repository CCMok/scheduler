import z from "zod";

export const resetPasswordVerifyTokenRequestSchema = z.object({
  token: z.string().min(1),
})

export type ResetPasswordVerifyTokenRequest = z.infer<typeof resetPasswordVerifyTokenRequestSchema>