import { z } from "zod";

export const verifyEmailTokenRequestSchema = z.object({
  token: z.string().min(1),
})

export type VerifyEmailTokenRequest = z.infer<typeof verifyEmailTokenRequestSchema>