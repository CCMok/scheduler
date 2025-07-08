import { z } from "zod";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>