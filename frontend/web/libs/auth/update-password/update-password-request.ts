import z from "zod";

export const updatePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
})

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>