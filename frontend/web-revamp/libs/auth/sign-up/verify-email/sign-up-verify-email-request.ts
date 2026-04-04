import z from "zod";

export const signUpVerifyEmailRequestSchema = z.object({
  token: z.string().min(1),
})

export type SignUpVerifyEmailRequest = z.infer<typeof signUpVerifyEmailRequestSchema>