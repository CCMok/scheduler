import z from "zod";

export const signUpVerifyTokenRequestSchema = z.object({
  token: z.string().min(1),
})

export type SignUpVerifyTokenRequest = z.infer<typeof signUpVerifyTokenRequestSchema>