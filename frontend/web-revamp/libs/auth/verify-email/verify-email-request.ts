import z from "zod";

export const verifyEmailRequestSchema = z.object({
  token: z.string().min(1),
})

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>