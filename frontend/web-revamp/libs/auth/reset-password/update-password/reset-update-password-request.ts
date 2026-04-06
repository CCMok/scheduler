import z from "zod";

export const resetUpdatePasswordRequestSchema = z.object({
  token: z.string(),
  password: z.string().min(1),
})

export type ResetUpdatePasswordRequest = z.infer<typeof resetUpdatePasswordRequestSchema>